from flask_login import UserMixin
from app import db
from sqlalchemy.orm import relationship
from datetime import datetime

class User(UserMixin, db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    description = db.Column(db.String(200), nullable=True)
    avatar_link = db.Column(db.String(255), nullable=True)

    contributions = relationship("UserContribution", back_populates="user")
    teams = relationship("UserTeam", back_populates="user")
    managed_teams = relationship("Team", back_populates="manager")
    created_test_events = relationship("TestEvent", back_populates="creator")

    def get_id(self):
        return str(self.user_id)

class UserContribution(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id', ondelete='CASCADE'), nullable=True)
    activity_period = db.Column(db.String(7), nullable=True)

    user = relationship("User", back_populates="contributions")

class Team(db.Model):
    team_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, nullable=True)
    updated_at = db.Column(db.DateTime, nullable=True)
    manager_id = db.Column(db.Integer, db.ForeignKey('user.user_id', ondelete='CASCADE'), nullable=True)

    manager = relationship("User", back_populates="managed_teams")
    task_lists = relationship("TaskList", back_populates="team")
    members = relationship("UserTeam", back_populates="team")
    test_events = relationship("TestEvent", back_populates="team")

class UserTeam(db.Model):
    __tablename__ = 'userteam'
    team_member_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id', ondelete='CASCADE'), nullable=True)
    team_id = db.Column(db.Integer, db.ForeignKey('team.team_id', ondelete='CASCADE'), nullable=True)
    role = db.Column(db.String(255), nullable=True)
    joined_at = db.Column(db.DateTime, nullable=True, default=datetime.utcnow)

    user = relationship("User", back_populates="teams")
    team = relationship("Team", back_populates="members")

class TestEvent(db.Model):
    __tablename__ = 'testevent'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=True)
    created_by = db.Column(db.Integer, db.ForeignKey('user.user_id', ondelete='CASCADE'), nullable=True)  # 修改这里，添加外键约束
    environment = db.Column(db.String(255), nullable=True)
    label = db.Column(db.String(255), nullable=True)
    state = db.Column(db.Enum('Finished', 'In process'), nullable=True)
    team_id = db.Column(db.Integer, db.ForeignKey('team.team_id', ondelete='CASCADE'), nullable=True)
    
    test_cases = relationship("TestCase", back_populates="test_event")  # 添加与TestCase模型的关联
    test_reports = relationship("TestReport", back_populates="test_event")
    team = relationship("Team", back_populates="test_events")  # 添加与Team模型的关联
    creator = relationship("User")  # 添加与User模型的关联

class TestCase(db.Model):
    __tablename__ = 'testcase'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=True)
    type = db.Column(db.String(255), nullable=True)
    parameters = db.Column(db.Text, nullable=True)
    test_event_id = db.Column(db.Integer, db.ForeignKey('testevent.id', ondelete='CASCADE'), nullable=True)  # 添加外键引用

    test_event = relationship("TestEvent", back_populates="test_cases")
    
class TestCaseElement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    story_id = db.Column(db.Integer, nullable=True)
    type = db.Column(db.String(255), nullable=True)
    parameters = db.Column(db.Text, nullable=True)

class TestReport(db.Model):
    __tablename__ = 'TestReport'
    id = db.Column(db.Integer, primary_key=True)
    test_event_id = db.Column(db.Integer, db.ForeignKey('testevent.id', ondelete='CASCADE'), nullable=True)
    html_report = db.Column(db.Text, nullable=True)
    success_rate = db.Column(db.Float, nullable=True)

    test_event = relationship("TestEvent", back_populates="test_reports")

class Task(db.Model):
    __tablename__ = "tasks"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.Enum('not started', 'in process', 'finished'), nullable=True)
    task_list_id = db.Column(db.Integer, db.ForeignKey('taskslist.id', ondelete='CASCADE'), nullable=True)
    user_case_id = db.Column(db.Integer, nullable=True)

    task_list = relationship("TaskList", back_populates="tasks")

class TaskList(db.Model):
    __tablename__ = 'taskslist'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=True)
    team_id = db.Column(db.Integer, db.ForeignKey('team.team_id', ondelete='CASCADE'), nullable=True)

    team = relationship("Team", back_populates="task_lists")
    tasks = relationship("Task", back_populates="task_list")


