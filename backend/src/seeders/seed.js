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
            { email: "user@gmail.com", name: "User", phone: "123456789", password: "user", roleId: customerRole.id },
            { email: "rodrigordgs11@gmail.com", name: "Rodrigo", phone: "987654321", password: "rodrigo", roleId: adminRole.id },
            { email: "pedroslv05@gmail.com", name: "Pedro", phone: "987654321", password: "pedro", roleId: adminRole.id }
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
