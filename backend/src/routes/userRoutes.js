const express = require("express");
const { createUser, getUserRole } = require("../services/userService");

const router = express.Router();

router.post("/users", createUser);
router.get("/user-role", getUserRole);

module.exports = router;


