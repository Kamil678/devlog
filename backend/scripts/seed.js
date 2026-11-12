import crypto from "crypto";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import slugify from "slugify";
import User from "../models/user.js";
import Post from "../models/post.js";
import Comment from "../models/comment.js";
import { connectDB } from "../utils/db.js";

dotenv.config();

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "admin12345";

if (process.env.NODE_ENV === "production" && !process.env.SEED_ADMIN_PASSWORD) {
  console.error("Set SEED_ADMIN_PASSWORD before seeding a production database.");
  process.exit(1);
}

const posts = [
  {
    title: "Why I store JWT in an httpOnly cookie",
    category: "security",
    content: `<p>Keeping the token in <code>localStorage</code> is convenient, but any injected script can read it. An <strong>httpOnly</strong> cookie is invisible to JavaScript, so an XSS bug does not leak the session.</p>
<h2>What it costs</h2>
<p>The browser sends the cookie automatically, so you have to think about CSRF. Setting <code>sameSite: "lax"</code> blocks cross-site POST requests in modern browsers.</p>
<h2>How it looks in Express</h2>
<pre><code>res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "lax" });</code></pre>`,
  },
  {
    title: "Express on Netlify Functions in five minutes",
    category: "devops",
    content: `<p>Netlify is known for static sites, but an Express app can run there as a single serverless function thanks to <code>serverless-http</code>.</p>
<h2>The trick</h2>
<p>A redirect sends every <code>/api/*</code> request to the function. The frontend and the API share one domain, so cookies just work and CORS is not needed.</p>
<h2>Watch out for</h2>
<p>Reuse the database connection between invocations, otherwise every cold start opens a new one.</p>`,
  },
  {
    title: "Tailwind dark mode without flicker",
    category: "frontend",
    content: `<p>The classic problem: the page renders light for a split second, then switches to dark. The fix is to set the <code>dark</code> class before React mounts.</p>
<h2>A tiny inline script</h2>
<p>Read the saved theme (or <code>prefers-color-scheme</code>) in a script in <code>index.html</code> and apply the class immediately.</p>`,
  },
  {
    title: "Jak zaprojektowałem panel administratora",
    category: "frontend",
    content: `<p>Panel ma jedno zadanie: szybko pokazać, co się dzieje na blogu, i pozwolić zarządzać treścią bez szukania opcji.</p>
<h2>Kafelki ze statystykami</h2>
<p>Liczba postów, komentarzy i użytkowników, a obok przyrost z ostatniego miesiąca. Dane pochodzą z tych samych endpointów, co listy.</p>
<h2>Konto demo</h2>
<p>Rekruter może wejść do panelu jednym kliknięciem. Backend blokuje wszystkie zapisy dla tego konta, więc nic się nie zepsuje.</p>`,
  },
  {
    title: "Walidacja danych w API z Zod",
    category: "backend",
    content: `<p>Walidacja tylko w przeglądarce to za mało: żądanie można wysłać z pominięciem formularza. Dlatego każdy endpoint ma schemat <strong>Zod</strong>.</p>
<h2>Kody zamiast komunikatów</h2>
<p>Backend zwraca kod błędu, np. <code>PASSWORD_TOO_SHORT</code>, a frontend tłumaczy go na polski albo angielski. Dzięki temu API nie musi znać języka użytkownika.</p>`,
  },
  {
    title: "Wyszukiwarka postów bez zewnętrznych usług",
    category: "backend",
    content: `<p>Przy kilkudziesięciu postach nie potrzeba Algolii ani Elasticsearch. Wystarczy zapytanie MongoDB z wyrażeniem regularnym po tytule i treści.</p>
<h2>Jedna pułapka</h2>
<p>Fraza od użytkownika musi być escapowana. Inaczej znak <code>(</code> w wyszukiwarce kończy się błędem 500.</p>`,
  },
];

const comments = [
  "Great write-up, thanks!",
  "Przydatne, dokładnie tego szukałem.",
  "Could you share the full config?",
  "Dzięki, wdrażam u siebie.",
];

const upsertUser = async (data) => {
  const password = await bcryptjs.hash(data.password, 10);
  return User.findOneAndUpdate({ email: data.email }, { $set: { ...data, password } }, { upsert: true, new: true });
};

await connectDB();

const admin = await upsertUser({ email: ADMIN_EMAIL, username: "admin", password: ADMIN_PASSWORD, isAdmin: true });

const demo = await upsertUser({
  email: "demo@example.com",
  username: "demo",
  password: crypto.randomBytes(24).toString("hex"),
  isAdmin: true,
  isDemo: true,
});
const reader = await upsertUser({
  email: "reader@example.com",
  username: "reader",
  password: crypto.randomBytes(24).toString("hex"),
});

for (const [index, data] of posts.entries()) {
  const slug = slugify(data.title, { lower: true, strict: true, locale: "pl" });
  const old = await Post.findOneAndDelete({ slug });
  if (old) await Comment.deleteMany({ postId: old._id.toString() });

  const post = await Post.create({
    ...data,
    slug,
    author: admin._id.toString(),
    image: `https://picsum.photos/seed/${slug}/1200/630`,
  });

  await Comment.create([
    { content: comments[index % comments.length], postId: post._id.toString(), userId: reader._id.toString() },
    { content: comments[(index + 1) % comments.length], postId: post._id.toString(), userId: admin._id.toString() },
  ]);
}

console.log(`Seeded ${posts.length} posts. Admin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}. Demo user: ${demo.username}.`);
await mongoose.disconnect();
