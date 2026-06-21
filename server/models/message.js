const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    chatId :{
        type:Schema.Types.ObjectId,
        ref:"chats"
    },
    senderId:{
        type:Schema.Types.ObjectId,
        ref:"users"
    },
    read:{
        type:Boolean,
        default:false
    },
    text:{
        type:String,
        required:true
    }

});
module.exports = mongoose.model("Message",messageSchema);