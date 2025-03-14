const { sequelize } = require("../config/database");
const Users = require("../models/User");
const Roles = require("../models/Role");

const seed = async () => {
    try {
        await sequelize.sync({ force: true });

        const roles = await Promise.all([
            Roles.create({ name: "customer" }),
            Roles.create({ name: "admin" })
        ]);

        const customerRole = roles.find(role => role.name === "customer");
        const adminRole = roles.find(role => role.name === "admin");

        const users = [
            { username: "user", password: "user", roleId: customerRole.id },
            { username: "rodrigordgs11", password: "rodrigo", roleId: adminRole.id },
            { username: "pedroslv05", password: "pedro", roleId: adminRole.id }
        ];

        await Users.bulkCreate(users);

        console.log("Database seeded successfully.");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
}

module.exports = seed;
