document.addEventListener("DOMContentLoaded", function () {
    protectedRoute();
});

function protectedRoute() {
    if (!document.cookie.split(";").find((cookie) => cookie.includes("access_token"))) {
        window.location.href = "http://localhost:8282/login.html";
        return;
    }
    
    const access_token = document.cookie.split(";").find((cookie) => cookie.includes("access_token")).split("=")[1];

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${access_token}`);

    fetch("http://localhost:3003/protected", {
        method: "GET",
        headers: headers,
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.error) {
            alert("Error while fetching protected route: " + data.error);
            window.location.href = "http://localhost:8282/login.html";
        } else {
            console.log("Protected route accessed successfully.");
        }
    })
    .catch((error) => {
        alert("Error while fetching protected route: " + error);
        window.location.href = "http://localhost:8282/login.html";
    });
}

async function token_refresh(refresh_token) {
    console.log("Refreshing token...");
    try {
        fetch("http://localhost:3001/oauth/refresh-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh_token: refresh_token }),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                alert("Error while refreshing token: " + data.error);
            } else {
                document.cookie = `access_token=${data.access_token}; path=/; SameSite=None; Secure`;
                document.cookie = `refresh_token=${data.refresh_token}; path=/; SameSite=None; Secure`;
            }
        })
    } catch (error) {
        alert("Error while refreshing token: " + error);
        return false;
    }

    return false;
}

setInterval(async function () {
    const refresh_token = document.cookie.split(";").find((cookie) => cookie.includes("refresh_token")).split("=")[1];
    await token_refresh(refresh_token);
}, 299999);

function logout() {
    const accessTokenCookie = document.cookie.split("; ").find(row => row.startsWith("access_token="));
    
    if (!accessTokenCookie) {
        alert("No access token found, redirecting to login...");
        window.location.href = "http://localhost:8282/login.html";
        return;
    }

    const access_token = accessTokenCookie.split("=")[1];

    fetch(`http://localhost:3001/logout`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${access_token}`,
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Logout request failed");
        }
        return response.json();
    })
    .then(() => {
        document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=None; Secure";
        document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=None; Secure";

        window.location.href = "http://localhost:8282/login.html";
    })
    .catch(error => {
        alert("Error while logging out: " + error);
    });
}
