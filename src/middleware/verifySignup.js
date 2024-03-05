import { ROLES } from "../models/Role"
import User from "../models/User"

export const checkDuplicateUseremailordocumentNumber = async(req,res,next)=>{

const documentNumber = await User.findOne({documentNumber: req.body.documentNumber})

if(documentNumber) return res.status(400).json({message: "The edocument number already exist"})

const email  =  await  User.findOne({email: req.body.email})

if(email) return res.status(400).json({message: "The email already exist"})

next()

}

export const checkRolesExisted = (req,res,next)=>{
    if(req.body.roles){
        for(let i=0; i< req.body.roles.length; i++){
            if(!ROLES.includes(req.body.roles[i])){
                return res.status(400).json({message: ` Role ${req.body.roles[i]} does not exist` 
             })
            }
        }
    }
    next()
}
