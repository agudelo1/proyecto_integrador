import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  documentType: {
    type: String,
    enum: ['CC', 'TI', 'NIT', 'PASAPORTE'],
    default: 'CC'
  },      
  documentNumber: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
  },
  roles: [{
    type: Schema.Types.ObjectId,
    ref: "Role"
  }],
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant"
  }, 
  state: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

userSchema.statics.comparePassword = async (password, recivedPassword) => {
  return await bcrypt.compare(password, recivedPassword);
};

export default model("User", userSchema);
