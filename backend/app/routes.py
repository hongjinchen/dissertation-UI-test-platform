from flask import render_template, redirect, url_for, flash, request,jsonify,make_response
from flask_login import login_user, logout_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from app import app, db
from app.models import User
from app.models import Team
from app.models import UserTeam
from app.models import TestCase, TestCaseElement,TaskList,Task,TestEvent,TestReport
import jwt
from datetime import datetime, timedelta
from sqlalchemy.exc import SQLAlchemyError
import logging
import base64

@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get("token")

        if not token:
            return jsonify({"message": "Not authenticated"}), 401

        try:
            data = jwt.decode(token, app.config["SECRET_KEY"])
            request.user_id = data["user_id"]
        except:
            return jsonify({"message": "Invalid token"}), 401

        return f(*args, **kwargs)

    return decorated
    
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
        test_event_data = [{"id": event.id, "name": event.name, "created_at": event.created_at, "created_by": event.created_by, "environment": event.environment, "label": event.label, "state": event.state, "success_rate": event.success_rate, "parameters": event.parameters} for event in test_events]
        return jsonify(test_event_data)
    else:
        return jsonify({"message": "No TestEvent found for the given team_id"}), 404
    
def get_team_script(team_id):
    test_cases = TestCase.query.filter_by(team_id=team_id).all()
    test_cases_list = []

    for test_case in test_cases:
        test_cases_list.append({
            'id': test_case.id,
            'name': test_case.name,
            'created_at': test_case.created_at,
            'team_id': test_case.team_id,
            'type': test_case.type,
            'parameters': test_case.parameters
        })

    return jsonify(test_cases_list)

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
    print(data)

    try:
        test_event_data = data['test_event']
        created_at = datetime.fromisoformat(test_event_data['created_at'].replace('Z', '+00:00'))
        test_event = TestEvent(
            name=test_event_data['name'],
            created_at=created_at,
            created_by=test_event_data['created_by'],
            environment=test_event_data['environment'],
            label=test_event_data['label'],
            state=test_event_data['state'],
            team_id=int(test_event_data['team_id'])
        )
        db.session.add(test_event)
        db.session.flush()

        for test_case_data in data['test_cases']:
            test_case = TestCase(
                name=test_case_data['name'],
                created_at=created_at,
                type=test_case_data['type'],
                parameters=test_case_data['parameters'],
                test_event_id=test_event.id
            )
            db.session.add(test_case)
            db.session.flush()

            for test_case_element_data in test_case_data['test_case_elements']:
                test_case_element = TestCaseElement(
                    story_id=test_case_element_data['story_id'],
                    type=test_case_element_data['type'],
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

@app.route('/api/test-report/<int:report_id>', methods=['GET'])
def get_test_report(report_id):
    report = TestReport.query.filter_by(id=report_id).first()
    if report:
        test_event = TestEvent.query.filter_by(id=report.test_event_id).first()
        if test_event:
            with open(report.html_report, 'r', encoding='utf-8') as f:
                html_content = f.read()
            encoded_html_report = base64.b64encode(html_content.encode('utf-8')).decode('utf-8')
            report_data = {
                'name': test_event.name,
                'createdAt': test_event.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                'createdBy': test_event.created_by,
                'test_event_id': report.test_event_id,
                'environment': test_event.environment,
                'labels': test_event.label.split(','),
                'state': test_event.state,
                'successRate': report.success_rate,
                'htmlReport': encoded_html_report,
            }
            return jsonify(report_data), 200
    return jsonify({'error': 'Report not found'}), 404