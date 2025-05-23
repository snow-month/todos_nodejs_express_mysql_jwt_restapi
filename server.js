import express from 'express';
import cors from "cors";
import db from "./app/models/index.js";
import {configDotenv} from "dotenv";

const app = express();

const corsOptions = {
    origin: "http://localhost:8081"
}

app.use(cors(corsOptions));
app.use(express.json());
// разбор запросов с типом содержимого - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.json({message: 'Welcome to the server!'});
})
// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/test", userRoutes);

// используем process.env для установки порта
configDotenv();
const PORT = process.env.APP_PORT || 8080;

// синхронизация с бд, после успешной синхронизации запускаем сервер
db.sequelize.sync({force: false})
    .then(() => {
        console.log("Database synchronized");
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
        })
    })
    .catch((err) => {
        console.error(err);
    });