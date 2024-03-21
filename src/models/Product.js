import {Schema, model} from "mongoose"

const productSchema = new Schema({
   
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant", 
        required: true
    },
    name: {
        type: String,
        required: true
    },
    category: String,
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0 
    },
    imgURL: String,
    state: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true, 
    versionKey: false 
});

export default model("Product", productSchema)