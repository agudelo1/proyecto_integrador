import { Router } from "express";
 
const router = Router()

import * as restaurantsController from "../controllers/restaurant.controller"
import { authJwt } from "../middleware";


router.post("/", [authJwt.verifyToken , authJwt.isAdmin],restaurantsController.createRestaurant)

router.get("/",authJwt.verifyToken, restaurantsController.getRestaurant)

router.get("/:restaurantId",authJwt.verifyToken, restaurantsController.getRestaurantById)

router.put("/:restaurantId",[authJwt.verifyToken, authJwt.isAdmin], restaurantsController.updateRestaurantById)

router.delete("/:restaurantId",[authJwt.verifyToken , authJwt.isAdmin], restaurantsController.deleteRestaurantById)

export default router;