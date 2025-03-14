const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Roles = sequelize.define("Roles", {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
});

module.exports = Roles;