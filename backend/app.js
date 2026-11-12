import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/post.js";
import commentRoutes from "./routes/comment.js";
import statsRoutes from "./routes/stats.js";
import { errorMiddleware, notFound } from "./utils/error.js";

export const createApp = () => {
  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  app.get("/api/health", (req, res) => res.json({ status: "ok" }));
  app.use("/api/user", userRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/post", postRoutes);
  app.use("/api/comment", commentRoutes);
  app.use("/api/stats", statsRoutes);

  app.use("/api", notFound);
  app.use(errorMiddleware);

  return app;
};
