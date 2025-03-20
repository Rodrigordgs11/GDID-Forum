document.addEventListener("DOMContentLoaded", function () {
    fetchUsers();
});

function fetchUsers() {
    fetch("http://localhost:3003/users", {
        method: "GET",
        credentials: "include",
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                alert("Error while fetching users: " + data.error);
            } else {
                renderUsers(data);
            }
        })
        .catch((error) => {
            console.error("Error while fetching products: " + error);
            alert("Error while fetching products: " + error);
        });
}

function renderUsers(users) {
    const tableBody = document.querySelector("#datatablesSimple tbody");
    if (!tableBody) {
        console.error("Erro: Tabela de usuários não encontrada.");
        return;
    }

    tableBody.innerHTML = "";

    users.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.Role.name}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit" data-id="${user.id}">Edit</button>
                <button type="button" class="btn btn-danger btn-delete">Delete</button>
            </td>
        `;
    
        row.querySelector(".btn-edit").addEventListener("click", () => openEditModal(user));
    
        row.querySelector(".btn-delete").addEventListener("click", () => {
            console.log(`Deleting user: ${user.name}`);
            deleteUser(user.id);
            row.remove();
        });
    
        tableBody.appendChild(row);
    });
}

function createUser() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;
    
    if (!name || !email || !phone || !password) {
        alert("Please fill in all fields.");
        return;
    }
    
    const userData = { name, email, phone, password };
    
    fetch("http://localhost:3003/users", { 
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(userData), 
        })
         .then(response => response.json())
         .then(data => { alert("User created successfully!"), location.reload() })
         .catch(error => console.error("Error:", error));
    
    document.getElementById("createUserForm").reset();
    var modal = bootstrap.Modal.getInstance(document.getElementById("createUserModal"));
    modal.hide();
}

function editUser(){
    const userId = document.getElementById("editUserId").value;
    const updatedUser = {
        name: document.getElementById("editUserName").value,
        phone: document.getElementById("editUserPhone").value,
    };

    try {

        fetch(`http://localhost:3003/user/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(updatedUser),
        })
            .then(response => response.json())
            .then(data => { alert("User updated successfully!"), location.reload() })
            .catch(error => console.error("Error:", error));
    } catch (error) {
        console.error("Error updating user:", error);
    }
}


function deleteUser(id){    
    fetch(`http://localhost:3003/user/${id}`, {
        method: "DELETE",
        credentials: "include",
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                alert("Error while deleting user: " + data.error);
            } else {
                alert("User deleted successfully");
            }
        })
        .catch((error) => {
            console.error("Error while deleting user: " + error);
            alert("Error while deleting user: " + error);
        });
}

function openEditModal(user) {
    document.getElementById("editUserId").value = user.id;
    document.getElementById("editUserName").value = user.name;
    document.getElementById("editUserEmail").value = user.email;
    document.getElementById("editUserPhone").value = user.phone;

    const editUserModal = new bootstrap.Modal(document.getElementById("editUserModal"));
    editUserModal.show();
}
