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


@app.route("/api/user/login/", methods=['POST'])
def do_login():  # todo
    print("login")
    # ir buscar json as popriedades
    data = request.get_json()
    print(data)

# verificar se existe

# se existir mandar ok


@app.route("/api/user/logout/", methods=['GET'])
def do_logout():  # todo
    print("logout")


@app.route("/api/user/register/", methods=['POST'])
def register():  # todo
    print("register")


app.run(host='0.0.0.0', port=8000, debug=True)
