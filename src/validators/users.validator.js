const {check} = require("express-validator")
const {validateResult} = require("../helpers/validateHelper")

const validateCreate = [
  check("firstName").exists().not().isEmpty(),

  check("lastName").exists().not().isEmpty(),

  check("documentType").exists().not().isEmpty(),

  check("documentNumber")
  .exists().withMessage("The document number is required")
  .not().isEmpty().withMessage("Document number cannot be empty").isLength({min: 7, max:11})
  .withMessage("The document number must be between 7 and 10 characters"),

  check("email").exists().isEmail(),
  
  check("password")
  .exists().withMessage("Password is required")
  .not().isEmpty().withMessage("The password cannot be empty")
  .isLength({ min: 8, max: 12 }).withMessage("Password must be between 8 and 12 characters")
  .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{:;'"<,>.?|]).{8,12}$/)
  .withMessage("The password must contain at least one capital letter, one number, and one special character"),

  (req,res,next) =>{
    validateResult(req,res,next)
  }

]

module.exports = {validateCreate}