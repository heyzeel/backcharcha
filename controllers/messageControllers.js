const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const sendMessage = async(req, res)=>{
    const {content, chatId} = req.body;

    if(!content || !chatId){
        console.log("invalid data");
        return res.status(400);
    }

    let newMessage = {
        sender:req.user._id,
        content:content,
        chat:chatId
    }

    try {
        let message = await Message.create(newMessage);

        message = await message.populate('sender','name pic ');
        message = await message.populate('chat')
        message = await User.populate(message,{
            path:'chat.users',
            select : 'name pic email'
        });

        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage : message
        })

        res.json(message)

    } catch (error) {
        console.log(error)
    }
}

const allMessage = async(req, res)=>{
    const chatId =  req.params.chatId

    try {
        const messages = await Message.find({"chat": chatId})
        .populate('sender','name pic email')
        .populate('chat')

        res.json(messages)
    } catch (error) {
        res.status(400)
    }
}

module.exports = {sendMessage, allMessage}