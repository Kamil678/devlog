import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import bcryptjs from "bcryptjs";
import { createApp } from "../app.js";
import User from "../models/user.js";

process.env.JWT_SECRET = "test-secret";

let mongo;

export const startDb = async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
};

export const stopDb = async () => {
  await mongoose.disconnect();
  await mongo.stop();
};

export const clearDb = async () => {
  await Promise.all(Object.values(mongoose.connection.collections).map((c) => c.deleteMany({})));
};

export const app = createApp();

export const createUser = async (overrides = {}) =>
  User.create({
    email: `${overrides.username || "user"}@example.com`,
    username: "user",
    password: await bcryptjs.hash("password123", 10),
    ...overrides,
  });

export const signedInAgent = async (user) => {
  const agent = request.agent(app);
  await agent.post("/api/auth/signin").send({ email: user.email, password: "password123" }).expect(200);
  return agent;
};
