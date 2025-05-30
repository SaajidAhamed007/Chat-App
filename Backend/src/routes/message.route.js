import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage,markSeen } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users",protectRoute,getUsersForSidebar)

router.get("/:userId",protectRoute,getMessages)

router.post("/send/:id",protectRoute,sendMessage)

router.put("/:userId",protectRoute,markSeen)
export default router;