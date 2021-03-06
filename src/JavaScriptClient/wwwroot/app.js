﻿/// <reference path="oidc-client.js" />

function log() {
    document.getElementById('results').innerText = '';

    Array.prototype.forEach.call(arguments, function (msg) {
        if (msg instanceof Error) {
            msg = "Error: " + msg.message;
        }
        else if (typeof msg !== 'string') {
            msg = JSON.stringify(msg, null, 2);
        }
        document.getElementById('results').innerHTML += msg + '\r\n';
    });
}

document.getElementById("login").addEventListener("click", login, false);
document.getElementById("api").addEventListener("click", api, false);
document.getElementById("logout").addEventListener("click", logout, false);
document.getElementById("gapi").addEventListener("click", gapiclick, false);
document.getElementById("refreshtoken").addEventListener("click", refreshclick, false);
document.getElementById("callgoogle").addEventListener("click", callgoogle, false);

var config = {
    authority: "http://localhost:5000",
    client_id: "js",
    redirect_uri: "http://localhost:5003/callback.html",
    response_type: "code",
    scope:"openid profile api1",
    post_logout_redirect_uri: "http://localhost:5003/index.html",
    loadUserInfo: true,
    IsExternalLoginOnly :true
};
var mgr = new Oidc.UserManager(config);
 

mgr.getUser().then(function (user) {
    if (user) {
        log("User logged in", user.profile);
    }
    else {
        log("User not logged in");
    }
});

function callgoogle() {
    let key = 'google_token';
    let contents = localStorage.getItem(key);

    if (contents !== null) {
        contents = JSON.parse(contents);

        function start() {
            // 2. Initialize the JavaScript client library.

    //        

           // window.gapi.client.init({
           //     'apiKey': 'AIzaSyCOZZoD6fpGl2cRcoiC8yQcLVRwnY6tl2Y',
                // clientId and scope are optional if auth is not required.
              //  'clientId': '183174195107-ud3u00alnb92q6vn4l54s7stpqbn3n4c.apps.googleusercontent.com',
               // 'scope': 'profile',
           // });

            window.gapi.client.setToken({ access_token: contents.value });

            var op = window.gapi.client.request({
                'path': 'https://people.googleapis.com/v1/people/me?requestMask.includeField=person.names',
            });

            op.execute(function (resp) {
                log(200, resp);
            });
        };

        window.gapi.load('client:auth2', () => {
            var accessTokenObj = {};
            accessTokenObj.access_token = contents.value;
            accessTokenObj.token_type = "Bearer";
            accessTokenObj.expires_in = "3600";

            window.gapi.auth.setToken(accessTokenObj);

            var op = window.gapi.client.request({
                'path': 'https://people.googleapis.com/v1/people/me?requestMask.includeField=person.names',
            });

            op.execute(function (resp) {
                log(200, resp);
            });
        });



     //   window.gapi.load('auth2', () => {
     //       window.gapi.auth2.authorize({
     //           clientId :'183174195107-ud3u00alnb92q6vn4l54s7stpqbn3n4c.apps.googleusercontent.com',
     //           prompt: 'none',
     //           response_type: 'permission', // Access Token.
    //            scope: 'profile',
    //            login_hint: 'hackray1978@gmail.com'
    //        }, function (result) {
    //                log(200, result);
    //            
    //        });
    //    });

    };

}

function refreshclick() {
    var url = "http://localhost:5000/token/refresh";

    mgr.getUser().then(function (user) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function () {
            log(xhr.status, JSON.parse(xhr.responseText));
        }
        xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
        xhr.send();
    });
}

function gapiclick() {
    var url = "http://localhost:5000/token";

    mgr.getUser().then(function (user) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function () {

            var resp = JSON.parse(xhr.response);

            let key = 'google_token';
            localStorage.setItem(key, JSON.stringify(resp));

            log(xhr.status, resp);            
        }
        xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
        xhr.send();
    });
}


function gapiclickold() {

    var url = "http://localhost:5000/Account/Test";

 

    if (window.gapi)
        console.log('gapi loaded');

    window.gapi.load('plus', 'v1', function () {
        var request = window.gapi.plus.people.get({
            'userId': 'me'
        });
        request.execute(function (resp) {
                console.log('loadPlus finished');

        });
    });

    //window.gapi.load('auth2', function () {
    //    /* Ready. Make a call to gapi.auth2.init or some other API */
    //    console.log('auth2 finished');

    //    let auth2 = gapi.auth2.init({
    //        client_id: '183174195107-spa00qp12u40nj4kb8od7nudc149l74q.apps.googleusercontent.com',
    //        scope: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/spreadsheets'
    //    });

    //    const loadPlus = () => {

            //window.gapi.client.load('plus', 'v1', function () {
            //    var request = gapi.client.plus.people.get({
            //        'userId': 'me'
            //    });
            //    request.execute(function (resp) {
            //        console.log('loadPlus finished');

            //    });
            //});


            //mgr.getUser().then(function (user) {
            //    var url = "https://www.googleapis.com/plus/v1/people/me";

            //    var xhr = new XMLHttpRequest();
            //    xhr.open("GET", url);
            //    xhr.onload = function () {
            //         console.log(xhr.status, JSON.parse(xhr.responseText));
            //    }
            //    xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
            //    xhr.send();
            //});

      //  };

     //   window.gapi.load('client', loadPlus);
        //var tp = window.gapi.auth2.getAuthInstance();
  // });



}

function init() {
    console.log('init called');
}

function login() {
    mgr.signinRedirect();
}

function api() {
    mgr.getUser().then(function (user) {
        var url = "http://localhost:5001/identity";

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function () {
            log(xhr.status, JSON.parse(xhr.responseText));
        }
        xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
        xhr.send();
    });
}

function logout() {
    mgr.signoutRedirect();
}