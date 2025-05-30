import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { io } from "../lib/socket.js";

export const getUsersForSidebar = async (req,res) => {
    try {
        const loggedUserId = req.user._id;
        const filteredUsers = await User.find({_id:{$ne:loggedUserId}}).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in loading users",error.message);
    }
}

export const getMessages = async (req,res) => {
    try {
        const loggedUserId = req.user._id;
        const anotherUserId = req.params.userId;

        const messages = await Message.find({
            $or:[
                {senderId:anotherUserId,recieverId:loggedUserId},
                {senderId:loggedUserId,recieverId:anotherUserId}
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getting messages:",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export const sendMessage = async (req,res) =>{
    try {
        const recieverId = req.params.id;
        const senderId = req.user._id;
        const {text,image} = req.body;

        let imageURL;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageURL=uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            text,
            image:imageURL
        });

        await newMessage.save();

        const recieverSocketId = getRecieverSocketId(recieverId);
        if(recieverSocketId){
            io.to(recieverSocketId).emit("newMessage",newMessage)
        }

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in sending message:",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const markSeen = async (req,res) => {
        const loggedUserId = req.user._id
        const anotherUserId = req.params.userId 
        await Message.updateMany(
            {recieverId:loggedUserId,senderId:anotherUserId,isSeen:false},
            { $set: {isSeen:true}}
        )
        const socketId=getRecieverSocketId(anotherUserId);
        if (socketId) {
            io.to(socketId).emit("messageSeen");
        }

        res.status(200).json({message:'marked as seen'})
}