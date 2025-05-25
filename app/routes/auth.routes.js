import {Router} from "express";
import {refreshToken, signin, signup} from "../controllers/auth.controller.js";
import {checkDuplicateUsernameOrEmail, checkRolesExisted} from "../middlewares/index.js";

const router = Router();

router.post("/signup", [checkDuplicateUsernameOrEmail, checkRolesExisted], signup);
router.post("/signin", signin);
router.post("/refreshtoken", refreshToken);

export default router;