"""
 Implements database of users.

"""

from sqlalchemy import *
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from datetime import datetime

"""
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./teste.db'
bd = SQLAlchemy(app)
"""
engine = create_engine('sqlite:///./database.db')

Base = declarative_base()
Session = sessionmaker(bind=engine)

# class for User table
class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    email = Column(String(50))
    username = Column(String(50))
    password = Column(String(50))

    children = relationship("Projeto")

    def __repr__(self):
        return "<User(name='%s', email='%s', username='%s')>" % (self.name, self.email, self.username)


# class for the Project table
class Project(Base):
    __tablename__ = "project"

    id = Column(Integer, primary_key=True)
    title = Column(String(50))
    creation_date = Column(Date)
    last_updated = Column(Date)

    user_id = Column(Integer, ForeignKey('user.id'))

    children = relationship("Task")


# Class for Task table
class Task(Base):
    __tablename__ = "task"

    id = Column(Integer, primary_key=True)
    title = Column(String(50))
    order = Column(String(50))
    creation_date = Column(Date)
    due_date = Column(Date)
    completed = Column(Boolean, default=False)

    projeto_id = Column(Integer, ForeignKey('project.id'))


# create a new BD
Base.metadata.create_all(engine)


#   Responsable to all methods to change the database
class DataBase:

    def add_user(self, name, email, username, password):
        session = Session()
        user_new = User(name=name, email=email, username=username, password=password)
        session.add(user_new)
        session.commit()

    def add_project(self, user, title):
        session = Session()
        new_project = Project(user=user, title=title, creation_date=datetime.now, last_updated=datetime.now)
        session.add(new_project)
        session.commit()

    def add_task(self, project, title, order):
        session = Session()
        new_task = Task(project=project, title=title, order=order, creation_date=datetime.now,
                        due_datte=datetime.now, completed=False)
        session.add(new_task)
        session.commit()



