const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/user");
const ejsMate = require("ejs-mate");
const jwt = require("jsonwebtoken");
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
app.post("/auth/api/login", async (req,res)=>{
    const {email , password} = req.body;
    if(!email || !password){
        res.send({
            message:"Email and Password are required field",
            success:false
        });
    }
    
    const user = await User.findOne({email});
    if(!user){
        res.send({
            message:"User does not exists",
            success:false
        });
    }
    const match = await bcrypt.compare(password, user.password);
    if(!match){
        res.send({
            message : "Invalid Data",
            success : false
        })
    }
    const token = jwt.sign({userId:user._id},process.env.SECRET,{expiresIn:"1d"});
    res.send({
        message:"User is logged In",
        success : true
    })



})














app.get("/form",(req,res)=>{
    res.render("test.ejs");
})



module.exports = app ;