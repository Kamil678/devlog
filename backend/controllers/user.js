import bcryptjs from "bcryptjs";
import User from "../models/user.js";
import Comment from "../models/comment.js";
import { errorHandler } from "../utils/error.js";
import { clearToken } from "../utils/checkUserAuthentication.js";

const withoutPassword = (user) => {
  const { password, ...rest } = user._doc;
  return rest;
};

const maskEmail = (email) => email.replace(/^(.).*(@.*)$/, "$1***$2");

const oneMonthAgo = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "FORBIDDEN", "You are not allowed to update this user."));
  }

  const update = { ...req.body };
  if (update.password) {
    update.password = await bcryptjs.hash(update.password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.userId, { $set: update }, { new: true });

  if (!updatedUser) {
    return next(errorHandler(404, "USER_NOT_FOUND", "User not found."));
  }

  res.status(200).json(withoutPassword(updatedUser));
};

export const deleteUser = async (req, res, next) => {
  const isSelf = req.user.id === req.params.userId;

  if (!req.user.isAdmin && !isSelf) {
    return next(errorHandler(403, "FORBIDDEN", "You are not allowed to delete this user."));
  }

  const user = await User.findByIdAndDelete(req.params.userId);

  if (!user) {
    return next(errorHandler(404, "USER_NOT_FOUND", "User not found."));
  }

  await Comment.deleteMany({ userId: req.params.userId });

  if (isSelf) {
    clearToken(res);
  }

  res.status(200).json({ success: true });
};

export const getUsers = async (req, res) => {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = Math.min(parseInt(req.query.limit) || 9, 50);
  const sortDirection = req.query.sort === "asc" ? 1 : -1;

  const [users, totalUsers, lastMonthUsers] = await Promise.all([
    User.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit),
    User.countDocuments(),
    User.countDocuments({ createdAt: { $gte: oneMonthAgo() } }),
  ]);

  res.status(200).json({
    users: users.map((user) => {
      const rest = withoutPassword(user);
      return req.user.isDemo ? { ...rest, email: maskEmail(rest.email) } : rest;
    }),
    totalUsers,
    lastMonthUsers,
  });
};

export const getUser = async (req, res, next) => {
  const user = await User.findById(req.params.userId).select("username picture isAdmin createdAt");

  if (!user) {
    return next(errorHandler(404, "USER_NOT_FOUND", "User not found."));
  }

  res.status(200).json(user);
};
