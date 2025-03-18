document.addEventListener("DOMContentLoaded", async function () {
    const baseUrl = window.location.origin + window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const client_id = urlParams.get("client_id");
    const client_secret = urlParams.get("client_secret");

    if (code) {
        const data = {
            code,
            client_id: client_id,
            client_secret: client_secret,
            redirect_uri: baseUrl,
        };

        try {
            const response = await fetch("http://localhost:3001/exchange-code-for-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (responseData.error) {
                alert("Error while exchanging code for token: " + responseData.error);
            } else {
                const userRole = await getUserRole(responseData.id_token);

                document.cookie = `access_token=${responseData.access_token}; path=/; SameSite=None; Secure`;
                document.cookie = `refresh_token=${responseData.refresh_token}; path=/; SameSite=None; Secure`;

                if (userRole === "admin") {
                    window.location.href = "http://localhost:8282/admin/index.html";
                } else if (userRole === "customer") {
                    window.location.href = "http://localhost:8282/";
                } else {
                    window.location.href = "http://localhost:8282/login.html";
                }
            }
        } catch (error) {
            alert("Error while exchanging code for token: " + error);
        }
    }
});

async function getUserRole(id_token) {
    try {
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${id_token}`);

        const response = await fetch("http://localhost:3003/user-role", {
            method: "GET",
            headers: headers,
        });

        const data = await response.json();

        if (data.error) {
            alert("Error while fetching user role: " + data.error);
            return null; 
        } else {
            return data.role; 
        }
    } catch (error) {
        alert("Error while fetching user role: " + error);
        return null;
    }
}

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");

    try {
        const response = await axios.post("http://localhost:3003/login", { email, password });
        document.cookie = `access_token=${response.data.access_token}; path=/; SameSite=None; Secure`;
        document.cookie = `refresh_token=${response.data.refresh_token}; path=/; SameSite=None; Secure`;
        window.location.href = "http://localhost:8282/"; 
    } catch (error) {
        errorMessage.textContent = error.response?.data?.error || "Login failed";
    }
});
