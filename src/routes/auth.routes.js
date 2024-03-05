import { Router} from "express"; 

const router = Router();

import * as authController from "../controllers/auth.controller"
import {verifySignup} from "../middleware"

router.post("/signup",[verifySignup.checkDuplicateUseremailordocumentNumber, verifySignup.checkRolesExisted],authController.signUp)
router.post("/signin",authController.signIn)

export default router;