document.addEventListener("DOMContentLoaded", function () {
    protectedRoute();
});

function protectedRoute() {
    fetch("http://localhost:3003/protected-admin", {
        method: "GET",
        credentials: "include",
    })
    .then((response) => {
        if (response.status === 403) {
            window.location.href = "http://localhost:8282/login.html";
            return;
        }
        return response.json();
    })
    .then((data) => {
        if (data.error) {
            window.location.href = "http://localhost:8282/login.html";
        } else {
            console.log("Protected route accessed successfully.");
        }
    })
    .catch((error) => {
        window.location.href = "http://localhost:8282/login.html";
    });
}

async function token_refresh() {
    console.log("Refreshing token...");
    try {
        fetch("http://localhost:3001/oauth/refresh-token", {
            method: "GET",
            credentials: "include",
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                alert("Error while refreshing token: " + data.error);
            }
        })
    } catch (error) {
        alert("Error while refreshing token: " + error);
        return false;
    }

    return false;
}

async function refresh_token_withouth_idp() {
    console.log("Refreshing token without IDP...");
    try {
        fetch("http://localhost:3003/refresh-token", {
            method: "GET",
            credentials: "include",
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                alert("Error while refreshing token without IDP: " + data.error);
            }
        })
    } catch (error) {
        alert("Error while refreshing token without IDP: " + error);
        return false;
    }
    return false;
}

async function getAuthMethods() {
    try {
        const response = await fetch("http://localhost:3003/auth-method", {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json();

        if (data.error) {
            alert("Error while fetching auth methods: " + data.error);
        } else {
            return data.method;
        }
    } catch (error) {
        alert("Error while fetching auth methods: " + error);
    }
}

setInterval(async function () {
    const authMethods = await getAuthMethods();
    console.log("Auth methods: " + authMethods);
    if (authMethods === "idp") {
        token_refresh();
    } else {
        refresh_token_withouth_idp();
    }
}, 290000);

async function logout() {
    const authMethods = await getAuthMethods();
    if (authMethods === "idp") {
        logoutWithIDP();
    } else {
        logoutWithoutIDP();
    }
}


function logoutWithIDP() {
    fetch("http://localhost:3001/logout", {
        method: "GET",
        credentials: "include",
    })
    .then((response) => {
        if (response.ok) {
            window.location.href = "http://localhost:8282/login.html";
        } else {
            alert("Error while logging out: " + response.statusText);
        }
    })
    .catch((error) => {
        alert("Error while logging out: " + error);
    });
}

function logoutWithoutIDP() {
    fetch("http://localhost:3003/logout", {
        method: "GET",
        credentials: "include",
    })
    .then((response) => {
        if (response.ok) {
            window.location.href = "http://localhost:8282/login.html";
        } else {
            alert("Error while logging out: " + response.statusText);
        }
    })
    .catch((error) => {
        alert("Error while logging out: " + error);
    });
}