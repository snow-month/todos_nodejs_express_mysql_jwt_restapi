import {v4 as uuidv4} from "uuid";
import authConfig from "../config/auth.config.js";

export default (sequelize, Sequelize) => {
    const RefreshToken = sequelize.define("refreshToken", {
        token: {type: Sequelize.STRING},
        expiryDate: {type: Sequelize.DATE},
    });

    RefreshToken.createToken = async function (user) {
        let expireAt = new Date();

        expireAt.setSeconds(expireAt.getSeconds() + authConfig.jwtRefreshExpiration);

        let _token = uuidv4();

        let refreshToken = await this.create({
            token: _token,
            userId: user.id,
            expiryDate: expireAt.getTime(),
        });

        return refreshToken.token;
    };

    RefreshToken.verifyExpiration = (token) => {
        return token.expiryDate.getTime() < Date.now();
    };

    return RefreshToken;
}