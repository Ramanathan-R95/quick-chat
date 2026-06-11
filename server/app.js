const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("DB connected");
    })
    .catch(err=>{
        console.log("Db not connected")
    })


module.exports = app ;