"""
 Flask REST application

"""

from flask import Flask, request, jsonify, make_response
import database_creation

app = Flask(__name__, static_url_path='/static')


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route("/api/users/", methods=['GET'])
def get_current_user():  # Todo
    print("Current user")
    bd = database_creation.DataBase()

    data = request.get_json()
    print(data)


@app.route("/api/user/login/", methods=['POST'])
def do_login():  # todo
    print("login")
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

    username = data["username"]
    password = data["password"]
    name = data["name"]
    email = data["email"]

    # if is none any parametre doesn't continue
    if username is None or password is None or name is None or email is None:
        return make_response(jsonify("Missing parameter"), 400)

    user = bd.get_login_user(username, password)
    print("USer:")
    print(user)

    if user is not None:
        bd.add_user(username=username, password=password, name=name, email=email)
        print(bd.get_all_user())
        return make_response(jsonify("Registed"), 201)
    else:
        return make_response((jsonify("User Already Register"), 400))


app.run(host='0.0.0.0', port=8000, debug=True)
