document.addEventListener("DOMContentLoaded", function () {
    const baseUrl = window.location.origin + window.location.pathname; 
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const client_id = urlParams.get("client_id");
    const client_secret = urlParams.get("client_secret");

    if (code) {

        const data = {
            code,
            // state,
            client_id: client_id,
            client_secret: client_secret,
            redirect_uri: baseUrl,
        };

        fetch("http://localhost:3001/exchange-code-for-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    alert("Erro ao realizar login");
                } else {
                    //localStorage.setItem("token", data.token);
                    window.location.href = "http://localhost:8282/";
                }
            })
            .catch((error) => {
                console.error("Erro ao realizar login:", error);
                alert("Erro ao realizar login");
            });
    }
});