/**
 *
 */


function getProjects() {
    var req = new XMLHttpRequest();
    req.open("GET", "/api/projects/");
    req.addEventListener("load", function () {

        var projects = JSON.parse(this.responseText);
        var ul = document.getElementById('listProjects');

        ul.innerHTML = '';
        for (var i in projects) {
            var li = document.createElement('li');
            li.innerHTML = projects[i].title + " - Creation Date: " + projects[i].creation_date + " - Last Update: " + projects[i].last_updated;
            li.innerHTML += " <button class=\"btn btn-primary\" onclick='updateProject(" + projects[i].id + ")'>Update</button>";
            li.innerHTML += " <button class=\"btn btn-primary\" onclick='deleteProject(" + projects[i].id + ")'>Delete</button>";
            li.innerHTML += " <button class=\"btn btn-primary\" onclick='selectProject(" + projects[i].id + ")'>Select</button>";

            ul.appendChild(li);
        }
    });
    req.send();
}

function getTask(id_projeto) {
    var req = new XMLHttpRequest();
    req.open("GET", "/api/projects/" + id_projeto + "/tasks/");
    req.addEventListener("load", function () {

        var tasks = JSON.parse(this.responseText);
        var ul = document.getElementById('listTasks');

        ul.innerHTML = '';
        for (var i in tasks) {
            var li = document.createElement('li');
            li.innerHTML = tasks[i].title + " - Due Date: " + tasks[i].due_date;
            li.innerHTML += " <button class=\"btn btn-primary\" onclick='updateTask("+ id_projeto +"," + tasks[i].id + ")'>Update</button>";
            li.innerHTML += " <button class=\"btn btn-primary\" onclick='deleteTask("+ id_projeto + tasks[i].id + ")'>Delete</button>";

            ul.appendChild(li);
        }
    });
    req.send();
}

function selectProject(id) {
    getTask(id);
    createTaskScreen(id);
    console.log(id);
}

function createTaskScreen(id){
    var div = document.getElementById("CriarTarefas");

    var createform = document.createElement('form');
    createform.setAttribute("action", "javascript:createTask())");
    createform.setAttribute("id", "formTasks");
    div.appendChild(createform);


}

function createProject() {
    var form = document.getElementById("formProjects");
    var title = form.Title.value;

    var req = new XMLHttpRequest();
    req.open("POST", "/api/projects/");
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
        getProjects();
    });
    req.send(JSON.stringify({"title": title}));
}

function updateProject(id) {
    var form = document.getElementById("CriarProjectos");
    var title = form.Title.value;

    var req = new XMLHttpRequest();
    req.open("PUT", "/api/projects/" + id + "/");
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
        getProjects();
    });
    req.send(JSON.stringify({"title": title}));
}


function deleteProject(id) {

    var req = new XMLHttpRequest();
    req.open("DELETE", "/api/projects/" + id + "/");
    req.addEventListener("load", function () {
        getProjects();
    });
    req.send();
}

function logout() {
    var req = new XMLHttpRequest();
    req.open("POST", "/api/user/logout/");
    req.addEventListener("load", function () {
        window.location.replace('index_bootstrap.html');
    });
    req.send();

}

function createTask(project_id) {
    var form = document.getElementById("formTasks");
    var title = form.Title.value;
    var order = form.Order.value;
    var due_date = form.DueDate.value;

    console.log(title, order, due_date);

    var req = new XMLHttpRequest();
    req.open("POST", "/api/projects/"+ project_id +"/tasks/");
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
        getTask();
    });
    req.send(JSON.stringify({"title": title, "order":order, "due_date":due_date}));
}

function updateTask(id_projeto, id_task){
    var form = document.getElementById("formTasks");

    var title = form.Title.value;
    var order = form.Order.value;
    var due_date = form.DueDate.value;

    var req = new XMLHttpRequest();
    req.open("PUT", "/api/projects/" + id_projeto + "/tasks/" + id_task);
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
        getTask();
    });

     req.send(JSON.stringify({"title": title, "order":order, "due_date":due_date}));
}

function deleteTask(id_projeto, id_task){
    var req = new XMLHttpRequest();
    req.open("DELETE", "/api/projects/" + id_projeto + "/tasks/" + id_task);
    req.addEventListener("load", function () {
        getTask();
    });
    req.send();
}

getProjects();