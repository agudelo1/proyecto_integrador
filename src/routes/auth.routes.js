import { Router} from "express"; 

const router = Router();

import * as authController from "../controllers/auth.controller"
import {verifySignup} from "../middleware"
import {validateCreate} from "../validators/users.validator"

router.post("/signup",validateCreate,[verifySignup.checkDuplicateUseremailordocumentNumber, verifySignup.checkRolesExisted],authController.signUp)
router.post("/signin",authController.signIn)

export default router;