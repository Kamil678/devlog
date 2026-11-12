import express from "express";
import { verifyToken, requireAdmin, blockDemo } from "../utils/checkUserAuthentication.js";
import { asyncHandler } from "../utils/error.js";
import { validate, schemas } from "../utils/validate.js";
import { create, getPosts, getCategories, deletePost, editPost } from "../controllers/post.js";

const router = express.Router();

const adminWrite = [verifyToken, requireAdmin, blockDemo];

router.post("/create", adminWrite, validate(schemas.post), asyncHandler(create));
router.get("/getposts", asyncHandler(getPosts));
router.get("/categories", asyncHandler(getCategories));
router.delete("/delete/:postId", adminWrite, asyncHandler(deletePost));
router.put("/edit/:postId", adminWrite, validate(schemas.post), asyncHandler(editPost));

export default router;
