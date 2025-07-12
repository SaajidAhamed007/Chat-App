import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage,markSeen } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users",getUsersForSidebar)

router.get("/:userId",getMessages)

router.post("/send/:id",sendMessage)

router.put("/:userId",markSeen)
export default router;
