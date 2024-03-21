import express from "express";
const router = express.Router();

import * as orderController from "../controllers/orderController";
import {authJwt} from "../middleware"


// Ruta para crear un nuevo pedido
router.post("/",[authJwt.verifyToken , authJwt.isAdmin],orderController.createOrder);

// Ruta para obtener todos los pedidos
router.get("/",authJwt.verifyToken, orderController.getAllOrders);

// Ruta para obtener un pedido por su ID
router.get("/:orderId",authJwt.verifyToken,orderController.getOrderById);

// Ruta para actualizar un pedido por su ID
router.put("/:orderId",authJwt.verifyToken, orderController.updateOrderById);

// Ruta para cancelar un pedido por su ID
router.put("/:orderId/cancel",authJwt.verifyToken,orderController.cancelOrderById);

export default router;
