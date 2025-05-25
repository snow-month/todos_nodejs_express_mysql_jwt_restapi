import {configDotenv} from "dotenv";

configDotenv();

export default {
    jwtSecret: process.env.AUTH_SECRET,
    jwtExpiration: 3600,           // 1 hour
    jwtRefreshExpiration: 86400,   // 24 hours
    algorithm: "HS256",

    // for test
    // jwtExpiration: 60,          // 1 minute
    // jwtRefreshExpiration: 120,  // 2 minutes
}