require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");
const axios = require("axios");

let cachedKeys = null;

const fetchJWKS = async () => {
    try {
        if (!cachedKeys) {
            const { data } = await axios.get(process.env.JWKS_URL);
            cachedKeys = data.keys;
        }
        return cachedKeys;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getPublicKey = async (kid) => {
    const keys = await fetchJWKS();
    const key = keys.find((k) => k.kid === kid);
    if (!key) throw new Error(`Public key with kid '${kid}' not found.`);
    return jwkToPem(key);
};

const authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) throw new Error("Token not provided.");

        const decodedHeader = jwt.decode(token, { complete: true });
        if (!decodedHeader) throw new Error("Invalid JWT format.");

        const publicKey = await getPublicKey(decodedHeader.header.kid);
        const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });

        req.email = decoded.email;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized", error: error.message });
    }
};


module.exports = { authenticate, getPublicKey };