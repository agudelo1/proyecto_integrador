import User from "../models/User"
import jwt from "jsonwebtoken"
import config from "../config"
import Role from "../models/Role";
import Restaurant from "../models/Restaurant";

export const signUp = async (req, res) => {
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

        // If a restaurant ID is provided, find it and assign it to the user
        if (restaurantId) {
            const restaurant = await Restaurant.findById(restaurantId);
            if (!restaurant) {
                return res.status(400).json({ message: "Restaurant not found" });
            }
            newUser.restaurant = restaurantId;
        }

        // Assign roles to the user
        if (roles) {
            const foundRoles = await Role.find({ name: { $in: roles } });
            newUser.roles = foundRoles.map(role => role._id);
        } else {
            const defaultRole = await Role.findOne({ name: "client" });
            newUser.roles = [defaultRole._id];
        }

        const savedUser = await newUser.save();

        // Return details of the registered user
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: savedUser._id,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
                roles: savedUser.roles
            }
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const signIn = async (req, res) => {
    try {
        const { email, password, restaurantId } = req.body;

        // Find the user by their email
        const userFound = await User.findOne({ email }).populate("roles");
        if (!userFound) {
            return res.status(400).json({ message: "User not found" });
        }

        // Check if the user has access to the restaurant they are trying to log in to
        if (restaurantId && userFound.restaurant !== restaurantId) {
            return res.status(403).json({ message: "User does not have access to this restaurant" });
        }

        // Compare the provided password with the one stored in the database
        const matchPassword = await User.comparePassword(password, userFound.password);
        if (!matchPassword) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        // Generate an access token
        const token = jwt.sign({ id: userFound._id }, config.SECRET, {
            expiresIn: 86400 // 24 hours
        });

        // Return the token and user details
        res.json({
            token,
            user: {
                id: userFound._id,
                firstName: userFound.firstName,
                lastName: userFound.lastName,
                email: userFound.email,
                roles: userFound.roles
            }
        });
    } catch (error) {
        console.error("Error signing in:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
