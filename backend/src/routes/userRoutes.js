const express = require("express");
const { createUser } = require("../services/userService");

const router = express.Router();

router.post("/users", createUser);

module.exports = router;


