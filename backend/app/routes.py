from flask import render_template, redirect, url_for, flash, request,jsonify,make_response
from flask_login import login_user, logout_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from app import app, db
from app.models import User
from app.models import Team
from app.models import UserTeam
from app.models import TestCase, TestCaseElement,TaskList,Task,TestEvent,TestReport
# from test_cases import TestCases

from .test_cases  import run_tests
import unittest
import HtmlTestRunner
import jwt
from datetime import datetime, timedelta
from sqlalchemy.exc import SQLAlchemyError
import logging
import base64
import json
import os


@app.after_request
def add_cors_headers(response):
    allowed_origins = ['https://139.155.144.136', 'http://localhost:3000']
    origin = request.headers.get('Origin')
    if origin in allowed_origins:
        response.headers.add('Access-Control-Allow-Origin', origin)
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, 'YOUR_SECRET_KEY', algorithms=["HS256"])
            # 这里可以获取 token 中的用户信息，并检查用户权限等
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token is expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(*args, **kwargs)

    return decorated

# user part
@app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        data = request.get_json()
        username = data['username']
        password = data['password']
        email = data['email']

        # Check if email already exists in the database
        existing_email = User.query.filter_by(email=email).first()
        if existing_email:
            return jsonify(message='Email already in use. Please use a different email.', status='error')

        hashed_password = generate_password_hash(password)
        new_user = User(username=username, password=hashed_password,email=email)

        db.session.add(new_user)
        db.session.commit()
        new_user_id = new_user.user_id

        # 生成令牌
        token = jwt.encode(
            {"user_id": new_user_id, "exp": datetime.utcnow() + timedelta(hours=1)},
            app.config["SECRET_KEY"],
        )
        resp = make_response(jsonify({"message": 'Registration successful, please log in.', "status": 'success',"user_id":new_user_id}))
        resp.set_cookie("token", token, max_age=60 * 60, secure=True, httponly=False, samesite="Strict")

        return resp

@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        email = data['email']
        password = data['password']

        user = User.query.filter_by(email=email).first()

        if user is not None and check_password_hash(user.password, password):
            login_user(user)

            # 生成令牌
            token = jwt.encode(
                {"user_id": user.user_id, "exp": datetime.utcnow() + timedelta(hours=1)},
                app.config["SECRET_KEY"],
            )
            resp = make_response(jsonify(message='Login successful.', status='success', user_id=user.user_id))

            # 设置令牌 cookie
            resp.set_cookie("token", token, max_age=60 * 60, secure=True, httponly=False, samesite="Strict")

            return resp

        return jsonify(message='Login failed.', status='failed')

    
@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.', 'info')
    return redirect(url_for('login'))

@app.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)

    if user is None:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "username": user.username,
        "email": user.email
    })

@app.route('/infoEdit/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    # 检查请求中是否包含JSON数据
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400

    # 获取请求中的数据
    data = request.get_json()

    # 根据user_id查找用户
    user = User.query.get(user_id)

    if user is None:
        return jsonify({"error": "User not found"}), 404

    # 更新用户名和描述
    if "username" in data:
        user.username = data["username"]
    if "description" in data:
        user.description = data["description"]

    # 提交更改到数据库
    db.session.commit()

    return jsonify({"status": "success"}), 200

@app.route('/changePassword/<int:user_id>', methods=['PUT'])
def change_password(user_id):
    if not request.is_json:
        return jsonify({"status": "error", "message": "Missing JSON in request"}), 400

    data = request.get_json()

    user = User.query.get(user_id)

    if user is None:
        return jsonify({"status": "error", "message": "User not found"}), 404

    if "old_password" not in data or "new_password" not in data:
        return jsonify({"status": "error", "message": "Missing old_password or new_password in request"}), 400

    if not check_password_hash(user.password,  data["old_password"]):
        return jsonify({"status": "error", "message": "Incorrect old password"}), 403
    hashed_password = generate_password_hash(data["new_password"])
    user.password = hashed_password
    db.session.commit()

    return jsonify({"status": "success", "message": "Password changed successfully"}), 200

@app.route('/updateEmail/<int:user_id>', methods=['PUT'])
def update_email(user_id):
    if not request.is_json:
        return jsonify({"status": "error", "message": "Missing JSON in request"}), 400

    data = request.get_json()

    user = User.query.get(user_id)

    if user is None:
        return jsonify({"status": "error", "message": "User not found"}), 404

    if "email" not in data:
        return jsonify({"status": "error", "message": "Missing email in request"}), 400

    existing_user = User.query.filter_by(email=data["email"]).first()
    if existing_user:
        return jsonify({"status": "error", "message": "Email already in use"}), 400

    user.email = data["email"]
    db.session.commit()

    return jsonify({"status": "success", "message": "Email updated successfully"}), 200


@app.route('/searchUsers', methods=['GET'])
def search_users():
    userName = request.args.get('userName', '')
    user_id = request.args.get('user_id', None)  # Get the passed user_id

    if not userName:
        return jsonify({"error": "Search term is required"}), 400

    # Exclude the user_id from search results
    users = User.query.with_entities(User.user_id, User.username, User.email, User.description, User.avatar_link).filter(User.username.like(f'%{userName}%'), User.user_id != user_id).all()

    if not users:
        return jsonify({"error": "No users found"}), 404

    return jsonify({"status": "success", "users": [
        {
            "user_id": user.user_id,
            "username": user.username,
            "email": user.email,
            "description": user.description,
            "avatar_link": user.avatar_link
        } for user in users
    ]})


@app.route('/createTeam', methods=['POST'])
def create_team():
    data = request.get_json()

    team_name = data.get('team_name', '')
    team_description = data.get('team_description', '')
    team_members = data.get('team_members', [])
    user_id = data.get('user_id', None)

    if not team_name:
        return jsonify({"status": "failed", "error": "Team name is required"}), 400

    if not team_members:
        return jsonify({"status": "failed", "error": "Team must have at least one member"}), 400

    if not user_id:
        return jsonify({"status": "failed", "error": "Manager user_id is required"}), 400

    manager = User.query.get(user_id)
    if not manager:
        return jsonify({"status": "failed", "error": f"User with ID {user_id} not found"}), 400

    new_team = Team(
        name=team_name,
        description=team_description,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        manager_id=user_id
    )

    # Add manager as a member with role 'manager'
    manager_membership = UserTeam(
        user_id=user_id,
        role='manager',
        joined_at=datetime.utcnow()
    )
    new_team.members.append(manager_membership)

    for member_id in team_members:
        user = User.query.get(member_id)
        if user:
            new_member = UserTeam(
                user_id=member_id,
                role='member',
                joined_at=datetime.utcnow()
            )
            new_team.members.append(new_member)
        else:
            return jsonify({"status": "failed", "error": f"User with ID {member_id} not found"}), 400

    try:
        db.session.add(new_team)
        db.session.commit()
    except SQLAlchemyError as e:
        print(e)  # Print the error message
        db.session.rollback()  # Rollback any changes
        return jsonify({"status": "failed", "error": "An error occurred while adding the team"}), 500

    return jsonify({"status": "success", "team_id": new_team.team_id})

@app.route('/getTeamMembers/<int:team_id>', methods=['GET'])
def get_team_members(team_id):
    team = Team.query.get(team_id)
    if not team:
        return jsonify({"status": "failed", "error": "Team not found"}), 404

    members = team.members
    member_data = []

    # Find manager membership in the members list
    manager_membership = next((member for member in members if member.user_id == team.manager_id), None)

    if manager_membership:
        manager = manager_membership.user
        member_data.append({
            'user_id': manager.user_id,
            'username': manager.username,
            'email': manager.email,
            'role': 'manager',
            'joined_at': manager_membership.joined_at.isoformat(),
            'avatar_link': manager.avatar_link,
        })

    for member in members:
        if member.user_id == team.manager_id:
            continue  # Skip manager since it's already added

        user = member.user
        member_data.append({
            'user_id': user.user_id,
            'username': user.username,
            'email': user.email,
            'role': member.role,
            'joined_at': member.joined_at.isoformat(),
            'avatar_link': user.avatar_link,
        })

    return jsonify({"status": "success", "members": member_data})

@token_required
@app.route('/getUserTeams/<int:user_id>', methods=['GET'])
def get_user_teams(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"status": "failed", "error": "User not found"}), 404

    user_teams = user.teams
    team_data = []

    for user_team in user_teams:
        team = user_team.team
        team_data.append({
            'team_id': team.team_id,
            'name': team.name,
            'joined_at': user_team.joined_at.isoformat()
        })

    return jsonify({"status": "success", "teams": team_data})

@app.route('/getTeamScript/<int:team_id>', methods=['GET'])
def get_team_script(team_id):
    test_events = TestEvent.query.filter_by(team_id=team_id).all()

    if test_events:
        test_event_data = [{"id": event.id, "name": event.name, "created_at": event.created_at, "created_by": event.creator.username, "environment": event.environment, "label": event.label, "state": event.state} for event in test_events]
        return jsonify(test_event_data)
    else:
        return jsonify({"message": "No TestEvent found for the given team_id"}), 404
    
@app.route('/saveTask', methods=['POST'])
def save_task():
    data = request.get_json()
    task_lists = data['taskLists']
    team_id = data['team_id']

    try:
        # 删除现有任务列表和任务
        Task.query.filter(Task.task_list_id.in_(
            db.session.query(TaskList.id).filter(TaskList.team_id == team_id)
        )).delete(synchronize_session=False)
        TaskList.query.filter(TaskList.team_id == team_id).delete(synchronize_session=False)
        db.session.commit()

        # 保存新的任务列表和任务
        for task_list_data in task_lists:
            task_list = TaskList(
                name=task_list_data['name'],
                created_at=datetime.now(),  # 当前时间作为创建时间
                team_id=team_id
            )

            db.session.add(task_list)
            db.session.commit()

            for task_data in task_list_data['tasks']:
                task = Task(
                    title=task_data['text'],
                    description=None,  # 设置为 None，因为你的数据结构中没有描述字段
                    status='not started',  # 将状态设置为 not started，因为你的数据结构中没有状态字段
                    task_list_id=task_list.id,
                    user_case_id=task_data['testcase']
                )

                db.session.add(task)
                db.session.commit()

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error: " + str(e)}), 500

    return jsonify({"message": "Task data saved successfully"})

@app.route('/tasklists/<int:team_id>', methods=['GET'])
def get_task_lists(team_id):
    if not team_id:
        return jsonify({"error": "Missing team_id"}), 400

    try:
        team_id = int(team_id)
    except ValueError:
        return jsonify({"error": "Invalid team_id"}), 400

    task_lists = TaskList.query.filter_by(team_id=team_id).all()
    output = []
    for task_list in task_lists:
        tasks = []
        for task in task_list.tasks:
            tasks.append({
                'id': task.id,
                'text': task.title,
                'testcase': task.user_case_id
            })
        output.append({
            'id': task_list.id,
            'name': task_list.name,
            'tasks': tasks
        })
    return jsonify(output)

@app.route('/saveTestEvents', methods=['POST'])
def create_test_event():
    data = request.get_json()

    try:
        test_event_data = data['test_event']
        created_at = datetime.fromisoformat(test_event_data['created_at'].replace('Z', '+00:00'))
        test_event = TestEvent(
            name=test_event_data['name'],
            created_at=created_at,
            created_by=test_event_data['created_by'],
            environment=json.dumps(test_event_data['environment']),
            label=test_event_data['label'],
            state="In process",
            team_id=int(test_event_data['team_id'])
        )
        db.session.add(test_event)
        db.session.flush()
        print(data['test_cases'])
        for test_case_data in data['test_cases']:
            test_case = TestCase(
                created_at=created_at,
                type=test_case_data['type'],
                subtype=test_case_data['subtype'],  # 注意这里添加了 subtype
                parameters=test_case_data['parameters'],
                test_event_id=test_event.id
            )
            db.session.add(test_case)
            db.session.flush()

            for test_case_element_data in test_case_data['test_case_elements']:
                test_case_element = TestCaseElement(
                    story_id=test_case.id,
                    type=test_case_element_data['type'],
                    subtype=test_case_element_data['subtype'],  # 注意这里添加了 subtype
                    parameters=test_case_element_data['parameters']
                )
                db.session.add(test_case_element)

        db.session.commit()
        return jsonify(status='success', message='成功存入'), 201

    except KeyError as ke:
        db.session.rollback()
        print(f"KeyError: {ke}")
        return jsonify(status='failed', message=f"KeyError: {ke}"), 400
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify(status='failed', message=str(e)), 400

def construct_locator(locator_type, parameters):
    if locator_type == 'XPATH':
        return f'//button[contains(text(), "{parameters}")]'
    # You can add additional cases for other locator types if needed.
    return parameters

@app.route('/runTestEvents', methods=['POST'])
def run_test_event():
    data = request.get_json()
    try:
        test_event_data = data['test_event']
        created_at = datetime.fromisoformat(test_event_data['created_at'].replace('Z', '+00:00'))
        test_event = TestEvent(
            name=test_event_data['name'],
            created_at=created_at,
            created_by=test_event_data['created_by'],
            environment=json.dumps(test_event_data['environment']),
            label=test_event_data['label'],
            state="In process",
            team_id=int(test_event_data['team_id'])
        )
        db.session.add(test_event)
        db.session.flush()

        report_directory = "test_reports"
        base_directory = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        absolute_report_directory = os.path.join(base_directory, report_directory)

        os.makedirs(absolute_report_directory, exist_ok=True)

        test_case_list = data['test_cases']

        # 创建一个存储各个环境报告路径的列表
        report_files = []
        total_success_rate = 0  # 计算所有环境的平均成功率
        env_count = len(data['test_event']['environment'])

        for env in data['test_event']['environment']:
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            report_filename = f"report_{test_event.id}_{timestamp}.html"
            absolute_report_filepath = os.path.join(absolute_report_directory, report_filename)
            report_files.append(absolute_report_filepath)  # 将报告路径添加到列表中

            test_result = run_tests(env, test_case_list, absolute_report_filepath)
            passed_tests = test_result.testsRun - (len(test_result.failures) + len(test_result.errors))
            total_success_rate += (passed_tests / test_result.testsRun) * 100

        # 将报告路径列表转换为JSON字符串
        reports_json = json.dumps(report_files)
        
        # 计算平均成功率
        average_success_rate = total_success_rate / env_count
        
        # 创建一个新的测试报告对象
        test_report = TestReport(
            test_event_id=test_event.id,
            html_report=reports_json,
            success_rate=average_success_rate
        )
        
        # 添加新的测试报告到数据库
        db.session.add(test_report)
        db.session.commit()

        print("test_report.id", test_report.id)
        return jsonify(status='completed', message='Test completed', report_id=test_report.id), 201        

    except KeyError as ke:
        db.session.rollback()
        print(f"KeyError: {ke}")
        return jsonify(status='failed', message=f"KeyError: {ke}"), 400
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify(status='failed', message=str(e)), 400

# @app.route('/runTestEvents', methods=['POST'])
# def run_test_event():
#     data = request.get_json()
#     # print(data)
#     try:
#         test_event_data = data['test_event']
#         created_at = datetime.fromisoformat(test_event_data['created_at'].replace('Z', '+00:00'))
#         test_event = TestEvent(
#             name=test_event_data['name'],
#             created_at=created_at,
#             created_by=test_event_data['created_by'],
#             environment=json.dumps(test_event_data['environment']),
#             label=test_event_data['label'],
#             state="In process",
#             team_id=int(test_event_data['team_id'])
#         )
#         db.session.add(test_event)
#         db.session.flush()

#         # 生成报告文件名和路径
#         report_directory = "test_reports"
#         base_directory = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
#         absolute_report_directory = os.path.join(base_directory, report_directory)

#         os.makedirs(absolute_report_directory, exist_ok=True)

#         timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
#         report_filename = f"report_{test_event.id}_{timestamp}.html"
#         report_filepath = os.path.join(report_directory, report_filename)
#         absolute_report_filepath = os.path.join(absolute_report_directory, report_filename)

#         # 在 test_event 中存储报告的相对路径
#         test_event.report_url = report_filepath
#         db.session.commit()

#         # 获取测试用例
#         test_case_list = data['test_cases']
#         # 获取浏览器环境
#         for env in data['test_event']['environment']:
#             test_result = run_tests(env, test_case_list, absolute_report_filepath)
#             passed_tests = test_result.testsRun - (len(test_result.failures) + len(test_result.errors))
#             success_rate = (passed_tests / test_result.testsRun) * 100

#             # 创建一个新的测试报告对象
#             test_report = TestReport(
#                 test_event_id=test_event.id,
#                 html_report=absolute_report_filepath,  
#                 # success_rate=float(test_result.wasSuccessful())  
#                 success_rate=success_rate
#             )
#             # 添加新的测试报告到数据库
#             db.session.add(test_report)
#             db.session.commit()
        
#         if test_result.wasSuccessful():
#             print("test_report.id",test_report.id)
#             return jsonify(status='success', message='Test successfully completed', report_id=test_report.id), 201
#         else:
#             return jsonify(status='failed', message='Test not successfully completed', report_id=test_report.id), 201

#     except KeyError as ke:
#         db.session.rollback()
#         print(f"KeyError: {ke}")
#         return jsonify(status='failed', message=f"KeyError: {ke}"), 400
#     except Exception as e:
#         db.session.rollback()
#         print(e)
#         return jsonify(status='failed', message=str(e)), 400
    
def merge_html_reports(report_paths):
    merged_content = ""
    for path in report_paths:
        with open(path, 'r', encoding='utf-8') as f:
            merged_content += f.read()
    return merged_content

@app.route('/test-report/<int:report_id>', methods=['GET'])
# def get_test_report(report_id):
#     report = TestReport.query.filter_by(id=report_id).first()
#     if report:
#         test_event = TestEvent.query.filter_by(id=report.test_event_id).first()
#         if test_event:
#             # 从报告的文件夹路径中获取报告的文件列表
#             report_folder = report.html_report
#             files_and_directories = os.listdir(report_folder)

#             # 寻找第一个文件
#             report_file = None
#             for item in files_and_directories:
#                 full_path = os.path.join(report_folder, item)
#                 if os.path.isfile(full_path):
#                     report_file = full_path
#                     break

#             # 检查是否找到文件
#             if report_file is None:
#                 return jsonify({'error': 'Report file not found'}), 404

#             with open(report_file, 'r', encoding='utf-8') as f:
#                 html_content = f.read()

#             encoded_html_report = base64.b64encode(html_content.encode('utf-8')).decode('utf-8')
            
#             # Get the username associated with test_event.created_by
#             created_by_username = test_event.creator.username

#             report_data = {
#                 'name': test_event.name,
#                 'createdAt': test_event.created_at.strftime('%Y-%m-%d %H:%M:%S'),
#                 'createdBy': created_by_username,  # Use the retrieved username here
#                 'test_event_id': report.test_event_id,
#                 'environment': test_event.environment,
#                 'labels': test_event.label.split(','),
#                 'state': test_event.state,
#                 'successRate': report.success_rate,
#                 'htmlReport': encoded_html_report,
#             }
#             return jsonify(report_data), 200

#     return jsonify({'error': 'Report not found'}), 404
def get_test_report(report_id):
    report = TestReport.query.filter_by(id=report_id).first()
    
    if not report:
        print("Report not found.")
        return jsonify({'error': 'Report not found'}), 404

    # 尝试解析 report.html_report 为一个Python列表
    try:
        report_files = json.loads(report.html_report)
    except json.JSONDecodeError:
        print("Report contains invalid JSON.")
        return jsonify({'error': 'Report contains invalid JSON'}), 404

    test_event = TestEvent.query.filter_by(id=report.test_event_id).first()
    if not test_event:
        print("Associated Test Event not found.")
        return jsonify({'error': 'Associated Test Event not found'}), 404

    encoded_html_reports = []

    for report_file_path in report_files:
        # 简单的路径验证：只处理指定文件夹中的报告
        if "dissertation-UI-test-platform\\backend\\test_reports" not in report_file_path:
            print(f"Invalid file path: {report_file_path}")
            continue

        if not os.path.exists(report_file_path):
            print(f"File not found: {report_file_path}")
            continue

        try:
            with open(report_file_path, 'r', encoding='utf-8') as f:
                html_content = f.read()
                encoded_html_report = base64.b64encode(html_content.encode('utf-8')).decode('utf-8')
                encoded_html_reports.append(encoded_html_report)
        except Exception as e:
            # 这里可以记录错误，或者返回具体的错误信息给前端
            print(f"Error reading file {report_file_path}: {e}")
            continue

    # 获取与test_event.created_by关联的用户名
    created_by_username = test_event.creator.username

    report_data = {
        'name': test_event.name,
        'createdAt': test_event.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'createdBy': created_by_username,
        'test_event_id': report.test_event_id,
        'environment': test_event.environment,
        'labels': test_event.label.split(','),
        'state': test_event.state,
        'successRate': report.success_rate,
        'htmlReports': encoded_html_reports,  # 注意这里是列表，包含多个报告
    }
    print("Report Data:", report_data)
    return jsonify(report_data), 200


@app.route('/testEventName', methods=['GET'])
def get_testevent_name():
    testevent_id = request.args.get('testeventID', type=int)

    if testevent_id is not None:
        testevent = TestEvent.query.get(testevent_id)

        if testevent is not None:
            return jsonify({'name': testevent.name})
        else:
            return jsonify({'error': 'TestEvent not found'}), 404
    else:
        return jsonify({'error': 'testeventID parameter is required'}), 400

@app.route('/getTestCases', methods=['GET'])
def get_testcases():
    testevent_id = request.args.get('testeventID', type=int)

    if testevent_id is not None:
        testevent = TestEvent.query.get(testevent_id)

        if testevent is not None:
            test_cases = TestCase.query.filter_by(test_event_id=testevent_id).order_by(TestCase.created_at).all()
            result = []

            for index, test_case in enumerate(test_cases):
                children = []
                elements = TestCaseElement.query.filter_by(story_id=test_case.id).order_by(TestCaseElement.id).all()

                for element in elements:
                    child = {
                        "type": element.type,
                        "inputValue": element.parameters,
                        "isNew": False,
                        "isChild": True,
                        "parentId": test_case.id,
                        "index": elements.index(element)
                    }
                    children.append(child)

                tc = {
                    "id": test_case.id,
                    "type": test_case.type,
                    "children": children,
                    "inputValue": test_case.parameters,
                    "isNew": False,
                    "isChild": False,
                    "index": index
                }
                result.append(tc)

            return jsonify(result)
        else:
            return jsonify({'error': 'TestEvent not found'}), 404
    else:
        return jsonify({'error': 'testeventID parameter is required'}), 400


@app.route('/searchTestCase', methods=['POST'])
def search_test_case():
    data = request.get_json()
    test_id = data.get('TestReportid')

    if not test_id:
        return jsonify({"error": "TestReportid is required"}), 400

    # 在 TestReport 表中搜索包含 test_id 的 test_event_id
    test_reports = TestReport.query.filter_by(id=test_id).all()

    if not test_reports:
        return jsonify({"status": "No matching TestReports found"}), 404

    results = []
    for test_report in test_reports:
        test_event = TestEvent.query.filter_by(id=test_report.test_event_id).first()

        if test_event:
            result = {
                "id": test_report.id,
                "test_event_name": test_event.name,
                "success_rate": test_report.success_rate
            }
            results.append(result)
    return jsonify(status='success', results=results), 200

@app.route('/searchTestReport', methods=['POST'])
def search_test_report():
    data = request.get_json()
    test_id = data.get('TestCaseid')

    if not test_id:
        return jsonify({"error": "TestReportid is required"}), 400

    # 在 TestReport 表中搜索包含 test_id 的 test_event_id
    test_reports = TestReport.query.filter_by(test_event_id=test_id).all()

    if not test_reports:
        return jsonify({"status": "No matching TestReports found"})

    results = []
    for test_report in test_reports:
        test_event = TestEvent.query.filter_by(id=test_report.test_event_id).first()

        if test_event:
            result = {
                "id": test_report.id,
                "test_event_name": test_event.name,
                "success_rate": test_report.success_rate
            }
            results.append(result)
    return jsonify(status='success', results=results), 200