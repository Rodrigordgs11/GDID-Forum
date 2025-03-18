const { sequelize } = require("../config/database");

const checkRole = (requiredRole) => {
    return async (req, res, next) => {
        try {

            if (!req.email) {
                return res.status(401).json({ message: "User not authenticated" });
            }

            const user = await sequelize.models.Users.findOne({
                where: { email: req.email},
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const role = await sequelize.models.Roles.findOne({
                where: { id: user.roleId },
            });

            if (role.name !== requiredRole) {
                return res.status(403).json({ message: "Access denied" });
            }

            next();
        } catch (error) {
            return res.status(500).json({ message: "Internal error", error: error.message });
        }
    };
};

module.exports = checkRole;