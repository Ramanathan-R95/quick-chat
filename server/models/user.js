const mongoose = require("mongoose");

const userSchema =new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    profilePic:{
        type:String,
       
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        minlength:8,
        
    }

},{timestamps:true});

const User = mongoose.model("users",userSchema);

module.exports = User;

