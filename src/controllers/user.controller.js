import User from "../models/User";
import Restaurant from "../models/Restaurant";

export const createUser = async (req, res) => {
    try {
        const { firstName, lastName, documentType, documentNumber, email, password, phone, roles, restaurantId } = req.body;

        let newUser = new User({
            firstName,
            lastName,
            documentType,
            documentNumber,
            email,
            password: await User.encryptPassword(password),
            phone
        });

        // Si se proporcionó un restaurante, verifica su existencia y asígnalo al usuario
        if (restaurantId) {
            const restaurant = await Restaurant.findById(restaurantId);
            if (!restaurant) {
                return res.status(400).json({ message: "Restaurant not found" });
            }
            newUser.restaurant = restaurantId;
        }

        // Asigna roles al usuario
        if (roles) {
            const foundRoles = await Role.find({ name: { $in: roles } });
            newUser.roles = foundRoles.map(role => role._id);
        } else {
            const defaultRole = await Role.findOne({ name: "client" });
            newUser.roles = [defaultRole._id];
        }

        const savedUser = await newUser.save();

        // Devuelve detalles del usuario registrado
        res.status(201).json({
            message: "User created successfully",
            user: {
                id: savedUser._id,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
                roles: savedUser.roles
            }
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Function to get all active users associated with the authenticated user's restaurant
export const getAllActiveUsers = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId; // Assuming the restaurant ID is in the `user` object in the request

    const restaurantExists = await Restaurant.exists({ _id: restaurantId });
    if (!restaurantExists) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const activeUsers = await User.find({ restaurant: restaurantId, state: true });
    res.status(200).json(activeUsers);
  } catch (error) {
    console.error("Error fetching active users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to get a user by ID associated with the authenticated user's restaurant
export const getUserById = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId;

    const restaurantExists = await Restaurant.exists({ _id: restaurantId });
    if (!restaurantExists) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const user = await User.findOne({ _id: req.params.userId, restaurant: restaurantId, state: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to update a user by ID associated with the authenticated user's restaurant
export const updateUserById = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId;

    const restaurantExists = await Restaurant.exists({ _id: restaurantId });
    if (!restaurantExists) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const updatedUser = await User.findOneAndUpdate({ _id: req.params.userId, restaurant: restaurantId }, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to delete a user by ID associated with the authenticated user's restaurant
export const deleteUserById = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId;

    const restaurantExists = await Restaurant.exists({ _id: restaurantId });
    if (!restaurantExists) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.userId, restaurant: restaurantId },
      { state: req.body.state },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user status by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
