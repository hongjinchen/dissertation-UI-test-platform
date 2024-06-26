from flask import render_template, redirect, url_for, flash, request, jsonify, make_response
from flask_login import login_user, logout_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from app import app, db
from app.models import TestCase, TestCaseElement, TaskList, Task, TestEvent, TestReport, UserContribution, UserTeam, Team, User
from smtplib import SMTPRecipientsRefused
from sqlalchemy.orm import joinedload
from .mail_service import send_email
from .test_cases import run_tests
import jwt
from jinja2 import Environment, FileSystemLoader
from datetime import datetime, timedelta
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import or_
import base64
import json
import os
import random
from email.utils import formataddr
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from smtplib import SMTP_SSL
import redis

@app.after_request
def add_cors_headers(response):
    allowed_origins = ['https://139.155.144.136', 'https://perksummit.club', 'http://localhost:3000']
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
        new_user = User(username=username,
                        password=hashed_password, email=email)

        db.session.add(new_user)
        db.session.commit()
        new_user_id = new_user.user_id

        # Generating tokens
        token = jwt.encode(
            {"user_id": new_user_id, "exp": datetime.utcnow() + timedelta(hours=1)},
            app.config["SECRET_KEY"],
        )
        resp = make_response(jsonify(
            {"message": 'Registration successful, please log in.', "status": 'success', "user_id": new_user_id}))
        resp.set_cookie("token", token, max_age=60 * 60,
                        secure=True, httponly=False, samesite="Strict")

        return resp


@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        email = data['email']
        password = data['password']

        user = User.query.filter_by(email=email).first()
        print("1",user)
        if user is not None and check_password_hash(user.password, password):
            print("2",user)
            login_user(user)

            # Generating tokens
            token = jwt.encode(
                {"user_id": user.user_id, "exp": datetime.utcnow() +
                 timedelta(hours=1)},
                app.config["SECRET_KEY"],
            )
            resp = make_response(
                jsonify(message='Login successful.', status='success', user_id=user.user_id, token=token))

            # Setting a token cookie
            resp.set_cookie("token", token, max_age=60 * 60,
                            secure=True, httponly=False, samesite="Strict")

            return resp

        return jsonify(message='Login failed.', status='failed')

def generate_verification_code(length=4):
    numbers = '0123'
    return ''.join(random.choice(numbers) for _ in range(length))

def send_verification_code(receiver_email, verification_code):
    host_server = 'smtp.qq.com'
    sender_qq = '775363056@qq.com'
    pwd = 'jytfijrqbwxnbege'  # QQ邮箱SMTP服务的授权码
    sender_qq_mail = '775363056@qq.com'
    mail_title = 'Your Verification Code'
    
    # 创建一个MIMEMultipart类的实例
    msg = MIMEMultipart()
    msg["Subject"] = Header(mail_title, 'utf-8')
    msg["From"] = formataddr(("Your Service Name", sender_qq_mail))
    msg["To"] = receiver_email

    # 邮件正文内容
    mail_content = f"Hello, your verification code is: {verification_code}. Please use this code to complete your operation."
    msg.attach(MIMEText(mail_content, 'plain', 'utf-8'))
    
    try:
        smtp = SMTP_SSL(host_server)
        smtp.set_debuglevel(0)  # 设置为1会打印出和SMTP服务器交互的所有信息
        smtp.ehlo(host_server)
        smtp.login(sender_qq, pwd)
        
        smtp.sendmail(sender_qq_mail, receiver_email, msg.as_string())
        smtp.quit()
        print("Mail sent successfully.")
    except Exception as e:
        print(f"Failed to send mail, error: {e}")

# 连接到Redis服务器
redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
        
@app.route('/check-email', methods=['POST'])
def check_email_existence():
    email = request.json.get('email')
    if not email:
        return jsonify({"status": "fail", "message": "Email is required!"}), 400

    user = User.query.filter_by(email=email).first()

    if user:
        # 生成验证码
        verification_code = generate_verification_code()

        # 使用Redis存储验证码和设置15分钟过期
        redis_client.setex(f"verification_code:{email}", timedelta(minutes=15), value=verification_code)
        send_verification_code(email, verification_code)

        return jsonify({"status": "success", "message": "Verification code sent to email."}), 200

    else:
        return jsonify({"status": "fail", "message": "Email not found!"}), 404

@app.route('/verify-code', methods=['POST'])
def verify_code():
    email = request.json.get('email')
    code = request.json.get('code')
    
    # 从Redis获取验证码
    stored_code = redis_client.get(f"verification_code:{email}")
    if stored_code and stored_code == code:
        # 验证码匹配
        return jsonify({"status": "success", "message": "Code verified!"}), 200
    else:
        return jsonify({"status": "fail", "message": "Invalid code or code expired!"}), 400
    
@app.route('/update-password', methods=['PUT'])
def update_password():
    email = request.json.get('email')
    new_password = request.json.get('password')

    # Fetch the user
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"status": "fail", "message": "Email not found!"}), 404

    # Hash the new password
    hashed_password = generate_password_hash(new_password)
    # Update the password
    user.password = hashed_password
    db.session.commit()

    return jsonify({"status": "success", "message": "Password updated successfully!"}), 200

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
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400

    data = request.get_json()

    user = User.query.get(user_id)

    if user is None:
        return jsonify({"error": "User not found"}), 404

    if "username" in data:
        user.username = data["username"]

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
    searchTerm = request.args.get('searchTerm', '')

    if not searchTerm:
        return jsonify({"error": "Search term is required"}), 400

    users_query = User.query.with_entities(User.user_id, User.username, User.email, User.description, User.avatar_link).filter(
        or_(
            User.username.like(f'%{searchTerm}%'),
            User.email.like(f'%{searchTerm}%'),
            User.user_id == searchTerm
        )
    )

    users = users_query.all()

    if not users:
        return jsonify({"error": "No users found"}), 404

    return jsonify({
        "status": "success", 
        "users": [
            {
                "user_id": user.user_id,
                "username": user.username,
                "email": user.email,
                "description": user.description,
                "avatar_link": user.avatar_link
            } for user in users
        ]
    })


@app.route('/createTeam', methods=['POST'])
def create_team():
    data = request.get_json()
    print("data", data)
    team_name = data.get('team_name', '')
    team_description = data.get('team_description', '')
    team_members = data.get('team_members', [])
    user_id = data.get('user_id', None)

    if not team_name:
        return jsonify({"status": "failed", "error": "Team name is required"}), 400

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
  # Always add the manager as a team member with role 'manager'
    manager_membership = UserTeam(
            user_id=user_id,
            role='manager',
            joined_at=datetime.utcnow()
        )
    new_team.members.append(manager_membership)
    
    for member_id in team_members:
        if member_id == user_id:
            continue
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
        print(e)
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
    manager_membership = next(
        (member for member in members if member.user_id == team.manager_id), None)

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
        test_event_data = [{"id": event.id, "name": event.name, "created_at": event.created_at, "created_by": event.creator.username,
                            "environment": event.environment, "label": event.label, "state": event.state} for event in test_events]
        return jsonify(test_event_data)
    else:
        return jsonify({"message": "No TestEvent found for the given team_id"}), 404


@app.route('/saveTask', methods=['POST'])
def save_task():
    data = request.get_json()
    task_lists = data['taskLists']
    team_id = data['team_id']

    try:
        with db.session.begin():
            # Delete existing task lists and tasks
            Task.query.filter(Task.task_list_id.in_(
                db.session.query(TaskList.id).filter(TaskList.team_id == team_id)
            )).delete(synchronize_session='fetch')
            TaskList.query.filter(TaskList.team_id == team_id).delete(
                synchronize_session='fetch')

            # Save new task lists and tasks
            for task_list_data in task_lists:
                task_list = TaskList(
                    name=task_list_data['name'],
                    created_at=datetime.now(),
                    team_id=team_id
                )
                db.session.add(task_list)
                db.session.flush()  # Generate task_list.id, but do not commit the entire transaction

                for task_data in task_list_data['tasks']:
                    task = Task(
                        title=task_data['text'],
                        description=None,
                        status='not started',
                        task_list_id=task_list.id,
                        user_case_id=task_data['testcase']
                    )
                    db.session.add(task)

            db.session.commit() 

        return jsonify({"message": "Task data saved successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error: " + str(e)}), 500

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
        created_at = datetime.fromisoformat(
            test_event_data['created_at'].replace('Z', '+00:00'))

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

        # Update UserContribution
        activity_period = created_at.strftime("%Y-%m-%d")
        user_contribution = UserContribution.query.filter_by(
            user_id=test_event.created_by, activity_period=activity_period).first()

        if user_contribution:
            user_contribution.count += 1
        else:
            new_contribution = UserContribution(
                user_id=test_event.created_by, activity_period=activity_period, count=1)
            db.session.add(new_contribution)

        for test_case_data in data['test_cases']:
            test_case = TestCase(
                created_at=created_at,
                type=test_case_data['type'],
                subtype=test_case_data['subtype'],
                parameters=test_case_data['parameters'],
                test_event_id=test_event.id
            )
            db.session.add(test_case)
            db.session.flush()

            for test_case_element_data in test_case_data['test_case_elements']:
                test_case_element = TestCaseElement(
                    story_id=test_case.id,
                    type=test_case_element_data['type'],
                    subtype=test_case_element_data['subtype'],
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
    return parameters


@app.route('/runTestEvents', methods=['POST'])
def run_test_event():
    data = request.get_json()
    try:
        test_event_data = data['test_event']
        created_at = datetime.fromisoformat(
            test_event_data['created_at'].replace('Z', '+00:00'))
        test_event = TestEvent(
            name=test_event_data['name'],
            created_at=created_at,
            created_by=test_event_data['created_by'],
            environment=json.dumps(test_event_data['environment']),
            label=test_event_data['label'],
            state="Finished",
            team_id=int(test_event_data['team_id'])
        )
        db.session.add(test_event)
        db.session.flush()

        # Update UserContribution
        activity_period = created_at.strftime("%Y-%m-%d")
        user_contribution = UserContribution.query.filter_by(
            user_id=test_event.created_by, activity_period=activity_period).first()

        if user_contribution:
            user_contribution.count += 1
        else:
            new_contribution = UserContribution(
                user_id=test_event.created_by, activity_period=activity_period, count=1)
            db.session.add(new_contribution)
        for test_case_data in data['test_cases']:
            
            test_case = TestCase(
                created_at=created_at,
                type=test_case_data['type'],
                subtype=test_case_data['subtype'],
                parameters=test_case_data['parameters'],
                test_event_id=test_event.id
            )
            db.session.add(test_case)
            db.session.flush()

            for test_case_element_data in test_case_data['test_case_elements']:
                test_case_element = TestCaseElement(
                    story_id=test_case.id,
                    type=test_case_element_data['type'],
                    subtype=test_case_element_data['subtype'],
                    parameters=test_case_element_data['parameters']
                )
                db.session.add(test_case_element)

        db.session.commit()
        report_directory = "test_reports"
        base_directory = os.path.dirname(
            os.path.dirname(os.path.abspath(__file__)))
        absolute_report_directory = os.path.join(
            base_directory, report_directory)

        os.makedirs(absolute_report_directory, exist_ok=True)

        test_case_list = data['test_cases']

        print("test_case_list", test_case_list)
       # Create a list storing the paths of individual environment reports
        report_files = []
        total_success_rate = 0
        env_count = len(data['test_event']['environment'])

        for env in data['test_event']['environment']:
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            report_filename = f"report_{test_event.id}_{timestamp}.html"
            absolute_report_filepath = os.path.join(
                absolute_report_directory, report_filename)
            report_files.append(absolute_report_filepath)
            test_result = run_tests(
                env, test_case_list, absolute_report_filepath)

            passed_tests = test_result.testsRun - \
                (len(test_result.failures) + len(test_result.errors))
            total_success_rate += (passed_tests / test_result.testsRun) * 100

        # Convert a list of report paths to JSON strings
        reports_json = json.dumps(report_files)

        # Calculate the average success rate
        average_success_rate = total_success_rate / env_count

        # Create a new test report object
        test_report = TestReport(
            test_event_id=test_event.id,
            html_report=reports_json,
            success_rate=average_success_rate
        )

        db.session.add(test_report)
        db.session.commit()

        return jsonify(status='completed', message='Test completed', report_id=test_report.id), 201

    except KeyError as ke:
        db.session.rollback()
        print(f"KeyError: {ke}")
        return jsonify(status='failed', message=f"KeyError: {ke}"), 400
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify(status='failed', message=str(e)), 400


def merge_html_reports(report_paths):
    merged_content = ""
    for path in report_paths:
        with open(path, 'r', encoding='utf-8') as f:
            merged_content += f.read()
    return merged_content
import chardet


@app.route('/test-report/<int:report_id>', methods=['GET'])
def get_test_report(report_id):
    report = TestReport.query.filter_by(id=report_id).first()

    if not report:
        return jsonify({'error': 'Report not found'}), 404

    try:
        report_files = json.loads(report.html_report)
    except json.JSONDecodeError:
        return jsonify({'error': 'Report contains invalid JSON'}), 404

    test_event = TestEvent.query.filter_by(id=report.test_event_id).first()
    if not test_event:
        return jsonify({'error': 'Associated Test Event not found'}), 404

    encoded_html_reports = []

    for report_folder in report_files:
        files_and_directories = os.listdir(report_folder)

        for item in files_and_directories:
            full_path = os.path.join(report_folder, item)
            if os.path.isfile(full_path):
                try:
                    # 使用chardet自动检测编码
                    with open(full_path, 'rb') as f:
                        raw_data = f.read()
                        encoding = chardet.detect(raw_data)['encoding']

                    # 使用检测到的编码读取文件内容
                    with open(full_path, 'r', encoding=encoding) as f:
                        html_content = f.read()
                        encoded_html_report = base64.b64encode(html_content.encode('utf-8')).decode('utf-8')
                        encoded_html_reports.append(encoded_html_report)
                except Exception as e:
                    print(f"Error reading file {full_path}: {e}")
                    continue

    created_by_username = test_event.creator.username

    report_data = {
        'name': test_event.name,
        'createdAt': test_event.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'createdBy': created_by_username,
        'test_event_id': report.test_event_id,
        'environment': test_event.environment,
        'team_id': test_event.team_id,
        'labels': test_event.label.split(','),
        'state': test_event.state,
        'successRate': report.success_rate,
        'htmlReports': encoded_html_reports,
    }

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

            test_cases = TestCase.query.filter_by(
                test_event_id=testevent_id).order_by(TestCase.created_at).all()
            result = []
            # print("test_cases", test_cases)
            for index, test_case in enumerate(test_cases):
                children = []
                elements = TestCaseElement.query.filter_by(
                    story_id=test_case.id).order_by(TestCaseElement.id).all()

                for element in elements:
                    child = {
                        "type": element.type,
                        "params": element.parameters,
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
                    "params": test_case.parameters,
                    "isNew": False,
                    "isChild": False,
                    "index": index
                }
                result.append(tc)
            print("result", result)
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

    # Search for test_event_id containing test_id in TestReport table
    test_reports = TestReport.query.filter_by(id=test_id).all()

    if not test_reports:
        return jsonify({"status": "No matching TestReports found"}), 404

    results = []
    for test_report in test_reports:
        test_event = TestEvent.query.filter_by(
            id=test_report.test_event_id).first()

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

    test_reports = TestReport.query.filter_by(test_event_id=test_id).all()

    if not test_reports:
        return jsonify({"status": "No matching TestReports found"})

    results = []
    for test_report in test_reports:
        test_event = TestEvent.query.filter_by(
            id=test_report.test_event_id).first()

        if test_event:
            result = {
                "id": test_report.id,
                "test_event_name": test_event.name,
                "success_rate": test_report.success_rate
            }
            results.append(result)
    return jsonify(status='success', results=results), 200


def generate_html_from_report_data(report_data):
    # Get the directory of the current file
    current_directory = os.path.dirname(os.path.abspath(__file__))

    # Set up the Jinja2 environment with the current directory
    env = Environment(loader=FileSystemLoader(current_directory))

    # Load the template by name
    template = env.get_template('report_template.html')

    # Render the template with the report data
    html_output = template.render(report_data=report_data)

    return html_output


@app.route('/send-report', methods=['POST'])
def send_report():
    email_addresses = request.json.get('email')
    user_ids = request.json.get('user_ids')
    test_event_id = request.json.get('test_event_id')
    id = request.json.get('id')

    report = TestReport.query.filter_by(id=id).first()

    if not report:
        return jsonify({'error': 'Report not found'}), 404

    # Trying to parse report.html_report as a Python list
    try:
        report_files = json.loads(report.html_report)
    except json.JSONDecodeError:
        return jsonify({'error': 'Report contains invalid JSON'}), 404

    test_event = TestEvent.query.filter_by(id=report.test_event_id).first()
    if not test_event:
        return jsonify({'error': 'Associated Test Event not found'}), 404

    encoded_html_reports = []

    for report_folder in report_files:
        files_and_directories = os.listdir(report_folder)

        for item in files_and_directories:
            full_path = os.path.join(report_folder, item)
            if os.path.isfile(full_path):
                try:
                    with open(full_path, 'r', encoding='utf-8') as f:
                        html_content = f.read()
                        encoded_html_report = base64.b64encode(
                            html_content.encode('utf-8')).decode('utf-8')
                        encoded_html_reports.append(encoded_html_report)
                except Exception as e:
                    print(f"Error reading file {full_path}: {e}")
                    continue

   # Decoding base64-encoded HTML reports
    decoded_html_reports = [base64.b64decode(report).decode(
        'utf-8') for report in encoded_html_reports]

    created_by_username = test_event.creator.username

    report_data = {
        'name': test_event.name,
        'createdAt': test_event.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'createdBy': created_by_username,
        'test_event_id': report.test_event_id,
        'environment': test_event.environment,
        'team_id': test_event.team_id,
        'labels': test_event.label.split(','),
        'state': test_event.state,
        'successRate': report.success_rate,
        'htmlReports': decoded_html_reports,
    }
    html_report = generate_html_from_report_data(
        report_data)

    if not email_addresses and user_ids:
        # Get user email address
        users = db.session.query(User).filter(User.user_id.in_(user_ids)).all()
        email_addresses = [user.email for user in users]

    for email_address in email_addresses:
        try:
            send_email(email_address, html_report)
        except SMTPRecipientsRefused as e:
            return jsonify({"error": f"Failed to send report to {email_address}. Error: {str(e)}"}), 400

    return jsonify({"message": "Report sent successfully!"})


@app.route("/contributions/<int:user_id>")
def get_contributions(user_id):
    try:
        print("user_id",user_id)
        today = datetime.today()
        one_year_ago = today - timedelta(days=365)

        contributions = UserContribution.query.filter(
            UserContribution.user_id == user_id,
            UserContribution.activity_period >= one_year_ago.strftime('%Y-%m-%d'),
            UserContribution.activity_period <= today.strftime('%Y-%m-%d')
        ).all()

        # Transform data into desired format
        data = [
            {
                "date": contribution.activity_period,
                "count": contribution.count
            }
            for contribution in contributions
        ]
        print("data",data)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Team management
@app.route('/team/<int:team_id>', methods=['GET'])
def get_team(team_id):
    team = Team.query.get_or_404(team_id)

    members = [
        {
            "id": member.user.user_id,
            "username": member.user.username
        }
        for member in team.members
    ]

    return jsonify({
        "id": team.team_id,
        "name": team.name,
        "description": team.description,
        "created_at": team.created_at.strftime('%Y-%m-%d %H:%M:%S') if team.created_at else None,
        "updated_at": team.updated_at.strftime('%Y-%m-%d %H:%M:%S') if team.updated_at else None,
        "manager_id": team.manager_id,
        "members": members
    })


@app.route('/team/<int:team_id>', methods=['DELETE'])
def remove_team(team_id):
    team = Team.query.get_or_404(team_id)
    
    # 删除所有引用该团队的 UserTeam 实体
    UserTeam.query.filter_by(team_id=team_id).delete()
    
    db.session.delete(team)
    db.session.commit()
    return jsonify({"message": "Team deleted successfully!"}), 200


@app.route('/team/<int:team_id>/add_member', methods=['POST'])
def add_team_member(team_id):
    
    team = Team.query.get_or_404(team_id)
    
    user_data = request.json.get('username')
    if not user_data or not isinstance(user_data, list) or len(user_data) == 0:
        return jsonify({"message": "Invalid user data!"}), 400

    user_id = user_data[0].get('id')
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found!"}), 404

    # Query the UserTeam table to see if the user is already a member of the team
    existing_member = UserTeam.query.filter_by(user_id=user_id, team_id=team_id).first()

    # If the user is already a member of the team, return an error message
    if existing_member:
        return jsonify({"message": "User is already a member of this team!"}), 400

    # If the user is not a member, continue the add process
    user_team = UserTeam(user_id=user.user_id, team_id=team_id)
    db.session.add(user_team)
    db.session.commit()
    
    return jsonify({"message": "Member added successfully!"}), 200



@app.route('/team/<int:team_id>/remove_member', methods=['POST'])
def remove_team_member(team_id):
    team = Team.query.get_or_404(team_id)
    username = request.json.get('username')
    
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"message": "User not found!"}), 404

    user_team = UserTeam.query.filter_by(user_id=user.user_id, team_id=team_id).first()
    if user_team:
        db.session.delete(user_team)
        db.session.commit()

    return jsonify({"message": "Member removed successfully!"}), 200

@app.route('/team/transferManager', methods=['PUT'])
def transfer_manager():
    data = request.get_json()
    team_id = data.get('teamId')
    new_manager_id = data.get('newManagerId')

    team = Team.query.get_or_404(team_id)

    # 更新团队的管理者
    team.manager_id = new_manager_id
    db.session.commit()

    return jsonify({"message": "Manager transferred successfully!"}), 200