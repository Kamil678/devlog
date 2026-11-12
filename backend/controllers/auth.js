import crypto from "crypto";
import User from "../models/user.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import { issueToken, clearToken } from "../utils/checkUserAuthentication.js";
import { verifyGoogleIdToken } from "../utils/firebase.js";

const withoutPassword = (user) => {
  const { password, ...rest } = user._doc;
  return rest;
};

export const signup = async (req, res) => {
  const { email, username, password } = req.body;

  const hashPassword = await bcryptjs.hash(password, 10);
  const newUser = await User.create({ email, username, password: hashPassword });

  issueToken(res, newUser);
  res.status(201).json(withoutPassword(newUser));
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  const passwordMatches = user && (await bcryptjs.compare(password, user.password));

  if (!passwordMatches) {
    return next(errorHandler(401, "INVALID_CREDENTIALS", "Invalid email or password."));
  }

  issueToken(res, user);
  res.status(200).json(withoutPassword(user));
};

const uniqueUsername = async (base) => {
  const cleaned =
    (base || "user")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 20) || "user";
  let candidate = cleaned;
  while (await User.exists({ username: candidate })) {
    candidate = `${cleaned}${crypto.randomInt(1000, 9999)}`;
  }
  return candidate;
};

export const googleLogin = async (req, res, next) => {
  let decoded;
  try {
    decoded = await verifyGoogleIdToken(req.body.idToken);
  } catch {
    return next(errorHandler(401, "INVALID_GOOGLE_TOKEN", "Google token could not be verified."));
  }

  const { email, name, picture } = decoded;
  let user = await User.findOne({ email });

  if (!user) {
    const randomPassword = crypto.randomBytes(24).toString("hex");
    user = await User.create({
      email,
      username: await uniqueUsername(name || email.split("@")[0]),
      password: await bcryptjs.hash(randomPassword, 10),
      ...(picture && { picture }),
    });
  }

  issueToken(res, user);
  res.status(200).json(withoutPassword(user));
};

export const demoLogin = async (req, res, next) => {
  const user = await User.findOne({ isDemo: true });

  if (!user) {
    return next(errorHandler(404, "DEMO_UNAVAILABLE", "Demo account is not configured."));
  }

  issueToken(res, user);
  res.status(200).json(withoutPassword(user));
};

export const me = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    clearToken(res);
    return next(errorHandler(401, "UNAUTHORIZED", "User no longer exists."));
  }

  res.status(200).json(withoutPassword(user));
};

export const signout = (req, res) => {
  clearToken(res);
  res.status(200).json({ success: true });
};
