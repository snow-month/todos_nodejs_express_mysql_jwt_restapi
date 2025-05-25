import {Sequelize} from "sequelize";
import dbConfig from "../config/db.config.js";
import User from "./user.model.js";
import Role from "./role.model.js";
import RefreshToken from "./refreshToken.model.js";

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
db.refreshToken = RefreshToken(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
    through: "users_roles",
});
db.user.belongsToMany(db.role, {
    through: "users_roles",
});

db.refreshToken.belongsTo(db.user, {
    foreignKey: "userId",
    targetKey: "id",
});
db.user.hasOne(db.refreshToken, {
    foreignKey: "userId",
    targetKey: "id",
});

db.ROLES = ["USER", "ADMIN"];

export default db;