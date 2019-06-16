"""
 Flask REST application

"""

from flask import Flask, request, jsonify, make_response, redirect, url_for, render_template, send_from_directory
from sqlalchemy.ext.declarative import DeclarativeMeta
from flask_login import LoginManager, current_user, login_user, login_required, logout_user
from datetime import datetime
import sqlalchemy.exc

import database_creation
import json

app = Flask(__name__, template_folder="templates")
login_manager = LoginManager()
login_manager.init_app(app)
app.config['SECRET_KEY'] = 'the random string'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./database.db'
bd = database_creation.DataBase(app)


class AlchemyEncoder(json.JSONEncoder):     # classe que transforma objectos em json

    def default(self, obj):
        if isinstance(obj.__class__, DeclarativeMeta):
            # an SQLAlchemy class
            fields = {}
            for field in [x for x in dir(obj) if not x.startswith('_') and x != 'metadata']:
                data = obj.__getattribute__(field)
                try:
                    if type(data) == datetime: # se o objecto for DateTime faz so toString e nao converte
                        fields[field] = "{}-{}-{}".format(data.year, data.month, data.day)
                    else:
                        json.dumps(data)
                        fields[field] = data
                except TypeError:
                    fields[field] = None
            # a json-encodable dict
            return fields

        return json.JSONEncoder.default(self, obj)


@login_manager.user_loader
def load_user(id): # função que devolve um user, utilizada para o plug-in para o flask-login
    return bd.get_user(id)


@app.route('/static/index_bootstrap.html', methods=['GET'])
def index_redirect(): # função para voltar para a pagina principal
    return redirect(url_for('index'))


@app.route('/')
def index():     # função que define a pagina principal
    return app.send_static_file('index_bootstrap.html')


@app.route('/static/static/MainPage.html', methods=['GET'])
@login_required
def main_page():     # função que retorna uma resposta
    return make_response("", 200)


@app.route("/api/user/", methods=['GET'])
@login_required
def get_current_user():  # função que retorna o utilizador atual
    print("Current user")

    # get the information of json
    user = bd.get_user(current_user.id)
    print(user)
    # convert to a dict
    x = {
        'username': user.username,
        'email': user.email,
        'name': user.name,
        'Password': user.password
    }

    print(x)
    # send message
    return make_response(jsonify(x), 200)


@app.route("/api/user/login/", methods=['POST'])
def do_login():  # faz o login do utilizador e devolve mensagens de 201 ou 401 conforme tenha tido sucesso ou nao
    print("login")

    data = request.get_json()
    print(data)

    username = data["username"]
    password = data["password"]

    # verificar se existe
    user = bd.get_login_user(username, password)
    print("Login User")
    print(user)

    # se existir mandar ok
    if user is not None:
        # create session
        login_user(user)
        return make_response(jsonify("You logged in"), 201)
    else:
        return make_response(jsonify("Invalid user"), 401)


@app.route("/api/user/logout/", methods=['POST'])
@login_required
def do_logout():  # função que faz o logout do utilizador
    print("logout")
    logout_user()
    return make_response(jsonify("Logout done"), 200)


@app.route("/api/user/register/", methods=['POST'])
def register():  # função que regista o utilizador
    print(bd.get_all_user())
    print("register")
    data = request.get_json()
    print("all users")
    print(bd.get_all_user())
    try:
        username = data["username"]
        password = data["password"]
        name = data["name"]
        email = data["email"]
    except KeyError:
        print("aprametro")
        return make_response(jsonify("Missing parameter"), 400)

    user = bd.get_login_user(username, password)

    if user is None:
        try:
            bd.add_user(username=username, password=password, name=name, email=email)
        except sqlalchemy.exc.IntegrityError:
            return make_response(jsonify("Email ou username já registados"), 400)
        return make_response(jsonify("Registed"), 201)
    else:
        return make_response((jsonify("User Already Register"), 400))


# get - get's all the project
# Post- creates a project
@app.route("/api/projects/", methods=['GET', 'POST'])
@login_required
def get_all_project():  # função que devolve todos os projectos
    print("ALL PROJECT")
    print(current_user)
    if request.method == 'GET':
        # id of user
        project_list = bd.get_all_projects_from_user(current_user.id)

        print(project_list)
        return make_response(json.dumps(project_list, cls=AlchemyEncoder), 200)
    if request.method == 'POST':
        data = request.get_json()
        try:
            title = data["title"]
        except KeyError:
            return make_response(jsonify("Missing parameter"), 400)

        bd.add_project(title=title, user=current_user.id)
        return make_response(jsonify("Project Created"), 201)


@app.route("/api/projects/<int:id>/", methods=['GET', 'PUT', 'DELETE'])
@login_required
def get_project(id):  # função que devolve um deteminado projecto atravez do seu id

    # Gets the target project
    if request.method == 'GET':
        print("Get project")

        project = bd.get_project(current_user.id, id)
        return make_response(json.dumps(project, cls=AlchemyEncoder), 200)

    # updates the target project
    if request.method == 'PUT':
        print("update project")

        data = request.get_json()
        try:
            bd.update_project(id, data)
        except sqlalchemy.exc.IntegrityError:
            return make_response(jsonify("Invalid parameters"), 400)
        return make_response(jsonify("Project updated"), 200)

    # deletes the target project
    if request.method == 'DELETE':
        print("delete project")

        bd.delete_project(id)
        return make_response(jsonify("Project deleted"), 200)


# get - get's all the tasks
# Post- creates a task
@app.route("/api/projects/<int:id>/tasks/", methods=['GET', 'POST'])
@login_required
def get_all_task(id):  # função que devolve todas as tarefas
    print("Get all tasks")
    project = bd.get_project(current_user.id, id)

    # Check if the current user as access to this project
    if project is None:
        return make_response(jsonify("Sem autorizacao para aceder a este recurso"), 403)

    if request.method == 'GET':
        all_tasks = bd.get_all_task_from_project(id)
        return make_response(json.dumps(all_tasks, cls=AlchemyEncoder), 200)

    if request.method == 'POST':
        data = request.get_json()
        try:
            title = data["title"]
            order = data["order"]
            due_date = data["due_date"]
            date = datetime.strptime(due_date, '%d %m %Y')
        except KeyError:
            return make_response(jsonify("Missing parameter"), 400)
        except ValueError:
            return make_response(jsonify("Date format incorrect, try: day month year"))

        bd.add_task(project_id=id, title=title, order=order, due_date=date)

        return make_response(jsonify("Task created"), 201)


@app.route("/api/projects/<int:id_project>/tasks/<int:id_task>/", methods=['GET', 'PUT', 'DELETE'])
@login_required
def get_task(id_project, id_task):  # função que devolve uma tarefa pelo id do projecto e pelo id da tarefa
    print("Get task")
    print(current_user.id, id_project)
    project = bd.get_project(current_user.id, id_project)

    # Check if the current user as access to this project
    if project is None:
        return make_response(jsonify("Sem autorizacao para aceder a este recurso"), 403)
    else:
        if request.method == 'GET':
            task = bd.get_task(id_project, id_task)
            return make_response(json.dumps(task, cls=AlchemyEncoder), 200)

        if request.method == 'PUT':

            data = request.get_json()
            try:
                data['due_date'] = datetime.strptime(data['due_date'], '%d %m %Y')
                bd.update_task(id_task, data)
            except KeyError:
                make_response(jsonify('Incorrect Parameter'), 400)

            return make_response(jsonify('Task Updated'), 200)

        if request.method == 'DELETE':
            bd.delete_task(id_task)
            return make_response(jsonify('Task Deleted'), 200)


# The start of the program
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
