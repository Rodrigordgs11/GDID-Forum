const Users = require("../models/User");
const Roles = require("../models/Role");
const jwt = require("jsonwebtoken");
const { getPublicKey } = require("../middlewares/authenticate");

async function createUser(req, res) {
    try {
        const { email, name, phone, password } = req.body;
        const role = await Roles.findOne({ where: { name: "customer" } });
        const user = await Users.create({ email, name, phone, password, roleId: role.id });
        return res.status(201).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error creating user" });
    }
}

async function getUsers(req, res) {
    try {
        const users = await Users.findAll({
            include: [
            {
                model: Roles,
                attributes: ["name"]
            }
            ]
        });

        if (!users.length) {
            return res.status(404).json({ message: "No users found." });
        }

        return res.json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching users" });
    }
}

async function getUserRole(req, res) {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) return res.status(401).json({ message: "Token not provided." });

        const decodedHeader = jwt.decode(token, { complete: true });
        if (!decodedHeader) return res.status(401).json({ message: "Invalid JWT format." });

        let decoded;
        if (!decodedHeader.header.kid) {
            decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
        } else {
            const publicKey = await getPublicKey(decodedHeader.header.kid);
            decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
        }

        let user = await Users.findOne({ where: { email: decoded.email } });
        if (!user) {
            const role = await Roles.findOne({ where: { name: "customer" } });
            user = await Users.create({ email: decoded.email, name: decoded.name, phone: decoded.phone, roleId: role.id });
        }

        const userRole = await Roles.findOne({ where: { id: user.roleId } });
        return res.json({ role: userRole.name });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching user role" });
    }
}

async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const { name, phone } = req.body;

        const user = await Users.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        await user.update({ name, phone });
        return res.json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error updating user" });
    }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.params;

        const user = await Users.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        await user.destroy();
        return res.json({ message: "User deleted successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting user" });
    }
}

module.exports = { createUser, getUsers, getUserRole, updateUser, deleteUser };