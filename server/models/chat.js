const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chatSchema = new Schema({
    members :{
        type:[{
            type:Schema.Types.ObjectId,
            ref:"users"

        }]
    },
    lastMessage:{
        type: Schema.Types.ObjectId,
        ref:"messages"
    },
    unreadMsgCount:{
        type: Number,
        default:0
    }
},{timestamps:true});


module.exports = mongoose.model("Chat",chatSchema);