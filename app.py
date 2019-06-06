"""
 Flask REST application

"""

from flask import Flask, request, jsonify, make_response
import database_creation
from flask_login import LoginManager, current_user, login_user

app = Flask(__name__, static_url_path='/static')
login = LoginManager(app)


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route("/api/user/", methods=['POST'])
def get_current_user():  # Todo gets current user
    print("Current user")
    # check if there is a login done

    # get the information of json
    data = request.get_json()
    print(data)

    # modify the parameteres

    # send message


@app.route("/api/user/login/", methods=['POST'])
def do_login():  # todo
    print("login")
    if current_user.is_authenticated:
        return make_response(jsonify("You logged in"), 201)
    # ir buscar json as popriedades
    bd = database_creation.DataBase()

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
def do_logout():  # todo
    print("logout")


@app.route("/api/user/register/", methods=['POST'])
def register():  # todo
    print("register")
    bd = database_creation.DataBase()
    data = request.get_json()
    try:
        username = data["username"]
        password = data["password"]
        name = data["name"]
        email = data["email"]
    except KeyError:
        return make_response(jsonify("Missing parameter"), 400)

    user = bd.get_login_user(username, password)
    print("USer:")
    print(user)

    if user is None:
        bd.add_user(username=username, password=password, name=name, email=email)
        print(bd.get_all_user())
        return make_response(jsonify("Registed"), 201)
    else:
        return make_response((jsonify("User Already Register"), 400))


@app.route("/api/projects/", methods=['GET'])
def get_all_project():   # todo
    print("ALL PROJECT")
    bd = database_creation.DataBase()

    # id of user
    # user_id =


@app.route("/api/projects/<id>/", methods=['GET'])
def get_project():   # todo
    print("")


@app.route("/api/projects/<id>/tasks/", methods=['POST'])
def get_all_task():   # todo
    print("")


@app.route("/api/projects/<id>/tasks/<idx>/", methods=['POST'])
def get_task():   # todo
    print("")


app.run(host='0.0.0.0', port=8000, debug=True)
