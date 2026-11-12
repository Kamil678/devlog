import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/user.js";
import { connectDB } from "../utils/db.js";

dotenv.config();

const email = process.argv[2];

if (!email) {
  console.error("Usage: npm run make-admin -- user@example.com");
  process.exit(1);
}

await connectDB();
const user = await User.findOneAndUpdate({ email: email.toLowerCase() }, { isAdmin: true }, { new: true });
console.log(user ? `${user.username} is now an admin.` : `No user with email ${email}.`);
await mongoose.disconnect();
