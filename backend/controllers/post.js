import slugify from "slugify";
import { errorHandler } from "../utils/error.js";
import Post from "../models/post.js";
import Comment from "../models/comment.js";

const toSlug = (title) => slugify(title, { lower: true, strict: true, locale: "pl" });

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const oneMonthAgo = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
};

export const create = async (req, res, next) => {
  const { title, content, category, image } = req.body;
  const slug = toSlug(title);

  if (await Post.exists({ slug })) {
    return next(errorHandler(409, "DUPLICATE_TITLE", "A post with this title already exists."));
  }

  const savedPost = await Post.create({
    title,
    content,
    slug,
    author: req.user.id,
    ...(category && { category }),
    ...(image && { image }),
  });

  res.status(201).json({ success: true, post: savedPost });
};

export const getPosts = async (req, res) => {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = Math.min(parseInt(req.query.limit) || 9, 50);
  const sortDirection = req.query.order === "asc" ? 1 : -1;

  const filter = {
    ...(req.query.userId && { author: req.query.userId }),
    ...(req.query.category && req.query.category !== "uncategorized" && { category: req.query.category }),
    ...(req.query.slug && { slug: req.query.slug }),
    ...(req.query.postId && { _id: req.query.postId }),
    ...(req.query.searchTerm && {
      $or: [
        { title: { $regex: escapeRegex(req.query.searchTerm), $options: "i" } },
        { content: { $regex: escapeRegex(req.query.searchTerm), $options: "i" } },
      ],
    }),
  };

  const [posts, totalPosts, lastMonthPosts] = await Promise.all([
    Post.find(filter).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit),
    Post.countDocuments(filter),
    Post.countDocuments({ ...filter, createdAt: { $gte: oneMonthAgo() } }),
  ]);

  res.status(200).json({ posts, totalPosts, lastMonthPosts });
};

export const getCategories = async (req, res) => {
  const categories = await Post.distinct("category");
  res.status(200).json({ categories: categories.filter((c) => c && c !== "uncategorized").sort() });
};

export const deletePost = async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.postId);

  if (!post) {
    return next(errorHandler(404, "POST_NOT_FOUND", "Post not found."));
  }

  await Comment.deleteMany({ postId: post._id.toString() });
  res.status(200).json({ success: true });
};

export const editPost = async (req, res, next) => {
  const { title, content, category, image } = req.body;
  const slug = toSlug(title);

  if (await Post.exists({ slug, _id: { $ne: req.params.postId } })) {
    return next(errorHandler(409, "DUPLICATE_TITLE", "A post with this title already exists."));
  }

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.postId,
    { $set: { title, content, slug, category: category || "uncategorized", ...(image && { image }) } },
    { new: true, runValidators: true }
  );

  if (!updatedPost) {
    return next(errorHandler(404, "POST_NOT_FOUND", "Post not found."));
  }

  res.status(200).json({ success: true, post: updatedPost });
};
