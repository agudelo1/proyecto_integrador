import { Schema, model } from "mongoose";

export const ROLES = ["admin","client","domiciliary","dev"]

const roleSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true, 
        enum: ROLES 
    }
}, {
    versionKey: false
});

export default model("Role",roleSchema)