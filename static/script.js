/**
 * REST Client
 *
 */
function elementosFilhos(elemento) {
    /** @todo Retornar os elementos filhos (nós do tipo Node.ELEMENT_NODE) num array */
    let childNode = [];
    for (let child of elemento.childNodes)
        if (child.nodeType === Node.ELEMENT_NODE)
            childNode.push(child);
    return childNode;
}

function substituirFilhos(id, novoFilho) {
    /** @todo Procurar o elemento com o id dado e substituir os seus filhos pelo novo filho. */
    let elemento = document.getElementById(id);
    while (elemento.firstChild)
        elemento.removeChild(elemento.firstChild);
    elemento.appendChild(novoFilho);
}

window.onload = function (event) {
};

// função que faz o login do user
function login() {
    var form = document.getElementById("formLogin");
    var username = form.UserName.value;
    var password = form.Password.value;

    var req = new XMLHttpRequest();
    req.open("POST", "/api/user/login/");
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
        if (this.status === 201) {
            window.location.replace('static/MainPage.html');
        } else {
            var responselogin = document.getElementById("loginResponse");
            responselogin.setAttribute("class", "text-danger");
            responselogin.innerHTML = this.responseText;
        }
    });
    req.send(JSON.stringify({"username": username, "password": password}));
}

// função que regista um user
function register() {
    var form = document.getElementById("formRegistar");
    var name = form.Name.value;
    var email = form.Email.value;
    var username = form.UserName.value;
    var password = form.Password.value;


    var req = new XMLHttpRequest();
    req.open("POST", "/api/user/register/");
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
        var responseDiv = document.getElementById("responseRegistar");

        if (this.status === 400) {
            responseDiv.setAttribute("class", "text-danger");
            responseDiv.innerHTML = this.responseText;
        } else if (this.status === 201) {
            responseDiv.setAttribute("class", "text-success");
            responseDiv.innerHTML = "Utilizador Registado Com Sucesso";
        }
        else if (this.status === 500){

        }
        console.log(this.status);
    });
    req.send(JSON.stringify({
        "username": username, "password": password,
        "name": name, "email": email
    }));

}

