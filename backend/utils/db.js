import mongoose from "mongoose";

let connection = null;

export const connectDB = (uri = process.env.MONGO_CONNECTION) => {
  if (!connection) {
    connection = mongoose.connect(uri).catch((err) => {
      connection = null;
      throw err;
    });
  }
  return connection;
};
