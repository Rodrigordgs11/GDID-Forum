const { sequelize } = require("../config/database");
const Users = require("../models/User");
const Roles = require("../models/Role");

const seed = async () => {
    await sequelize.sync({ force: true });

    const roles = [
        { name: "customer" },
        { name: "admin" }
    ];

    const users = [
        { username: "user", password: "user", roleId: "1" },
        { username: "rodrigordgs11", password: "rodrigo", roleId: "2" },
        { username: "pedroslv05", password: "pedro", roleId: "2" }
    ];

    for (let role of roles) {
        await Roles.create(role);
    }

    for (let user of users) {
        await Users.create(user);
    }

    console.log("Database seeded successfully.");
}

module.exports = seed;