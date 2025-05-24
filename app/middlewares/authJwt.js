import jwt from "jsonwebtoken";
import db from "../models/index.js";
import authConfig from "../config/auth.config.js";

const {user: User} = db;

export const verifyToken = async (req, res, next) => {
    const token = req.headers["x-access-token"] || req.headers["authorization"];

    if (!token) {
        return res.status(403).json({message: "No token provided!"});
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), authConfig.secret);
        req.userId = decoded.id;

        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(401).json({message: "Unauthorized!"});
        }

        next();
    } catch (err) {
        return res.status(401).json({message: "Unauthorized!"});
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();

        const adminRole = roles.find(role => role.name === "ADMIN");
        if (adminRole) {
            next();
            return;
        }

        res.status(403).json({message: "Require Admin Role!"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};