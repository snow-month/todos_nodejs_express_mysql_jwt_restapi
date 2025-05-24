import db from "../models/index.js";

const {ROLES, user: User} = db;

export const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try {
        const userByUsername = await User.findOne({
            where: {username: req.body.username},
        });
        if (userByUsername) {
            return res.status(400).json({message: 'Username already exist'});
        }

        const userByEmail = await User.findOne({
            where: {email: req.body.email},
        });
        if (userByEmail) {
            return res.status(400).json({message: 'Email already exist'});
        }

        next();
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

export const checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (const role of req.body.roles) {
            if (!ROLES.includes(role)) {
                return res.status(400).json({message: `Role ${role} does not exist!`});
            }
        }
    }

    next();
};