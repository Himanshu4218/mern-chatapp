import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  addUser,
  createChat,
  createGroupChat,
  fetchChats,
  removeUser,
  renameGroup,
} from "../controllers/chatController.js";

const router = express.Router();

router.route("/").post(protect, createChat).get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/group/rename").put(protect, renameGroup);
router.route("/group/add").put(protect, addUser);
router.route("/group/remove").put(protect, removeUser);

export default router;
