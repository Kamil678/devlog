import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import request from "supertest";
import { app, startDb, stopDb, clearDb, createUser } from "./setup.js";

vi.mock("../utils/firebase.js", () => ({
  verifyGoogleIdToken: vi.fn(async (token) => {
    if (token !== "valid") throw new Error("bad token");
    return { email: "google@example.com", name: "Jan Kowalski", picture: "https://example.com/a.png" };
  }),
}));

beforeAll(startDb);
afterAll(stopDb);
beforeEach(clearDb);

describe("auth", () => {
  it("signs up, sets an httpOnly cookie and never returns the password", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ username: "kamil", email: "Kamil@Example.com", password: "password123" })
      .expect(201);

    expect(res.body.email).toBe("kamil@example.com");
    expect(res.body.password).toBeUndefined();
    expect(res.headers["set-cookie"][0]).toMatch(/HttpOnly/);
  });

  it("rejects an empty signup with a validation error instead of crashing", async () => {
    const res = await request(app).post("/api/auth/signup").send({}).expect(400);
    expect(res.body.code).toBe("VALIDATION_ERROR");
  });

  it("reports a duplicate email as 409", async () => {
    await createUser({ username: "taken" });
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ username: "other", email: "taken@example.com", password: "password123" })
      .expect(409);
    expect(res.body.code).toBe("DUPLICATE_EMAIL");
  });

  it("uses the same error for an unknown email and a wrong password", async () => {
    await createUser({ username: "kamil" });
    const unknown = await request(app).post("/api/auth/signin").send({ email: "nobody@example.com", password: "x" });
    const wrong = await request(app).post("/api/auth/signin").send({ email: "kamil@example.com", password: "x" });

    expect(unknown.status).toBe(401);
    expect(wrong.status).toBe(401);
    expect(unknown.body.code).toBe(wrong.body.code);
  });

  it("returns the current user from /me with the cookie", async () => {
    await createUser({ username: "kamil" });
    const agent = request.agent(app);
    await agent.post("/api/auth/signin").send({ email: "kamil@example.com", password: "password123" }).expect(200);

    const res = await agent.get("/api/auth/me").expect(200);
    expect(res.body.username).toBe("kamil");

    await agent.post("/api/auth/signout").expect(200);
    await agent.get("/api/auth/me").expect(401);
  });

  it("creates a Google user from a verified token and rejects forged ones", async () => {
    await request(app).post("/api/auth/google").send({ idToken: "forged" }).expect(401);

    const res = await request(app).post("/api/auth/google").send({ idToken: "valid" }).expect(200);
    expect(res.body.email).toBe("google@example.com");
    expect(res.body.username).toMatch(/^jankowalski/);
    expect(res.body.picture).toBe("https://example.com/a.png");
  });

  it("signs in the demo account when it exists", async () => {
    await request(app).post("/api/auth/demo").expect(404);
    await createUser({ username: "demo", isDemo: true, isAdmin: true });
    const res = await request(app).post("/api/auth/demo").expect(200);
    expect(res.body.isDemo).toBe(true);
  });
});
