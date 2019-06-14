/**
 * REST Client
 *
 */
function elementosFilhos(elemento) {
    /** @todo Retornar os elementos filhos (nós do tipo Node.ELEMENT_NODE) num array */
    let childNode= [];
    for(let child of elemento.childNodes)
        if(child.nodeType===Node.ELEMENT_NODE)
            childNode.push(child);
    return childNode;
};

function substituirFilhos(id, novoFilho) {
    /** @todo Procurar o elemento com o id dado e substituir os seus filhos pelo novo filho. */
    let elemento = document.getElementById(id);
    while(elemento.firstChild)
        elemento.removeChild(elemento.firstChild);
    elemento.appendChild(novoFilho);
};

window.onload = function (event) {
    window.dados = new Informacao("informacao");
}

function getUsers() {
    var req = new XMLHttpRequest();
    req.open("GET", "/api/users/");
    req.addEventListener("load", function() {
        var users = JSON.parse(this.responseText);
        var ul = document.getElementById('users');
        ul.innerHTML = '';
        for (var i in users) {
            var li = document.createElement('li');
            li.innerHTML = users[i].name + ' (' + users[i].age + ')';
            li.innerHTML += " <button onclick='updateUser(" + users[i].id +  ")'>Update</button>";
            li.innerHTML += " <button onclick='deleteUser(" + users[i].id +  ")'>Delete</button>";
            ul.appendChild(li);
        }
    });
    req.send();
}

function addUser() {
    var form = document.getElementById("form");
    var name = form.name.value;
    var age = form.age.value;

    console.log("Add: " + name + " " + age);
}

function updateUser(id) {
    var form = document.getElementById("form");
    var name = form.name.value;
    var age = form.age.value;

    console.log("Update: " + name + " " + age);
}

function deleteUser(id) {
    console.log("Delete: " + id)
}

getUsers();
