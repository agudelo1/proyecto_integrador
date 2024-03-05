import Product from "../models/Product"

export const createProduct = async (req,res)=>{
 const {name, category , price , imgURL} = req.body

const newProducts = new Product({
    name,
    category,
    price,
    imgURL
 })
 const productSave = await newProducts.save()

 res.status(201).json(productSave)
}

export const getProduct = async (req,res)=>{
 const products =   await Product.find()
 res.status(200).json(products)
}

export const getProductById = async(req,res)=>{
   const product = await  Product.findById(req.params.productId)
   res.status(200).json(product) 
}

export const updateProductById = async(req,res)=>{
  const updateProduct =  await Product.findByIdAndUpdate(req.params.productId, req.body, {
    new: true
  })

  res.status(200).json(updateProduct)
    
}

export const deleteProductById = (req,res)=>{
    
}