import express from 'express';
import cors from "cors";
import {configDotenv} from "dotenv";
import bcrypt from "bcryptjs";
import db from "./app/models/index.js";
import authRoutes from "./app/routes/auth.routes.js";
import userRoutes from "./app/routes/user.routes.js";
import helmet from "helmet";

const app = express();

const corsOptions = {
    origin: "http://localhost:8081"
}

app.use(cors(corsOptions));
app.use(express.json());
// разбор запросов с типом содержимого - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));
/*
 Для защиты вашего приложения, таких как контроль над заголовками HTTP,
 предотвращение атак межсайтового скриптинга (XSS) и подделки межсайтовых
 запросов (CSRF), а также защиту от других уязвимостей безопасности.
 */
app.use(helmet());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/test", userRoutes);

// используем process.env для установки порта
configDotenv();
const PORT = process.env.APP_PORT || 8080;

// синхронизация с бд, после успешной синхронизации запускаем сервер
// {force: true} существующие таблицы будут перезаписаны
db.sequelize.sync({force: true})
    .then(() => {
        console.log("Database synchronized");
        initial();
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error(err);
    });

async function initial() {
    const Role = db.role;
    const roleUser = await Role.create({name: "USER"});
    const roleAdmin = await Role.create({name: "ADMIN"});

    const User = db.user;
    const userHashPassword = await bcrypt.hash("user", 10);
    const user = await User.create({
        username: "user",
        email: "user@home.org",
        password: userHashPassword,
    });
    user.setRoles(roleUser);

    const adminHashPassword = await bcrypt.hash("admin", 10);
    const admin = await User.create({
        username: "admin",
        email: "admin@company.com",
        password: adminHashPassword,
    });
    admin.setRoles(roleAdmin);
}