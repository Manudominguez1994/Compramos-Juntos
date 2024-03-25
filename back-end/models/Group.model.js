const { Schema, model } = require("mongoose");

const groupSchema = new Schema({
      name:{
      type:String
    },
      liderUser:{
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true
      },
      users:[{
        type: Schema.Types.ObjectId,
        ref: "User",
      }],
      products: [{
        type: Schema.Types.ObjectId,
        ref: "Product",
      }],
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