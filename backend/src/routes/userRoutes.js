const express = require("express");
const { createUser, getUserRole, getUsers, updateUser, deleteUser } = require("../services/userService");

const router = express.Router();

router.post("/users", createUser);
router.get("/users", getUsers);
router.get("/user-role", getUserRole);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

module.exports = router;


