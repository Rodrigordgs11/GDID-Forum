const Users = require("../models/User");

async function createUser(req, res) {
    const { username, password } = req.body;
    const user = await Users.create({ username, password, roleId: 2 });
    res.status(201).json(user);
}

module.exports = { createUser };