const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sequelize } = require("../config/database");


async function login(req, res) {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({error: "Email and password are required"});
    }

    const user = await sequelize.models.Users.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const access_token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "5m" });
    const refresh_token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.json({ access_token, refresh_token });
}

async function token_refresh(req, res) {
    const { refresh_token } = req.body;
    if (!refresh_token) {
        return res.status(400).json({ error: "Refresh token is required" });
    }

    try {
        const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET);
        const access_token = jwt.sign({ sub: decoded.sub, email: decoded.email }, process.env.JWT_SECRET, { expiresIn: "5m" });
        return res.json({ access_token, refresh_token });
    } catch (error) {
        return res.status(401).json({ error: "Invalid refresh token" });
    }
}

module.exports = { login, token_refresh };