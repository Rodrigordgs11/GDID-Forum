const Users = require("../models/User");
const Roles = require("../models/Role");

async function createUser(req, res) {
    const { username, password } = req.body;
    const role = await Roles.findOne({ where: { name: "customer" } });
    const user = await Users.create({ username, password, roleId: role.id });
    res.status(201).json(user);
}

module.exports = { createUser };