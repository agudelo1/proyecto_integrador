import Product from "../models/Product";
import Restaurant from "../models/Restaurant";

// Crea un nuevo producto
export const createProduct = async (req, res) => {
  try {
    const { name, category, description, price, imgURL, restaurant } = req.body;

    // Busca el restaurante por su nombre
    let restaurantIds = [];
    if (restaurant) {
      const foundRestaurants = await Restaurant.find({ _id: { $in: restaurant } });
      restaurantIds = foundRestaurants.map(restaurant => restaurant._id);
    }

    // Crea el nuevo producto
    const newProduct = new Product({
      name,
      category,
      description,
      price,
      imgURL,
      restaurant: restaurantIds
    });

    const productSave = await newProduct.save();

    res.status(201).json({
      id: productSave._id,
      name: productSave.name,
      category: productSave.category,
      price: productSave.price,
      imagen: productSave.imgURL,
      description: productSave.description,
      state: productSave.state,
      restaurant: productSave.restaurant
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Obtiene todos los productos activos
export const getProduct = async (req, res) => {
  try {
    const products = await Product.find({ state: true });
    const formattedProducts = products.map(product => ({
      id: product._id,
      name: product.name,
      category: product.category,
      price: product.price,
      imagen: product.imgURL,
      description: product.description,
      state: product.state,
      restaurant: product.restaurant
    }));
    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Obtiene un producto por su ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product || !product.state) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({
      id: product._id,
      name: product.name,
      category: product.category,
      price: product.price,
      imagen: product.imgURL,
      description: product.description,
      state: product.state,
      restaurant: product.restaurant
    });
  } catch (error) {
    console.error('Error getting product by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Actualiza un producto por su ID
export const updateProductById = async (req, res) => {
  try {
    const updateProduct = await Product.findByIdAndUpdate(req.params.productId, req.body, {
      new: true
    });

    if (!updateProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      id: updateProduct._id,
      name: updateProduct.name,
      category: updateProduct.category,
      price: updateProduct.price,
      imagen: updateProduct.imgURL,
      description: updateProduct.description,
      state: updateProduct.state,
      restaurant: updateProduct.restaurant
    });
  } catch (error) {
    console.error('Error updating product by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Elimina un producto por su ID
export const deleteProductById = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndUpdate(req.params.productId, { state: false }, {
      new: true
    });

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: "Product removed" });
  } catch (error) {
    console.error('Error deleting product by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
