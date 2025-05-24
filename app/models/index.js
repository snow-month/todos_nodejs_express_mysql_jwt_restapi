import dbConfig from "../config/db.config.js";
import {Sequelize} from "sequelize";
import User from "./user.model.js";
import Role from "./role.model.js";

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

db.user = User(sequelize, Sequelize);
db.role = Role(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
    through: "users_roles",
});
db.user.belongsToMany(db.role, {
    through: "users_roles",
});

db.ROLES = ["USER", "ADMIN"];

export default db;