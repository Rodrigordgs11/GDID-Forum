document.addEventListener("DOMContentLoaded", function () {
    const loginPageURL = localStorage.getItem('loginPageURL');

    document.getElementById("registerForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const password = document.getElementById("password").value;

        const formData = JSON.stringify({ email, name, phone, password });

        try {
            const response = await fetch("http://localhost:3003/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: formData,
                credentials: "include"
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Unknown error");
            }

            const data = await response.json();
            setTimeout(() => {
                alert("Sign up successful! Redirecting to login page...");
                window.location.replace(loginPageURL);
            }, 1000); 
        } catch (error) {
            document.getElementById("errorMessage").innerText = "Erro: " + error.message;
        }
    });
    
    if (loginPageURL) {
         const backToLoginLink = document.getElementById('backToLogin');
         if (backToLoginLink) {
             backToLoginLink.href = loginPageURL;
         }
    }
});