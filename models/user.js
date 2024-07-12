const mongoose= require("mongoose");

const UserSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    address:String,
    latitude:String,
    longitude:String,
    token:String,
    status:{
        type:String,
        default:'active',
        enum:["active","inactive"],
    }
},{
    timestamps:true
});

const User = mongoose.model("User",UserSchema);

module.exports = User;