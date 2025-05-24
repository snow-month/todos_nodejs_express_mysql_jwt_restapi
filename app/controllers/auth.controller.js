import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import authConfig from "../config/auth.config.js";

const {user: User, role: Role} = db;

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

        const token = jwt.sign({id: user.id}, authConfig.secret,
            {algorithm: "HS256", expiresIn: "1h"});

        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: user.roles,
            accessToken: token,
        });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}