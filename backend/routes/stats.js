import express from "express";
import { verifyToken, requireAdmin } from "../utils/checkUserAuthentication.js";
import { asyncHandler } from "../utils/error.js";
import { getStats } from "../controllers/stats.js";

const router = express.Router();

router.get("/", verifyToken, requireAdmin, asyncHandler(getStats));

export default router;
