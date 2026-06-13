const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/user");
const ejsMate = require("ejs-mate");

const bcrypt = require("bcrypt");



app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.engine("ejs",ejsMate);
app.set("view engine","ejs") ;

mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("DB connected");
    })
    .catch(err=>{
        console.log("Db not connected")
    })




app.post("/auth/api/signup",async (req,res)=>{
    try{
        const {email , firstname , lastname, password} = req.body ;
        const user = await User.findOne({email});
        if(user){
            return res.send({
                message:"User already exists",
                sucess : false
            })
        }
    
        const hashedPass = bcrypt.hashSync(password, 10);
        const newUser = new User({email,firstname,lastname,password:hashedPass});
        await newUser.save();
        res.send({
                message:"User added",
                sucess : true
            });
    }catch(err){
        res.send({
            message:err.message,
            success:false
        })
    }
    


})















app.get("/form",(req,res)=>{
    res.render("test.ejs");
})



module.exports = app ;