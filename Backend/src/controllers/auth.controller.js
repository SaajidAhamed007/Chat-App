import bcrypt from "bcryptjs"
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req,res) => {
    const {fullName,email,password}=req.body;
    try {

        if(!fullName || !email || !password){
            return res.status(400).json({message:"All fields are required!"})
        }

        if(password.length<6){
            return res.status(400).json({message:"Password must be atleast 6 characters"})
        }

        const user=await User.findOne({email})

        if (user) return res.status(400).json({message:"Email already exists"})

        const salt = await bcrypt.genSalt(10);
        const hashedpassword= await bcrypt.hash(password,salt);

        const newUser = new User({
            fullName,
            email,
            password:hashedpassword
        })

        if (newUser) {
            await newUser.save();
            generateToken(newUser._id,res)

            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilepic:newUser.profilepic
            });
        } else {
            res.status(400).json({message:"Invalid User data"});
        }


    } catch (error) {
        console.log("Error in signup",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const login = async (req,res) => {
    const {email,password}=req.body;

    try {
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        const user=await User.findOne({email});

        if(!user){
            return res.status(400).json({message:"Invalid credentials"})
        }

        const result = await bcrypt.compare(password,user.password);
        if(!result){
            return res.status(400).json({message:"Invalid credentials"})
        }

        const token = generateToken(user._id);

        return res.status(200).json({ 
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilepic:user.profilepic })

    } catch (error) {
        console.log("Error in login controller",error.message);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

export const logout=(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const updateProfile = async (req,res) => {
    
    try {
        const {profilepic} = req.body;
        const userId = req.user._id;

        if(!profilepic){
            return res.status(400).json({message:"profile pic is required"})
        }

        const uploadResponse = await cloudinary.uploader.upload(profilepic)
        const updatedUser = await User.findByIdAndUpdate(userId,{profilepic:uploadResponse.secure_url},{new:true})

        res.status(200).json({updatedUser});
    } catch (error) {
        console.log("Error in uploading profile:",error.message);
        return res.status(500).json({message:"Internal Server Error"})
    }

}

export const checkAuth = (req,res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checking auth:",error.message);
        return res.status(500).json({message:"Internal Server Error"});
    }
}
