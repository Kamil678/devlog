import Post from "../models/post.js";
import Comment from "../models/comment.js";
import User from "../models/user.js";

const MONTHS = 6;

const monthlyCounts = async (Model, since) => {
  const rows = await Model.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } },
  ]);
  return Object.fromEntries(rows.map((row) => [row._id, row.count]));
};

export const getStats = async (req, res) => {
  const now = new Date();
  const since = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (MONTHS - 1), 1));
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

  const [totals, recent, posts, comments, users] = await Promise.all([
    Promise.all([Post.countDocuments(), Comment.countDocuments(), User.countDocuments()]),
    Promise.all([
      Post.countDocuments({ createdAt: { $gte: lastMonth } }),
      Comment.countDocuments({ createdAt: { $gte: lastMonth } }),
      User.countDocuments({ createdAt: { $gte: lastMonth } }),
    ]),
    monthlyCounts(Post, since),
    monthlyCounts(Comment, since),
    monthlyCounts(User, since),
  ]);

  const months = Array.from({ length: MONTHS }, (_, i) => {
    const date = new Date(Date.UTC(since.getUTCFullYear(), since.getUTCMonth() + i, 1));
    const key = date.toISOString().slice(0, 7);
    return { month: key, posts: posts[key] || 0, comments: comments[key] || 0, users: users[key] || 0 };
  });

  res.status(200).json({
    totals: { posts: totals[0], comments: totals[1], users: totals[2] },
    lastMonth: { posts: recent[0], comments: recent[1], users: recent[2] },
    months,
  });
};
