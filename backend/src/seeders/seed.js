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
            { name: "user", password: "user", email: "user@gmail.com", phone: "123456789", roleId: customerRole.id },
            { name: "rodrigordgs11", password: "rodrigo", email: "rodrigo@gmail.com", phone: "123456789", roleId: adminRole.id },
            { name: "pedroslv05", password: "pedro", email: "pedro@gmail.com", phone: "123456789", roleId: adminRole.id },
        ];

        for (const user of users) {
            await Users.create(user);
        }

        console.log("Database seeded successfully.");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
}

module.exports = seed;
