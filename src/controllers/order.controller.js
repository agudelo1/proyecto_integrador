import User from "../models/User";
import Product from "../models/Product";
import Restaurant from "../models/Restaurant";
import Order from "../models/Order"
;

// Controlador para crear un nuevo pedido
export const createOrder = async (req, res) => {
    try {
      const { userId, restaurantId, deliveryPerson, products, totalPrice, status } = req.body;
  
      // Verificar si el usuario existe
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ message: "User does not exist" });
      }
  
      // Verificar si el restaurante existe
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res.status(400).json({ message: "The restaurant does not exist" });
      }
  
      // Verificar si los productos existen
      const productsNotFound = [];
      for (const { productId } of products) {
        const product = await Product.findById(productId);
        if (!product) {
          productsNotFound.push(productId);
        }
      }
      if (productsNotFound.length > 0) {
        return res.status(400).json({ message: `The following products do not exist: ${productsNotFound.join(", ")}` });
      }
  
      // Asociar IDs de productos al pedido
      const productItems = products.map(({ productId, quantity }) => ({ product: productId, quantity }));
  
      // Crear el nuevo pedido
      const newOrder = new Order({
        user: userId,
        restaurant: restaurantId,
        deliveryPerson,
        products: productItems,
        totalPrice,
        status
      });
  
      // Guardar el pedido en la base de datos
      const savedOrder = await newOrder.save();
      res.status(201).json(savedOrder);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

// Controlador para obtener todos los pedidos
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controlador para obtener un pedido por su ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error getting the order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controlador para actualizar un pedido
export const updateOrderStatusById = async (req, res) => {
    try {
      const { status } = req.body;
  
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.orderId,
        { status },
        { new: true }
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


export const cancelOrderById = async (req, res) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(req.params.orderId, { status: "cancelled" }, { new: true });
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json({ message: "Order canceled successfully" });
    } catch (error) {
      console.error("Error canceling order:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


