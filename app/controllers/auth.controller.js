import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import authConfig from "../config/auth.config.js";

const {user: User, role: Role, refreshToken: RefreshToken} = db;

// регистрация
export const signup = async (req, res) => {
    try {
        // добавить роль(roles) при создании пользователя
        const {username, email, password, roles} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({username, email, password: hashedPassword});

        const userRole = await Role.findOne({where: {name: "USER"}});
        await user.setRoles([userRole]);

        res.status(201).json({message: "User registered successfully!"});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

// вход в систему
export const signin = async (req, res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({
            where: {username},
            include: {model: Role, as: "roles"}
        });

        if (!user) {
            res.status(404).json({message: "User Not found."});
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).json({
                accessToken: null,
                message: "Invalid Password!"
            });
        }

        const token = jwt.sign({id: user.id}, authConfig.jwtSecret,
            {algorithm: authConfig.algorithm, expiresIn: authConfig.jwtExpiration});

        let refreshToken = await RefreshToken.createToken(user);

        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: user.roles,
            accessToken: token,
            refreshToken: refreshToken,
        });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

export const refreshToken = async (req, res) => {
    const {refreshToken: requestToken} = req.body;

    if (requestToken == null) {
        return res.status(403).json({message: "Refresh Token is required!"});
    }

    try {
        let refreshToken = await RefreshToken
            .findOne({where: {token: requestToken}});

        if (!refreshToken) {
            return res.status(403).json({message: "Refresh Token is not database!"});
        }

        if (RefreshToken.verifyExpiration(refreshToken)) {
            RefreshToken.destroy({where: {token: refreshToken.id}});

            return res.status(403)
                .json({message: "Refresh token was expired. Please make a new signin request."});
        }

        const user = await refreshToken.getUser();
        const newAccessToken = jwt.sign({id: user.id}, authConfig.jwtSecret,
            {algorithm: authConfig.algorithm, expiresIn: authConfig.jwtExpiration});

        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}