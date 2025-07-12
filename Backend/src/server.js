import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js"
import dotenv from "dotenv"
import {connectDB} from "./lib/db.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import { server,io,app } from "./lib/socket.js";

dotenv.config();

app.use(express.json({limit:'10mb'}));
app.use(cookieParser());
app.use(cors({
    origin:"https://chat-app-jet-alpha-84.vercel.app",
    credentials:true
}));
app.options("*", cors()); 

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);


server.listen(process.env.PORT || 3000,async () => {
    try {
        await connectDB();
        console.log(`Server is listening on port ${process.env.PORT}`);
    } catch (error) {
        console.error("Failed to connect to DB", error);
        process.exit(1); // Exit if DB connection fails
    }
});
