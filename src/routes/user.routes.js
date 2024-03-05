import { Router} from "express";
import * as userController from "../controllers/user.controller"
import {authJwt, verifySignup} from "../middleware"

const router = Router();

router.post("/",[
    authJwt.verifyToken,
    authJwt.isAdmin,
    authJwt.isDev,
    verifySignup.checkRolesExisted
], userController.createUser)

export default router;