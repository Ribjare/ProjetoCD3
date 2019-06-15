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

        console.log(this.responseText);
        var tasks = JSON.parse(this.responseText);
        var ul = document.getElementById('listTasks');

        ul.innerHTML = '';


        for (var i in tasks) {

            var li = document.createElement('li');
            li.innerHTML = tasks[i].title + " - Due Date: " + tasks[i].due_date + "- Completed: " + tasks[i].completed;
            li.innerHTML += " <button class=\"btn btn-primary\" onclick='updateTask("+ id_projeto +"," + tasks[i].id + ")'>Update</button>";
            li.innerHTML += " <button class=\"btn btn-primary\" onclick='deleteTask("+ id_projeto + tasks[i].id + ")'>Delete</button>";
            li.innerHTML += " <button class=\"btn btn-primary\" onclick='completeTask("+ id_projeto + tasks[i].id + ")'>Complete</button>";

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
    var div = document.getElementById("tarefasForm");

    if(div.childNodes.length >=1){
        div.removeChild(div.childNodes[0]);
    }

    var createform = document.createElement('form');
    createform.setAttribute("action", "javascript:createTask("+id+");");
    createform.setAttribute("id", "formTasks");
    div.appendChild(createform);

    var fieldset = document.createElement("fildset");

    //create Title label
    var title = document.createElement("label");
    title.setAttribute("for", "Title1");
    var hTitle = document.createElement("h2");
    hTitle.innerHTML = "Title";
    title.appendChild(hTitle);
    fieldset.appendChild(title);

    //create Title input
    var titleInput = document.createElement("input");
    titleInput.setAttribute("class", "form-control");
    titleInput.setAttribute("id", "Title1");
    titleInput.setAttribute("name", "Title");
    titleInput.setAttribute("placeholder", "Title");
    fieldset.appendChild(titleInput);

    var order = document.createElement("label");
    title.setAttribute("for", "Order");
    var hOrder = document.createElement("h2");
    hOrder.innerHTML = "Order";
    order.appendChild(hOrder);
    fieldset.appendChild(order);

    var orderInput = document.createElement("input");
    orderInput.setAttribute("class", "form-control");
    orderInput.setAttribute("id", "Order");
    orderInput.setAttribute("name", "Order");
    orderInput.setAttribute("placeholder", "Order");
    fieldset.appendChild(orderInput);

    var duedate = document.createElement("label");
    title.setAttribute("for", "DueDate");
    var hDudedate = document.createElement("h2");
    hDudedate.innerHTML = "DueDate";
    duedate.appendChild(hDudedate);
    fieldset.appendChild(duedate);

    var duedateInput = document.createElement("input");
    duedateInput.setAttribute("class", "form-control");
    duedateInput.setAttribute("id", "DueDate");
    duedateInput.setAttribute("name", "DueDate");
    duedateInput.setAttribute("placeholder", "day month year");
    fieldset.appendChild(duedateInput);

    var submitBtt = document.createElement("button");
    submitBtt.setAttribute("type", "submit");
    submitBtt.setAttribute("form", "formTasks");
    submitBtt.setAttribute("class", "btn btn-primary");
    submitBtt.innerHTML = "Create";
    fieldset.appendChild(submitBtt);

    createform.appendChild(fieldset);

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
    var form = document.getElementById("Title");
    var title = form.value;

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
        getTask(project_id);
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
        getTask(id_projeto);
    });

     req.send(JSON.stringify({"title": title, "order":order, "due_date":due_date}));
}

function deleteTask(id_projeto, id_task){
    var req = new XMLHttpRequest();
    req.open("DELETE", "/api/projects/" + id_projeto + "/tasks/" + id_task);
    req.addEventListener("load", function () {
        getTask(id_projeto);
    });
    req.send();
}

function completeTask(id_projeto, id_task){


    var req = new XMLHttpRequest();
    req.open("PUT", "/api/projects/" + id_projeto + "/tasks/" + id_task);
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
        getTask(id_projeto);
    });

    req.send(JSON.stringify({"completed": true}));
}

getProjects();