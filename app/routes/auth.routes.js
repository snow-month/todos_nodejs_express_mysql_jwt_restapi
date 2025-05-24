import {Router} from "express";
import {signin, signup} from "../controllers/auth.controller.js";
import {checkDuplicateUsernameOrEmail, checkRolesExisted} from "../middlewares/index.js";

const router = Router();

router.post("/signup", [checkDuplicateUsernameOrEmail, checkRolesExisted], signup);
router.post("/signin", signin);

export default router;