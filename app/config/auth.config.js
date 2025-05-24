import {configDotenv} from "dotenv";

configDotenv();

export default {
    secret: process.env.SECRET,
}