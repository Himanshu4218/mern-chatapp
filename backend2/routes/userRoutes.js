import express from "express";
import {
  allUsers,
  loginUser,
  registerUser,
} from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.route("/login").post(loginUser);

export default router;
