import { Router } from "express";
import * as userController from "../controllers/user.controller"
import { authJwt, verifySignup } from "../middleware"

const router = Router();

router.post("/", [
    authJwt.verifyToken,
    authJwt.isAdmin,
    authJwt.isDev,
    verifySignup.checkRolesExisted
], userController.createUser)

router.get("/", [
    authJwt.verifyToken,
    authJwt.isAdmin,
    authJwt.isDev,
    verifySignup.checkRolesExisted
], userController.getAllActiveUsers)

router.get("/:userId", [
    authJwt.verifyToken,
    authJwt.isAdmin,
    authJwt.isDev,
    verifySignup.checkRolesExisted
], userController.getUserById);

router.put("/:userId", [
    authJwt.verifyToken,
    authJwt.isAdmin,
    authJwt.isDev,
    verifySignup.checkRolesExisted
], userController.updateUserById);

router.delete("/:userId", [
    authJwt.verifyToken,
    authJwt.isAdmin,
    authJwt.isDev,
    verifySignup.checkRolesExisted
], userController.deleteUserById);


export default router;