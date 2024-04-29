import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

export const createNotification = asyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;
  if (!chatId || !userId) {
    res.status(400);
    throw new Error("Id is not defined");
  }
  try {
    var user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const notification = {
      from: userId,
      to: chatId,
    };

    user.notifications.push(notification);
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const getAllNotification = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("notifications.from", "name email pic")
      .populate("notifications.to")
      .sort({ createdAt: -1 });

    res.json(user.notifications);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const removeNotification = asyncHandler(async (req, res) => {
  const { chatId } = req.body;

  try {
    const user = await User.findById(req.user._id)
      .populate("notifications.from", "name email pic")
      .populate("notifications.to");

    user.notifications = user.notifications.filter(
      (n) => n.to._id.toString() !== chatId
    );
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
