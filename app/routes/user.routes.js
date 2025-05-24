import {Router} from "express";
import {adminBoard, allAccess, userBoard} from "../controllers/user.controller.js"
import {isAdmin, verifyToken} from "../middlewares/index.js"

const router = Router();

router.get("/all", allAccess);
router.get("/user", [verifyToken], userBoard);
router.get("/admin", [verifyToken, isAdmin], adminBoard);

export default router;