import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  createNotification,
  getAllNotification,
  removeNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.route("/").post(protect, createNotification);
router.route("/all").get(protect, getAllNotification);
router.route("/remove").delete(protect, removeNotification);

export default router;
