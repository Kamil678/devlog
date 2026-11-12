import express from "express";
import { verifyToken, requireAdmin, blockDemo } from "../utils/checkUserAuthentication.js";
import { asyncHandler } from "../utils/error.js";
import { validate, schemas } from "../utils/validate.js";
import {
  createComment,
  deleteComment,
  editComment,
  getAllComments,
  getComments,
  likeComment,
} from "../controllers/comment.js";

const router = express.Router();

router.post("/create", verifyToken, blockDemo, validate(schemas.comment), asyncHandler(createComment));
router.get("/getComments/:postId", asyncHandler(getComments));
router.get("/getComments", verifyToken, requireAdmin, asyncHandler(getAllComments));
router.put("/like/:commentId", verifyToken, blockDemo, asyncHandler(likeComment));
router.put("/edit/:commentId", verifyToken, blockDemo, validate(schemas.editComment), asyncHandler(editComment));
router.delete("/delete/:commentId", verifyToken, blockDemo, asyncHandler(deleteComment));

export default router;
