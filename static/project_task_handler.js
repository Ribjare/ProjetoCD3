/**
 *
 */

//função que devolve todos os projectos
function getProjects() {
    var req = new XMLHttpRequest();
    req.open("GET", "/api/projects/");
    req.addEventListener("load", function () {

        var projects = JSON.parse(this.responseText);
        var ul = document.getElementById('listProjects');

        ul.innerHTML = '';
        for (var i in projects) {
            var li = document.createElement('li');
            li.innerHTML = projects[i].title + " - Creation Date: " + projects[i].creation_date + " - Last Update: "
                            + projects[i].last_updated;
            li.innerHTML += " <button class=\"btn btn-primary\" onclick='updateProject(" + projects[i].id + ")'>Update</button>";
            li.innerHTML += " <button class=\"btn btn-primary\" onclick='deleteProject(" + projects[i].id + ")'>Delete</button>";
            li.innerHTML += " <button class=\"btn btn-primary\" onclick='selectProject(" + projects[i].id + ")'>Select</button>";

            ul.appendChild(li);
        }
    });
    req.send();
}
//funcção que devolve as tarefas de um projecto
function getTask(id_projeto) {
    var req = new XMLHttpRequest();
    req.open("GET", "/api/projects/" + id_projeto + "/tasks/");
    req.addEventListener("load", function () {

        var tasks = JSON.parse(this.responseText);
        var ul = document.getElementById('listTasks');

        ul.innerHTML = '';

        tasks.sort(function (a, b) {
            return (a.order > b.order) ? 1 : -1
        });

        for (var i in tasks) {

            var li = document.createElement('li');
            li.innerHTML = tasks[i].title + " - Due Date: " + tasks[i].due_date + "- Completed: " + tasks[i].completed;
            li.innerHTML += " <button class=\"btn btn-primary\" onclick='updateTask(" + id_projeto + "," + tasks[i].id + "," + false + ")'>Update</button>";
            li.innerHTML += " <button class=\"btn btn-primary\" onclick='deleteTask(" + id_projeto + "," + tasks[i].id + ")'>Delete</button>";
            li.innerHTML += " <button class=\"btn btn-primary\" onclick='updateTask(" + id_projeto + "," + tasks[i].id + "," + true + ")'>Complete</button>";
            ul.appendChild(li);
        }
    });
    req.send();
}
//função para selecionar o projecto e mostra as tarefas desse projecto
function selectProject(id) {
    getTask(id);
    createTaskScreen(id);
}
//função para criar o ecra de tarefas
function createTaskScreen(id) {
    var div = document.getElementById("tarefasForm");

    if (div.childNodes.length >= 1) {
        div.removeChild(div.childNodes[0]);
        div.removeChild(div.childNodes[0]);
    }
    //create a form

    var projectLabel = document.createElement("h2");
    projectLabel.innerHTML = "Selected Project : " + id;
    div.appendChild(projectLabel);

    var createform = document.createElement('form');
    createform.setAttribute("action", "javascript:createTask(" + id + ");");
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

    //create Order label
    var order = document.createElement("label");
    title.setAttribute("for", "Order");
    var hOrder = document.createElement("h2");
    hOrder.innerHTML = "Order";
    order.appendChild(hOrder);
    fieldset.appendChild(order);

    //create Order input
    var orderInput = document.createElement("input");
    orderInput.setAttribute("class", "form-control");
    orderInput.setAttribute("id", "Order");
    orderInput.setAttribute("name", "Order");
    orderInput.setAttribute("placeholder", "Order");
    fieldset.appendChild(orderInput);

    //create DueDate Label
    var duedate = document.createElement("label");
    title.setAttribute("for", "DueDate");
    var hDudedate = document.createElement("h2");
    hDudedate.innerHTML = "DueDate";
    duedate.appendChild(hDudedate);
    fieldset.appendChild(duedate);

    //create DueDate input
    var duedateInput = document.createElement("input");
    duedateInput.setAttribute("class", "form-control");
    duedateInput.setAttribute("id", "DueDate");
    duedateInput.setAttribute("name", "DueDate");
    duedateInput.setAttribute("placeholder", "day month year");
    fieldset.appendChild(duedateInput);

    //create a button to submit
    var submitBtt = document.createElement("button");
    submitBtt.setAttribute("type", "submit");
    submitBtt.setAttribute("form", "formTasks");
    submitBtt.setAttribute("class", "btn btn-primary");
    submitBtt.innerHTML = "Create";
    fieldset.appendChild(submitBtt);

    createform.appendChild(fieldset);

    div.appendChild(createform);

}
//função que cria um projecto
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
//função para fazer update num projecto
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

//função para apagar um projecto
function deleteProject(id) {

    var req = new XMLHttpRequest();
    req.open("DELETE", "/api/projects/" + id + "/");
    req.addEventListener("load", function () {
        getProjects();
    });
    req.send();
}
//função para fazer logout
function logout() {
    var req = new XMLHttpRequest();
    req.open("POST", "/api/user/logout/");
    req.addEventListener("load", function () {
        window.location.replace('index_bootstrap.html');
    });
    req.send();

}
//função para criar uma tarefa
function createTask(project_id) {
    var form = document.getElementById("formTasks");

    var title = form.Title.value;
    var order = form.Order.value;
    var due_date = form.DueDate.value;


    var req = new XMLHttpRequest();
    req.open("POST", "/api/projects/" + project_id + "/tasks/");
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
        getTask(project_id);
    });
    req.send(JSON.stringify({"title": title, "order": order, "due_date": due_date}));
}
//função para fazer update a uma tarefa
function updateTask(id_projeto, id_task, completed) {
    var ogTitle = undefined;
    var ogOrder = undefined;
    var ogDue_date = undefined;
    var ogComplete = undefined;

    var req1 = new XMLHttpRequest();
    req1.open("GET", "/api/projects/" + id_projeto + "/tasks/" + id_task + "/");
    req1.addEventListener("load", function () {

        var tasks = JSON.parse(this.responseText);
        console.log(tasks);
        ogTitle = tasks.title;
        ogOrder = tasks.order;
        ogDue_date = tasks.due_date;
        ogComplete = tasks.completed;


        var title = document.getElementById("Title1").value;
        if (title === null) {
            title = ogTitle;
        }
        console.log("title: ", title);

        var order = document.getElementById("Order").value;
        if (order === null) {
            order = ogOrder;
        }
        console.log("order:", order);

        var due_date = document.getElementById("DueDate").value;
        if (due_date === undefined) {
            due_date = ogDue_date;
            console.log("safajvhsfvc");
        }
        console.log("due_date: ", due_date);

        var req = new XMLHttpRequest();
        req.open("PUT", "/api/projects/" + id_projeto + "/tasks/" + id_task + "/");
        req.setRequestHeader("Content-Type", "application/json");
        req.addEventListener("load", function () {
            getTask(id_projeto);
        });
        req.send(JSON.stringify({"title": title, "order": order, "due_date": due_date, "completed": completed}));
    });
    req1.send();


}
//função para apagar uma tarefa
function deleteTask(id_projeto, id_task) {
    var req = new XMLHttpRequest();
    req.open("DELETE", "/api/projects/" + id_projeto + "/tasks/" + id_task + "/");
    req.addEventListener("load", function () {
        getTask(id_projeto);
    });
    req.send();
}

getProjects();