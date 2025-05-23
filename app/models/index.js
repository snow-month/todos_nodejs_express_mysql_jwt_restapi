import dbConfig from "../config/db.config.js";
import {Sequelize} from "sequelize";
import userModel from "./user.model.js";
import roleModel from "./role.model.js";

const sequelize = new Sequelize(
    dbConfig.DB_NAME,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        port: dbConfig.PORT,
        dialect: dbConfig.dialect,
        pool: dbConfig.pool,
    });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = userModel(sequelize, Sequelize);
db.role = roleModel(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
    through: "users_roles",
    foreignKey: 'role_id',
    otherKey: 'user_id',
});
db.user.belongsToMany(db.role, {
    through: "users_roles",
    foreignKey: 'user_id',
    otherKey: 'role_id',
    as: 'role',
});

db.ROLES = ["USER", "ADMIN"];

export default db;