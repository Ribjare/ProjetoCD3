"""
 Flask REST application

"""

from flask import Flask, request, jsonify, make_response
import database_creation
from sqlalchemy.ext.declarative import DeclarativeMeta
from flask_login import LoginManager, current_user, login_user, login_required, logout_user
import json

app = Flask(__name__, static_url_path='/static', )
login_manager = LoginManager()
login_manager.init_app(app)
app.config['SECRET_KEY'] = 'the random string'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./database.db'
bd = database_creation.DataBase(app)


@login_manager.user_loader
def load_user(id):
    return bd.get_user(id)


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route("/api/user/", methods=['GET'])
@login_required
def get_current_user():  # Todo gets current user
    print("Current user")

    # get the information of json
    user = bd.get_user(current_user.id)
    print(user)
    x = user.__dict__
    print(x)
    # send message
    return make_response(jsonify(x), 200)


@app.route("/api/user/login/", methods=['POST'])
def do_login():  # todo
    print("login")

    data = request.get_json()
    print(data)

    username = data["username"]
    password = data["password"]

    # verificar se existe
    user = bd.get_login_user(username, password)
    print(user)

    # se existir mandar ok
    if user is not None:
        # create session
        login_user(user)
        return make_response(jsonify("You logged in"), 201)
    else:
        return make_response(jsonify("Invalid user"), 401)


@app.route("/api/user/logout/", methods=['GET'])
@login_required
def do_logout():  # todo
    print("logout")
    logout_user()
    return make_response(jsonify("Logout done"), 201)


@app.route("/api/user/register/", methods=['POST'])
def register():  # todo
    print(bd.get_all_user())
    print("register")
    data = request.get_json()
    try:
        username = data["username"]
        password = data["password"]
        name = data["name"]
        email = data["email"]
    except KeyError:
        return make_response(jsonify("Missing parameter"), 400)

    user = bd.get_login_user(username, password)

    if user is None:
        bd.add_user(username=username, password=password, name=name, email=email)
        print(bd.get_all_user())
        return make_response(jsonify("Registed"), 201)
    else:
        return make_response((jsonify("User Already Register"), 400))


# get - get's all the project
# Post- creates a project
@app.route("/api/projects/", methods=['GET', 'POST'])
def get_all_project():   # todo
    print("ALL PROJECT")

    if request.method == 'GET':
        # id of user
        return bd.get_all_projects_from_user(current_user.id)


@app.route("/api/projects/<id>/", methods=['GET', 'POST'])
def get_project(id):   # todo
    print("")


# get - get's all the tasks
# Post- creates a task
@app.route("/api/projects/<id>/tasks/", methods=['POST'])
def get_all_task(id):   # todo
    print("")


@app.route("/api/projects/<id>/tasks/<idx>/", methods=['POST'])
def get_task(id, idx):   # todo
    print("")


app.run(host='0.0.0.0', port=8000, debug=True)
