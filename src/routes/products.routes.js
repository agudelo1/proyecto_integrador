import { Router} from "express";
const router = Router();

import * as productsController from "../controllers/products.controller"
import {authJwt} from "../middleware"



router.post("/", [authJwt.verifyToken , authJwt.isAdmin],productsController.createProduct)

router.get("/", productsController.getProduct)

router.get("/:productId", productsController.getProductById)

router.put("/:productId",[authJwt.verifyToken , authJwt.isAdmin], productsController.updateProductById)

router.delete("/:productId",[authJwt.verifyToken , authJwt.isAdmin], productsController.deleteProductById)

export default router;