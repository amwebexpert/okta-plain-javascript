var oktaSignIn = new OktaSignIn({
    baseUrl: "https://dev-312623.okta.com",
    clientId: "0oa2dm5seuARkTHxA357",
    authParams: {
        issuer: "default",
        responseType: ['token', 'id_token'],
        display: 'page'
    }
});

if (oktaSignIn.token.hasTokensInUrl()) {
    loginSuccessHandler();
} else {
    refreshLoginState();
}

function loginSuccessHandler() {
    oktaSignIn.token.parseTokensFromUrl(
        // If we get here, the user just logged in.
        function success(res) {
            var accessToken = res[0];
            var idToken = res[1];

            oktaSignIn.tokenManager.add('accessToken', accessToken);
            oktaSignIn.tokenManager.add('idToken', idToken);

            window.location.hash = '';
            document.getElementById("messageBox").innerHTML = "Hello, " + idToken.claims.email + "! You just logged in! :)";
        },
        function error(err) {
            console.error(err);
        }
    );
}

function refreshLoginState() {
    oktaSignIn.session.get(function (res) {
        // If we get here, the user is already signed in.
        if (res.status === 'ACTIVE') {
            document.getElementById("logout-button").style.display = 'block';
            document.getElementById("messageBox").style.display = 'block';
            document.getElementById("messageBox").innerHTML = "Hello, " + res.login + "! You are *still* logged in! :)";
            return;
        }

        document.getElementById("messageBox").style.display = 'none';
        document.getElementById("logout-button").style.display = 'none';
        document.getElementById("messageBox").innerHTML = "You are not logged in";

        oktaSignIn.renderEl(
            { el: '#okta-login-container' },
            function success(res) { },
            function error(err) {
                console.error(err);
            }
        );
    });
}

function logout() {
    oktaSignIn.session.close((err) => {
        if (err) {
            console.error(err);
        } else {
            window.location.href = '/';
        }
    });
}
