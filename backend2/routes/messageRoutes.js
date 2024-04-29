import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  allMessages,
  createMessage,
} from "../controllers/messageController.js";

const router = express.Router();

router.route("/").post(protect, createMessage);
router.route("/:chatId").get(protect, allMessages);
export default router;
