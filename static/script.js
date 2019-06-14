/**
 * REST Client
 *
 */



function login() {
    var form = document.getElementById("formLogin");
    var username = form.UserName.value;
    var password = form.Password.value;

    var req = new XMLHttpRequest();
    req.open("POST", "/api/user/login/");
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function(){
        window.location.href = 'static/MainPage.html';
    });
    req.send(JSON.stringify({"username": username, "password": password}));
}

function register(){
    var form = document.getElementById("formRegistar");
    var name = form.name.value;
    var email = form.Email.value;
    var username = form.UserName.value;
    var password = form.Password.value;

    var req = new XMLHttpRequest();
    req.open("POST", "/api/user/register/");
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function(){

    });
    req.send(JSON.stringify({"username": username, "password": password,
                            "name": name, "email": email}));

}

