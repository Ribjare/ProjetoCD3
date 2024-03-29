"""
 Implements database of users.

"""

from sqlalchemy import *
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from datetime import datetime
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy


engine = create_engine('sqlite:///./database.db')

Base = declarative_base()
Session = sessionmaker(bind=engine)


# class for User table
class User(Base, UserMixin):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    email = Column(String(50), unique=True)
    username = Column(String(50), unique=True)
    password = Column(String(50))

    children = relationship("Project")

    def __repr__(self):
        return "<User(name='%s', email='%s', username='%s')>" % (self.name, self.email, self.username)


# class for the Project table
class Project(Base):
    __tablename__ = "project"

    id = Column(Integer, primary_key=True)
    title = Column(String(50))
    creation_date = Column(DateTime, default=datetime.utcnow)
    last_updated = Column(DateTime, onupdate=datetime.utcnow)

    user_id = Column(Integer, ForeignKey('user.id'))

    children = relationship("Task")

    def __repr__(self):
        return "<Project(title='%s', creation_date='%s', last_update='%s')>" % (self.title, self.creation_date, self.last_updated)


# Class for Task table
class Task(Base):
    __tablename__ = "task"

    id = Column(Integer, primary_key=True)
    title = Column(String(50))
    order = Column(String(50))
    creation_date = Column(DateTime, default=datetime.utcnow)
    due_date = Column(DateTime)
    completed = Column(Boolean, default=False)

    projeto_id = Column(Integer, ForeignKey('project.id'))

    def __repr__(self):
        return "<Task(title='%s', due_date='%s', creation_date='%s')>" % (self.title, self.due_date, self.creation_date)


# create a new BD
Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)
print("Limpar Base dados")


#   Responsable to all methods to change the database
class DataBase:
    def __init__(self, app):
        self.db = SQLAlchemy(app)

    def recreate_bd(self):
        self.add_user("Daniel", "daniel@gmail.com", "ribjare", "1234")
        self.add_user("Marcio", "marcio@gmail.com", "zhedish", "1234")
        self.add_user("João","joao@gmail.com","F4TE","1234")

    #   add a new user to the list
    def add_user(self, name, email, username, password):
        user_new = User(name=name, email=email, username=username, password=password)
        self.db.session.add(user_new)
        self.db.session.commit()

    #   add a new project to the list
    def add_project(self, user, title):
        new_project = Project(user_id=user, title=title, creation_date=datetime.now(), last_updated=datetime.now())
        self.db.session.add(new_project)
        self.db.session.commit()
    #   add a new task to the list
    def add_task(self, project_id, title, order, due_date):

        new_task = Task(projeto_id=project_id, title=title, order=order, creation_date=datetime.now(),
                        due_date=due_date, completed=False)
        self.db.session.add(new_task)
        self.db.session.commit()

    #   Returns all users in database
    def get_all_user(self):
        return self.db.session.query(User).all()

    #   Returns all projects in database
    def get_all_projects(self):
        return self.db.session.query(Project).all()

    #   Returns all tasks in database
    def get_all_task(self):
        return self.db.session.query(Task).all()

    #   Returns a user by the id
    def get_user(self, id):
        return self.db.session.query(User).filter(User.id == id).first()

    #   Returns login info of the current user
    def get_login_user(self, username, password):
        querielist = self.db.session.query(User).filter(User.username == username, User.password == password)
        for x in querielist:
            return x

    #   Returns the current project
    def get_project(self, user_id, project_id):
        return self.db.session.query(Project).filter(Project.id == project_id, Project.user_id == user_id).first()

    #   Get All projects from a user
    def get_all_projects_from_user(self, user_id):
        return self.db.session.query(Project).filter(Project.user_id == user_id).all()

    #   Get a task
    def get_task(self, project_id, task_id):
        return self.db.session.query(Task).filter(Task.projeto_id == project_id, Task.id == task_id).first()

    #   Get all tasks from a project
    def get_all_task_from_project(self, project_id):
        return self.db.session.query(Task).filter(Task.projeto_id == project_id).all()

    #   Deletes a project
    def delete_project(self, project_id):
        self.db.session.query(Project).filter(Project.id == project_id).delete()
        self.db.session.commit()

    #   Updates the information of the project
    def update_project(self, project_id, changed_data):
        self.db.session.query(Project).filter(Project.id == project_id).update(changed_data)
        self.db.session.commit()

    #   Delets a task
    def delete_task(self, task_id):
        self.db.session.query(Task).filter(Task.id == task_id).delete()
        self.db.session.commit()

    #   Updates the information on the task
    def update_task(self, task_id, changed_data):
        self.db.session.query(Task).filter(Task.id == task_id).update(changed_data)
        self.db.session.commit()



