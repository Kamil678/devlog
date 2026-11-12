import { errorHandler } from "../utils/error.js";
import Comment from "../models/comment.js";
import Post from "../models/post.js";

const oneMonthAgo = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
};

const findComment = async (commentId, next) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    next(errorHandler(404, "COMMENT_NOT_FOUND", "Comment not found."));
  }
  return comment;
};

export const createComment = async (req, res, next) => {
  const { content, postId } = req.body;

  if (!(await Post.exists({ _id: postId }))) {
    return next(errorHandler(404, "POST_NOT_FOUND", "Post not found."));
  }

  const savedComment = await Comment.create({ content, postId, userId: req.user.id });

  res.status(201).json({ success: true, comment: savedComment });
};

export const getComments = async (req, res) => {
  const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });

  res.status(200).json({ success: true, comments });
};

export const getAllComments = async (req, res) => {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = Math.min(parseInt(req.query.limit) || 9, 50);
  const sortDirection = req.query.order === "asc" ? 1 : -1;

  const [comments, totalComments, lastMonthComments] = await Promise.all([
    Comment.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit),
    Comment.countDocuments(),
    Comment.countDocuments({ createdAt: { $gte: oneMonthAgo() } }),
  ]);

  res.status(200).json({ success: true, comments, totalComments, lastMonthComments });
};

export const likeComment = async (req, res, next) => {
  const comment = await findComment(req.params.commentId, next);
  if (!comment) return;

  const userIndex = comment.likes.indexOf(req.user.id);
  if (userIndex === -1) {
    comment.likes.push(req.user.id);
  } else {
    comment.likes.splice(userIndex, 1);
  }
  comment.numberOfLikes = comment.likes.length;

  await comment.save();
  res.status(200).json(comment);
};

export const editComment = async (req, res, next) => {
  const comment = await findComment(req.params.commentId, next);
  if (!comment) return;

  if (comment.userId !== req.user.id && !req.user.isAdmin) {
    return next(errorHandler(403, "FORBIDDEN", "You are not allowed to edit this comment."));
  }

  comment.content = req.body.content;
  await comment.save();

  res.status(200).json(comment);
};

export const deleteComment = async (req, res, next) => {
  const comment = await findComment(req.params.commentId, next);
  if (!comment) return;

  if (comment.userId !== req.user.id && !req.user.isAdmin) {
    return next(errorHandler(403, "FORBIDDEN", "You are not allowed to delete this comment."));
  }

  await comment.deleteOne();
  res.status(200).json({ success: true });
};
