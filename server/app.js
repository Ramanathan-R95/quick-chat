const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/user");
const ejsMate = require("ejs-mate");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authMiddleware = require("./middleware/authMiddleware");
const Chat = require("./models/chat");
const Message = require("./models/message");

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

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




app.post("/api/auth/signup",async (req,res)=>{
    try{
        const {email , firstname , lastname, password} = req.body ;
        const user = await User.findOne({email});
        if(user){
            return res.status(400).send({
                message:"User already exists",
                sucess : false
            })
        }
    
        const hashedPass = bcrypt.hashSync(password, 10);
        const newUser = new User({email,firstname,lastname,password:hashedPass});
        await newUser.save();
        res.status(201).send({
                message:"User added",
                sucess : true
            });
    }catch(err){
        res.status(400).send({
            message:err.message,
            success:false
        })
    }
    


})
app.post("/api/auth/login", async (req,res)=>{
    const {email , password} = req.body;
    if(!email || !password){
        return res.send({
            message:"Email and Password are required field",
            success:false
        });
    }
    
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).send({
            message:"User does not exists",
            success:false
        });
    }

  
    const match = await bcrypt.compare(password, user.password);
    if(!match){
        return res.status(400).send({
            message : "Invalid Data",
            success : false
        })
    }
    const token = jwt.sign({userId:user._id},process.env.SECRET,{expiresIn:"20d"});
    res.send({
        message:"User is logged In",
        success : true,
        token
    })



})

app.get("/api/user/get-logged-in-user", authMiddleware, async (req,res)=>{

    try{
        const user = await User.findOne({_id:req.userId});
        res.send(user);


    }catch(err){
        res.status(400).send({
                message:err.message,
                success:false
            })
    }
})

app.get("/api/user/get-all-users", authMiddleware , async (req,res) => {
    try{

        const users = await User.find({_id:{$ne:req.userId}});
        return res.send({
            message:"fetched all users",
            data:users,
            success:true
        });

    }catch(err){
        res.status(400).send({
            message:err.message,
            success:false
        })

    }
});

app.post("/api/chat/new-chat",authMiddleware, async (req,res)=>{
    try{
        
        const chat = new Chat(req.body);
        await chat.save();
        return res.status(201).send({
            message:"Chat created successfully",
            success:true,
            data:chat
        });

    }catch(err){
        res.status(400).send({
            message:err.message,
            success:false
        })
    }

})

app.get("/api/chat/all-chats",authMiddleware,async (req,res)=>{
    try{
        const chats = await Chat.find({members:{$in:req.userId}});
        res.status(200).send({
            message:"All chats retrieved",
            success:true,
            data:chats

        });


    }catch(err){
        res.status(400).send({
            message:err.message,
            success:false
        })

    }


})



app.post("/api/msg/new-msg",authMiddleware,async (req,res)=>{
    try{
        const msg = new  Message(req.body);
        await msg.save();
        await Chat.findByIdAndUpdate(msg.chatId,{
            lastMessage:msg._id,
            $inc:{unreadMsgCount:1}
        })

        res.status(201).send({
            message:"Message sent successfully",
            success:true,
            data:msg
        });


    }catch(err){
        res.status(400).send({
            message:err.message,
            success:false
        })
    }
});

app.get("/api/msg/all-msgs/:chatId",authMiddleware,async (req,res)=>{
    try{     
        const msgs = await Message.find({chatId:req.params.chatId}).sort({createdAt:1});
        res.status(200).send({
            message:"Fetched all messages",
            success:true,
            data:msgs
        });
    }catch(err){
        res.status(400).send({
            message:err.message,
            success:false
        });
    }



});
















app.get("/form",(req,res)=>{
    res.render("test.ejs");
})



module.exports = app ;
