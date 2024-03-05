import User from "../models/User"
import jwt from "jsonwebtoken"
import config from "../config"
import Role from "../models/Role";

export const signUp = async (req, res) => {
    const { firstName, lastName, documentType, documentNumber, email, password, phone, roles } = req.body;

    const newUser = new User({
        firstName,
        lastName,
        documentType,
        documentNumber,
        email,
        password: await User.encryptPassword(password),
        phone
    })

    if(roles){
       const foundRoles = await Role.find({name: {$in: roles}})
       newUser.roles = foundRoles.map(role => role._id)
    }
    else{
        const role = await Role.findOne({name:"cliente"})
        newUser.roles = [role._id]
    }
    const saveUser = await newUser.save()

    const token = jwt.sign({id: saveUser._id},config.SECRET,{
        expiresIn: 86400 // 24 hors
    })
    res.status(200).json({token})
}

export const signIn = async (req, res) => {
  const userFound =  await User.findOne({email: req.body.email}).populate("roles")
  if(!userFound) return res.status(400).json({message: "User not found"})

 const matchPassword = await User.comparePassword(req.body.password,userFound.password)

 if(!matchPassword) return res.status(401).json({token: null, message: "Invalid password"})

const token = jwt.sign({id:userFound._id},config.SECRET,{
    expiresIn: 86400
})
  res.json({token})
}