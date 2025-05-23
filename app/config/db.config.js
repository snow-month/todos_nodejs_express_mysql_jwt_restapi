import {configDotenv} from "dotenv";

configDotenv();

export default {
    HOST: process.env.MYSQL_HOST,
    USER: process.env.MYSQL_ROOT_USER,
    PASSWORD: process.env.MYSQL_ROOT_PASSWORD,
    DB_NAME: process.env.MYSQL_DATABASE,
    PORT: process.env.MYSQL_PORT,
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        // максимальное время, в миллисекундах, в течение которого пул будет пытаться
        // получить соединение, прежде чем выбросить ошибку
        acquire: 30000,
        // максимальное время, в миллисекундах, в течение которого соединение может простаивать,
        // прежде чем будет освобождено
        idle: 10000
    }
}