import express from "express";
import rateLimit from "express-rate-limit";
import { signup, signin, googleLogin, demoLogin, me, signout } from "../controllers/auth.js";
import { asyncHandler } from "../utils/error.js";
import { verifyToken } from "../utils/checkUserAuthentication.js";
import { validate, schemas } from "../utils/validate.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, statusCode: 429, code: "TOO_MANY_REQUESTS", message: "Too many attempts, try again later." },
});

router.post("/signup", authLimiter, validate(schemas.signup), asyncHandler(signup));
router.post("/signin", authLimiter, validate(schemas.signin), asyncHandler(signin));
router.post("/google", authLimiter, validate(schemas.google), asyncHandler(googleLogin));
router.post("/demo", authLimiter, asyncHandler(demoLogin));
router.get("/me", verifyToken, asyncHandler(me));
router.post("/signout", signout);

export default router;
