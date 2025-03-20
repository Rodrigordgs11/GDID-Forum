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

    res.cookie("app2_access_token", access_token, {
        httpOnly: true,       
        secure: false,         
        sameSite: "Lax",       
        maxAge: 300 * 1000
    });

    res.cookie("app2_refresh_token", refresh_token, {
        httpOnly: true,       
        secure: false,         
        sameSite: "Lax",       
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ access_token, refresh_token });
}

async function token_refresh(req, res) {

    const refresh_token = req.cookies.app2_refresh_token;
    if (!refresh_token) return res.status(400).json({ error: "Refresh token is required" });

    try {
        const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET);
        const access_token = jwt.sign({ sub: decoded.sub, email: decoded.email }, process.env.JWT_SECRET, { expiresIn: "5m" });

        res.cookie("app2_access_token", access_token, {
            httpOnly: true,       
            secure: false,         
            sameSite: "Lax",       
            maxAge: 300 * 1000
        });

        return res.json({ access_token, refresh_token });
    } catch (error) {
        return res.status(401).json({ error: "Invalid refresh token" });
    }
}

async function logout(req, res) {
    res.clearCookie("app2_access_token");
    res.clearCookie("app2_refresh_token");
    return res.json({ message: "Logged out" });
}

async function getAuthMethod(req, res) {
    try {
        const token = req.cookies.app2_access_token || req.cookies.access_token;
        if (!token) throw new Error("Token not provided.");

        const decodedHeader = jwt.decode(token, { complete: true });
        if (!decodedHeader) throw new Error("Invalid JWT format.");

        if (decodedHeader.header.kid) {
            return res.json({ method: "idp" });
        } else {
            return res.json({ method: "sp" });
        }
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized", error: error.message });
    }
}

module.exports = { login, token_refresh, logout, getAuthMethod };