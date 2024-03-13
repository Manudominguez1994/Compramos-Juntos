const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    name:{
      type: String,
      required: true,
    },
    imagen:{
      type: String,
      default: "public/profile-picture-default-png.png"
    },
    dateborn: {
      type: Date
    },
    ratio: {
      type: Number,
      default: 0,
      max: 5,
      min: 1
    },
    coordinates: [Number]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;