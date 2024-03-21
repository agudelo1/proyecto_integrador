import Restaurant from "../models/Restaurant";
import User from "../models/User";

export const createRestaurant = async (req, res) => {
    const { name, documentType, documentNumber, phone, address, schedule, imgURL, users } = req.body;

    try {
        // Crear un nuevo restaurante con los datos proporcionados
        const newRestaurant = new Restaurant({
            name,
            documentType,
            documentNumber,
            phone,
            address,
            schedule,
            imgURL
        });

        // Buscar y asignar usuarios al restaurante
        if (users) {
            const foundUsers = await User.find({ documentNumber: { $in: users } });
            newRestaurant.users = foundUsers.map(user => user._id);
        }

        // Guardar el restaurante en la base de datos
        const savedRestaurant = await newRestaurant.save();

        // Responder con los datos del restaurante creado
        res.status(201).json(savedRestaurant);

    } catch (error) {
        console.error('Error creating restaurant:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const getRestaurant = async (req, res) => {
    try {
        // Obtener todos los restaurantes activos
        const restaurants = await Restaurant.find({ state: true });

        // Responder con los datos de los restaurantes
        res.status(200).json(restaurants);
        
    } catch (error) {
        console.error('Error getting restaurants:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const getRestaurantById = async (req, res) => {
    try {
        // Buscar el restaurante por su ID
        const restaurant = await Restaurant.findById(req.params.restaurantId);

        // Comprobar si el restaurante existe y está activo
        if (!restaurant || !restaurant.state) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Responder con los datos del restaurante encontrado
        res.status(200).json(restaurant);
        
    } catch (error) {
        console.error('Error getting restaurant by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const updateRestaurantById = async (req, res) => {
    const { users, ...restaurantData } = req.body;

    try {
        // Actualizar el restaurante por su ID
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.restaurantId, restaurantData, {
            new: true
        });

        // Responder con los datos del restaurante actualizado
        res.status(200).json(updatedRestaurant);
        
    } catch (error) {
        console.error('Error updating restaurant by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const deleteRestaurantById = async (req, res) => {
    try {
        // Desactivar el restaurante por su ID
        const deletedRestaurant = await Restaurant.findByIdAndUpdate(req.params.restaurantId, { state: false }, {
            new: true
        });

        // Responder con un mensaje de éxito
        res.status(200).json({ message: "Restaurant removed" });
        
    } catch (error) {
        console.error('Error deleting restaurant by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
