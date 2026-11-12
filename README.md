# devlog

A full-stack MERN blog with an admin dashboard, comments, Google sign-in and a Polish/English interface. I built it as a portfolio project to show the whole path of a web app: data model, REST API, authentication, a hand-made UI and tests.

## Features

**For readers**
- Home page with latest posts, search by title and content with a category filter and pagination
- Post page with a table of contents, reading progress bar and comments (add, edit, like, delete)
- Sign up / sign in with email and password or with Google
- Polish and English UI with a language switcher, light and dark theme without flicker on load
- "How it works" page (`/stack`) that explains the stack and the request flow

**For admins**
- Dashboard with totals and a six-month activity chart (posts, comments, users)
- Create and edit posts in a rich-text editor with image upload to Firebase Storage
- Manage posts, comments and users in paginated tables
- Read-only **demo account**: recruiters can open the admin panel with one click without changing any data

## Tech stack

| Layer | Tools |
| --- | --- |
| Frontend | React 18, Vite, React Router, Redux Toolkit + redux-persist, Tailwind CSS, react-i18next, react-quill, DOMPurify, sonner, react-helmet-async |
| Backend | Node.js 20, Express, MongoDB + Mongoose, JWT, bcryptjs, zod, helmet, express-rate-limit, firebase-admin |
| Services | MongoDB Atlas, Firebase Authentication (Google) and Storage |
| Quality | Vitest + Supertest + mongodb-memory-server, ESLint |

## How it works

```
Browser (React SPA)
   │  fetch("/api/...")  + httpOnly cookie "token"
   ▼
Express API  ── verifyToken → requireAdmin / blockDemo → zod validate → controller
   │
   ▼
MongoDB (users, posts, comments)

Firebase: Google sign-in popup (frontend) → ID token verified by firebase-admin (backend)
          image uploads go straight from the browser to Firebase Storage
```

### Frontend and API share one origin
The frontend always calls relative `/api/...` URLs. In development Vite proxies them to the Express server on port 3000. Because both live under one domain, the auth cookie works without CORS.

### Authentication
- After sign-up, sign-in, Google login or demo login, the server signs a JWT `{ id, isAdmin, isDemo }` (valid for 7 days) and sets it as an **httpOnly, sameSite=lax** cookie. JavaScript cannot read it, so an XSS bug cannot steal the session.
- Google login: the frontend gets an ID token from Firebase, and the backend verifies it with `firebase-admin` before it creates or finds the user. The client is never trusted to say who it is.
- Middleware chain on protected routes: `verifyToken` (logged in) → `requireAdmin` (admin only) → `blockDemo` (demo account cannot write).
- Auth endpoints are rate-limited (30 requests per 15 minutes).

### Session on the frontend
- The logged-in user is kept in a Redux slice (`app/user/userSlice.js`) and saved to `localStorage` with redux-persist, so a page refresh does not log you out.
- That copy is only a UI cache. On startup `useSession` calls `GET /api/auth/me` to check the cookie is still valid, and any `401` from the API clears the user.
- `LoggedInRoute` and `OnlyAdminRoute` guard the dashboard and editor pages. The real access control is always on the server.

### Validation and errors
- Every request body is validated with zod schemas (`backend/utils/validate.js`).
- Errors share one JSON shape: `{ success: false, statusCode, code, message }`. The frontend translates `code` (for example `USERNAME_TOO_SHORT`, `DUPLICATE_EMAIL`, `DEMO_READ_ONLY`) into a message in the current language.
- Post HTML is sanitized with DOMPurify before rendering.

### UI
- Own component kit in `components/ui` (Button, Field, Modal, ConfirmDialog, Skeleton, …) instead of a UI library.
- Pages are lazy-loaded, so each route ships only its own code.
- The theme script in `index.html` sets the `dark` class before React mounts, which removes the flash of the wrong theme.
- Per-page `<title>` and meta tags via react-helmet-async.

## API overview

All routes start with `/api`.

| Method | Route | Access |
| --- | --- | --- |
| POST | `/auth/signup`, `/auth/signin`, `/auth/google`, `/auth/demo` | public, rate-limited |
| GET | `/auth/me` | logged in |
| POST | `/auth/signout` | public |
| GET | `/post/getposts?searchTerm&category&slug&startIndex&limit&order` | public |
| GET | `/post/categories` | public |
| POST / PUT / DELETE | `/post/create`, `/post/edit/:postId`, `/post/delete/:postId` | admin, not demo |
| GET | `/comment/getComments/:postId` | public |
| POST / PUT | `/comment/create`, `/comment/like/:id` | logged in, not demo |
| PUT / DELETE | `/comment/edit/:id`, `/comment/delete/:id` | author or admin, not demo |
| GET | `/comment/getComments` | admin |
| GET | `/user/:userId` | public |
| PUT | `/user/update/:userId` | owner, not demo |
| DELETE | `/user/delete/:userId` | owner or admin, not demo |
| GET | `/user/getusers` | admin |
| GET | `/stats` | admin |
| GET | `/health` | public |

## Project structure

```
backend/
  app.js            Express app (middleware + routes), used by the server and the tests
  index.js          connects to MongoDB and starts the server
  routes/           URL → middleware → controller
  controllers/      request handlers (auth, post, comment, user, stats)
  models/           Mongoose schemas: User, Post, Comment
  utils/            auth middleware, zod validation, error handling, DB, Firebase
  scripts/          seed.js (sample data), make-admin.js
  tests/            API tests on an in-memory MongoDB
frontend/
  src/pages/        one file per route
  src/components/   ui/ kit, layout/, posts/, comments/, dashboard/, auth/
  src/hooks/        useSession, useApi, usePaginated, …
  src/lib/          API client, i18n, theme, uploads, formatting
  src/locales/      pl.json, en.json
  src/app/          Redux store and user slice
```

## Running locally

Requirements: Node.js 20+, a MongoDB database (local or a free Atlas cluster) and a Firebase project if you want Google sign-in and image uploads.

```bash
git clone https://github.com/Kamil678/devlog.git
cd devlog
npm install
npm install --prefix frontend
```

Create the env files from the templates:

```bash
cp .env.dist .env                    # MONGO_CONNECTION, JWT_SECRET, FIREBASE_PROJECT_ID, PORT
cp frontend/.env.dist frontend/.env  # VITE_FIREBASE_* web app config
```

Fill the database with sample posts, an admin and the demo account, then start both servers:

```bash
npm run seed   # prints the admin email and password
npm run dev    # API on :3000, frontend on Vite's port (default :5173)
```

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | API (nodemon) and frontend (Vite) together |
| `npm test` | backend API tests (Vitest + Supertest, in-memory MongoDB) |
| `npm run lint` | ESLint for the frontend |
| `npm run build` | production build of the frontend |
| `npm run seed` | sample posts and comments, admin, demo and reader users |
| `npm run make-admin -- user@example.com` | give an existing user admin rights |

## Tests

The backend tests start Express on a fresh in-memory MongoDB, so they need no setup. They cover sign-up/sign-in, the cookie session, role checks, the read-only demo account, validation errors, posts, comments, users and the stats endpoint.

```bash
npm test
```

## Author

Kamil Pigulak · [GitHub](https://github.com/Kamil678) · [LinkedIn](https://www.linkedin.com/in/kamil-pigulak/)
