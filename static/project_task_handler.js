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
            li.innerHTML = projects[i].title + "" + projects[i].last_updated + projects[i].creation_date;
            li.innerHTML += " <button onclick='updateProject(" + projects[i].id + ")'>Update</button>";
            li.innerHTML += " <button onclick='deleteProject(" + projects[i].id + ")'>Delete</button>";
            li.innerHTML += " <button onclick='selectProject(" + projects[i].id + ")'>Select</button>";

            ul.appendChild(li);
        }
    });
    req.send();
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
    var form = document.getElementById("formLogin");
    var title = form.Title.value;

    var req = new XMLHttpRequest();
    req.open("PUT", "/api/projects/"+ id +"/");
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
        getProjects();
    });
    req.send(JSON.stringify({"title": title}));
}


function deleteProject(id) {

    var req = new XMLHttpRequest();
    req.open("DELETE", "/api/projects/"+ id +"/");
    req.addEventListener("load", function () {
        getProjects();
    });
    req.send();
}


getProjects();