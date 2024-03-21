const { Schema, model } = require("mongoose");

const groupSchema = new Schema(
    {
      liderUser:{
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true
      },
      users:[{
        type: Schema.Types.ObjectId,
        ref: "User",
      }],
      product: {
        type: String,
        require: true
      },
      categorie:{
        type: String,
        require: true
      },
      quantity:{
        type: Number
      },
      status:{
        type: Boolean,
        default: true
      },
      date:{
        type: String
      },
      hour:{
        type: String
      },
      chat:[],
      coordinates: [Number]
    },
    {  
      timestamps: true
    }
  );

const Group = model("Group", groupSchema);
module.exports = Group;