import dotenv from "dotenv";
import { createApp } from "./app.js";
import { connectDB } from "./utils/db.js";

dotenv.config();

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    console.log("MongoDB is connected");
    createApp().listen(port, () => console.log(`API listening on http://localhost:${port}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
