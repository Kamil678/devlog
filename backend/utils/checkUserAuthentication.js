import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

const TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

export const issueToken = (res, user) => {
  const token = jwt.sign({ id: user._id.toString(), isAdmin: user.isAdmin, isDemo: user.isDemo }, process.env.JWT_SECRET, {
    expiresIn: TOKEN_TTL_SECONDS,
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: TOKEN_TTL_SECONDS * 1000,
  });
};

export const clearToken = (res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(errorHandler(401, "UNAUTHORIZED", "User is unauthorized."));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, "UNAUTHORIZED", "User is unauthorized."));
    }

    req.user = user;
    next();
  });
};

export const requireAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return next(errorHandler(403, "FORBIDDEN", "Admin access required."));
  }
  next();
};

export const blockDemo = (req, res, next) => {
  if (req.user?.isDemo) {
    return next(errorHandler(403, "DEMO_READ_ONLY", "The demo account is read-only."));
  }
  next();
};
