import { Schema, model } from "mongoose";

export const ROLES = ["admin","client","domiciliary","dev"]

const roleSchema = new Schema({
    name: String
},{
    versionKey: false
})

export default model("Role",roleSchema)