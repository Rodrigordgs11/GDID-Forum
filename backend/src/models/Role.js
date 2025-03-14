const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Roles = sequelize.define("Roles", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
});

module.exports = Roles;