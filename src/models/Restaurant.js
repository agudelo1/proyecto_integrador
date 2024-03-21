import {Schema, model} from "mongoose"

const restaurantSchema = new Schema({
  // Los usuarios asociados a este restaurante
  users: [{
      type: Schema.Types.ObjectId,
      ref: "User" // Referencia al modelo User
  }],
  name: {
      type: String,
      required: true
  },
  documentType: {
      type: String,
      enum: ['CC', 'NIT'], // Limita el tipo de documento a 'CC' o 'NIT'
      default: 'CC'
  },
  documentNumber: {
      type: String,
      unique: true // Garantiza que el número de documento sea único en la base de datos
  },
  phone: {
      type: String,
      required: true
  },
  address: {
      type: String,
      required: true
  },
  schedule: String,
  imgURL: String,
  state: {
      type: Boolean,
      default: true
  }
}, {
  timestamps: true,
  versionKey: false
});


export default model("Restaurant", restaurantSchema)