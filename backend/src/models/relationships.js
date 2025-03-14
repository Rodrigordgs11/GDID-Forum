const Users = require("./User");
const Roles = require("./Role");

Users.belongsTo(Roles, { foreignKey: "roleId" });
Roles.hasMany(Users, { foreignKey: "roleId" });