"""
 Implements a simple database of users.

"""

import sqlite3
from sqlalchemy import create_engine, Column, Boolean, Integer, String, Date
from sqlalchemy.ext.declarative import declarative_base

engine = create_engine('sqlite:///database.db', echo=True)

Base = declarative_base()


# class for User table
class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)
    username = Column(String)
    password = Column(String)


# class for the Project table
class Project(Base):
    __tablename__ = "project"

    id = Column(Integer, primary_key=True)
    # user
    title = Column(String)
    creation_date = Column(Date)
    last_updated = Column(Date)


# Class for Task table
class Task(Base):
    __tablename__ = "task"

    id = Column(Integer, primary_key=True)
    # projeto = Column(Integer)
    title = Column(String)
    order = Column(String)
    creation_date = Column(Date)
    due_date = Column(Date)
    completed = Column(Boolean, default= False)




conn = sqlite3.connect('database.db', check_same_thread=False)




def dict_factory(cursor, row):
    """Converts table row to dictionary."""
    res = {}
    for idx, col in enumerate(cursor.description):
        res[col[0]] = row[idx]
    return res


conn.row_factory = dict_factory


def recreate_db():
    """Recreates the database."""
    c = conn.cursor()
    c.execute("DROP TABLE IF EXISTS user")
    c.execute("""
        CREATE TABLE user (
            id INTEGER PRIMARY KEY,
            name TEXT,
            age INTEGER
        )
    """)
    c.execute("INSERT INTO user VALUES (null, 'Ana', '22')")
    c.execute("INSERT INTO user VALUES (null, 'Paulo', '25')")
    conn.commit()


def get_users():
    """Returns all users."""
    res = conn.cursor().execute('SELECT * FROM user')
    return res.fetchall()


def get_user(pk):
    """Returns a single user."""
    res = conn.cursor().execute('SELECT * FROM user WHERE id=%s' % pk)
    return res.fetchone()


def add_user(user):
    """Adds a new user."""
    stmt = "INSERT INTO user VALUES (null, '%s', '%s')" % (user['name'], user['age'])
    c = conn.cursor()
    c.execute(stmt)
    conn.commit()
    return get_user(c.lastrowid)


def update_user(user, data):
    """Updates a user with the given data."""
    stmt = "UPDATE user SET name='%s', age='%s' WHERE id=%s" % (
        data['name'], data['age'], user['id'])
    conn.cursor().execute(stmt)
    conn.commit()
    return get_user(user['id'])


def remove_user(user):
    """Deletes a user."""
    stmt = "DELETE FROM user WHERE id=%s" % user['id']
    conn.cursor().execute(stmt)
    conn.commit()
