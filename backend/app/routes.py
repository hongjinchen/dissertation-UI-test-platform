from flask import render_template, redirect, url_for, flash, request,jsonify,make_response
from flask_login import login_user, logout_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from app import app, db
from app.models import User
from app.models import Team
from app.models import UserTeam
import jwt
from datetime import datetime, timedelta
from sqlalchemy.exc import SQLAlchemyError


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

    if not userName:
        return jsonify({"error": "Search term is required"}), 400

    # users = User.query.filter(User.username.like(f'%{userName}%')).all()
    users = User.query.with_entities(User.user_id, User.username, User.email, User.description, User.avatar_link).filter(User.username.like(f'%{userName}%')).all()

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

    if not team_name:
        return jsonify({"status": "failed","error": "Team name is required"}), 400

    if not team_members:
        return jsonify({"status": "failed","error": "Team must have at least one member"}), 400

    new_team = Team(
        name=team_name,
        description=team_description,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    for user_id in team_members:
        user = User.query.get(user_id)
        if user:
            new_member = UserTeam(
                user_id=user_id,
                role='member',
                joined_at=datetime.utcnow()
            )
            new_team.members.append(new_member)
        else:
            return jsonify({"status": "failed","error": f"User with ID {user_id} not found"}), 400

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

    for member in members:
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