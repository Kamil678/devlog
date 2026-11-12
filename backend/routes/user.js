import express from "express";
import { updateUser, deleteUser, getUsers, getUser } from "../controllers/user.js";
import { verifyToken, requireAdmin, blockDemo } from "../utils/checkUserAuthentication.js";
import { asyncHandler } from "../utils/error.js";
import { validate, schemas } from "../utils/validate.js";

const router = express.Router();

router.put("/update/:userId", verifyToken, blockDemo, validate(schemas.updateUser), asyncHandler(updateUser));
router.delete("/delete/:userId", verifyToken, blockDemo, asyncHandler(deleteUser));
router.get("/getusers", verifyToken, requireAdmin, asyncHandler(getUsers));
router.get("/:userId", asyncHandler(getUser));

export default router;
