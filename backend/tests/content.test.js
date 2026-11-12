import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { app, startDb, stopDb, clearDb, createUser, signedInAgent } from "./setup.js";
import Comment from "../models/comment.js";

beforeAll(startDb);
afterAll(stopDb);
beforeEach(clearDb);

const newPost = { title: "Żółta łódź podwodna", content: "<p>Wystarczająco długa treść posta.</p>", category: "music" };

describe("posts", () => {
  it("lets an admin create a post with a Polish-safe slug", async () => {
    const admin = await signedInAgent(await createUser({ username: "admin", isAdmin: true }));
    const res = await admin.post("/api/post/create").send(newPost).expect(201);

    expect(res.body.post.slug).toBe("zolta-lodz-podwodna");
    await admin.post("/api/post/create").send(newPost).expect(409);
  });

  it("forbids regular users and the demo account from writing", async () => {
    const reader = await signedInAgent(await createUser({ username: "reader" }));
    await reader.post("/api/post/create").send(newPost).expect(403);

    const demo = await signedInAgent(await createUser({ username: "demo", isAdmin: true, isDemo: true }));
    const res = await demo.post("/api/post/create").send(newPost).expect(403);
    expect(res.body.code).toBe("DEMO_READ_ONLY");
  });

  it("updates the slug on edit and removes comments on delete", async () => {
    const admin = await signedInAgent(await createUser({ username: "admin", isAdmin: true }));
    const { body } = await admin.post("/api/post/create").send(newPost);
    const id = body.post._id;

    const edited = await admin.put(`/api/post/edit/${id}`).send({ ...newPost, title: "New title" }).expect(200);
    expect(edited.body.post.slug).toBe("new-title");

    await admin.post("/api/comment/create").send({ postId: id, content: "Hi" }).expect(201);
    await admin.delete(`/api/post/delete/${id}`).expect(200);
    expect(await Comment.countDocuments()).toBe(0);
  });

  it("treats search input literally and counts with the same filter", async () => {
    const admin = await signedInAgent(await createUser({ username: "admin", isAdmin: true }));
    await admin.post("/api/post/create").send(newPost);
    await admin.post("/api/post/create").send({ ...newPost, title: "Another one", category: "tech" });

    await request(app).get("/api/post/getposts?searchTerm=(").expect(200);
    const res = await request(app).get("/api/post/getposts?category=tech").expect(200);
    expect(res.body.posts).toHaveLength(1);
    expect(res.body.totalPosts).toBe(1);
  });
});

describe("comments", () => {
  it("sets the author from the session, toggles likes and limits who can edit", async () => {
    const admin = await signedInAgent(await createUser({ username: "admin", isAdmin: true }));
    const { body } = await admin.post("/api/post/create").send(newPost);

    const author = await createUser({ username: "author" });
    const authorAgent = await signedInAgent(author);
    const other = await signedInAgent(await createUser({ username: "other" }));

    const created = await authorAgent
      .post("/api/comment/create")
      .send({ postId: body.post._id, content: "Nice", userId: "someone-else" })
      .expect(201);
    const commentId = created.body.comment._id;
    expect(created.body.comment.userId).toBe(author._id.toString());

    const liked = await other.put(`/api/comment/like/${commentId}`).expect(200);
    expect(liked.body.numberOfLikes).toBe(1);
    const unliked = await other.put(`/api/comment/like/${commentId}`).expect(200);
    expect(unliked.body.numberOfLikes).toBe(0);

    await other.put(`/api/comment/edit/${commentId}`).send({ content: "Hacked" }).expect(403);
    await authorAgent.put(`/api/comment/edit/${commentId}`).send({ content: "" }).expect(400);
    await authorAgent.put(`/api/comment/edit/${commentId}`).send({ content: "Edited" }).expect(200);
    await admin.delete(`/api/comment/delete/${commentId}`).expect(200);
  });
});

describe("users", () => {
  it("hides private fields on public profiles and masks emails for the demo account", async () => {
    const user = await createUser({ username: "kamil" });
    const profile = await request(app).get(`/api/user/${user._id}`).expect(200);
    expect(profile.body.email).toBeUndefined();

    const demo = await signedInAgent(await createUser({ username: "demo", isAdmin: true, isDemo: true }));
    const list = await demo.get("/api/user/getusers").expect(200);
    expect(list.body.users.every((u) => u.email.includes("***"))).toBe(true);
  });

  it("lets users update only themselves", async () => {
    const kamil = await createUser({ username: "kamil" });
    const other = await createUser({ username: "other" });
    const agent = await signedInAgent(kamil);

    await agent.put(`/api/user/update/${other._id}`).send({ username: "hacker" }).expect(403);
    const res = await agent.put(`/api/user/update/${kamil._id}`).send({ email: "new@example.com" }).expect(200);
    expect(res.body.email).toBe("new@example.com");
  });
});
