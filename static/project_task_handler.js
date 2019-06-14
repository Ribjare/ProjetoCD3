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
            li.innerHTML = projects[i].title + projects[i].age + projects[i].creation_date;
            li.innerHTML += " <button onclick='updateUser(" + projects[i].id + ")'>Update</button>";
            li.innerHTML += " <button onclick='deleteUser(" + projects[i].id + ")'>Delete</button>";
            ul.appendChild(li);
        }
    });
    req.send();
}

