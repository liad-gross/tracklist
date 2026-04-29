# STEP-BY-STEP-GUIDE.md

This is my personal guide to how I built Tracklist from scratch. Written as I went so I can reproduce it if needed.

---

## Part 1 — Back-End Setup (Week 13)

### Step 1 — Create the backend folder structure

Inside my `tracklist` repo I created a `backend` folder with this structure:

```
backend/
  models/
    User.js
    Entry.js
  middleware/
    auth.js
  routes/
    auth.js
    entries.js
    search.js
  server.js
  package.json
  .env
  .gitignore
```

### Step 2 — Initialise npm and install dependencies

```bash
cd backend
npm install
```

This installed: `express`, `mongoose`, `cors`, `dotenv`, `bcryptjs`, `jsonwebtoken`, and `nodemon` (dev only).

### Step 3 — Set up MongoDB Atlas

1. Went to [mongodb.com/atlas](https://mongodb.com/atlas) and created a free account
2. Created a free M0 cluster
3. Created a database user with a username and password
4. Under Network Access, added `0.0.0.0/0` to allow connections from anywhere
5. Clicked **Connect → Drivers** and copied the connection string
6. Pasted it into my `.env` file as `MONGO_URI`, replacing `<password>` with my actual password and adding `/tracklist` as the database name before the `?`

### Step 4 — Create the .env file

Created a file called `.env` in the `backend` folder (never committed to GitHub):

```
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/tracklist?retryWrites=true&w=majority
JWT_SECRET=some_long_random_secret_string
PORT=5000
```

Made sure `.env` was listed in `.gitignore`.

### Step 5 — Build the Express server (server.js)

Set up `server.js` to:
- Import express, mongoose, cors, dotenv
- Register the three route files under `/api/auth`, `/api/entries`, `/api/search`
- Connect to MongoDB using `MONGO_URI` from `.env`
- Start listening on port 5000

### Step 6 — Build the Mongoose models

**User model** (`models/User.js`): fields for `email` (unique, required) and `password` (stored hashed). Used `timestamps: true` so MongoDB auto-adds `createdAt` and `updatedAt`.

**Entry model** (`models/Entry.js`): fields for `userId` (ref to User), `albumTitle`, `artist`, `artworkUrl`, `genre`, `itunesId`, `rating` (1–5), and `notes`.

### Step 7 — Build the auth middleware

Created `middleware/auth.js`. It reads the `Authorization` header, extracts the Bearer token, verifies it with `jwt.verify`, and attaches `req.userId` for use in protected routes. Returns 401 if no token or invalid token.

### Step 8 — Build the auth routes

**POST /api/auth/register:**
1. Check email and password are present
2. Check email isn't already taken
3. Hash password with `bcrypt.hash(password, 10)`
4. Save new user to DB
5. Return a JWT signed with `JWT_SECRET`

**POST /api/auth/login:**
1. Find user by email
2. Compare submitted password with stored hash using `bcrypt.compare`
3. Return a JWT if match

### Step 9 — Build the entries routes

All routes use the `authMiddleware` so they're protected. The `userId` comes from the decoded JWT, not from the request body — this means users can only ever see and modify their own entries.

- **GET /api/entries** — finds all entries where `userId` matches, sorted newest first
- **POST /api/entries** — creates a new entry with album data from the request body
- **PUT /api/entries/:id** — finds entry by `_id` AND `userId` (so you can't edit someone else's entry), updates `rating` and/or `notes`
- **DELETE /api/entries/:id** — same ownership check, then deletes

### Step 10 — Build the search route

**GET /api/search?q=term** — proxies the request to the iTunes Search API using Node's built-in `fetch`. Filters results to only return the fields the frontend needs: `itunesId`, `albumTitle`, `artist`, `artworkUrl`, `genre`.

### Step 11 — Run and test locally

Started the server:

```bash
npm run dev
```

Tested all routes in **Thunder Client** (VS Code extension):

| Test | Method | URL | Auth needed |
|---|---|---|---|
| Register | POST | `http://localhost:5000/api/auth/register` | No |
| Login | POST | `http://localhost:5000/api/auth/login` | No |
| Get entries | GET | `http://localhost:5000/api/entries` | Yes — Bearer token |
| Add entry | POST | `http://localhost:5000/api/entries` | Yes |
| Edit entry | PUT | `http://localhost:5000/api/entries/:id` | Yes |
| Delete entry | DELETE | `http://localhost:5000/api/entries/:id` | Yes |
| Search | GET | `http://localhost:5000/api/search?q=radiohead` | No |

For protected routes, I copied the token returned by `/login` and pasted it into Thunder Client under **Auth → Bearer**.

---

*Front-end setup continues in Part 2 (Week 14)*

---

## Part 2 — Front-End Setup (Week 14)

### Step 1 — Scaffold the Vite/Vue project

From inside the `tracklist` repo root:

```bash
npm create vite@latest frontend -- --template vue
cd frontend
npm install
npm install vue-router@4 pinia axios
```

Chose Vue + JavaScript (not TypeScript) when prompted.

### Step 2 — Folder structure

Inside `frontend/src/` I created:

```
src/
  api.js              ← axios instance with base URL and JWT interceptor
  main.js             ← app entry point, registers Pinia and Router
  App.vue             ← root component with nav bar and router-view
  router/
    index.js          ← Vue Router with route guards
  stores/
    auth.js           ← Pinia store for login state and token
  views/
    AuthView.vue      ← login / register page
    SearchView.vue    ← album search + add to journal modal
    JournalView.vue   ← journal list + edit/delete modal
```

### Step 3 — Set up the axios API instance (api.js)

Created `src/api.js` with a base URL pointing to the backend (`http://localhost:5001/api`). Added a request interceptor that automatically attaches the JWT token from localStorage to every request as a Bearer token. This means I never have to manually add auth headers in my views.

### Step 4 — Set up the Pinia auth store (stores/auth.js)

The auth store holds `token` and `email` in state, loaded from localStorage on startup so the user stays logged in after a page refresh. It has three actions: `register`, `login`, and `logout`. Register and login both call the backend, save the returned token to state and localStorage. Logout clears everything.

### Step 5 — Set up Vue Router (router/index.js)

Three routes: `/auth`, `/search`, `/journal`. The root `/` redirects to `/journal`. Search and Journal have `meta: { requiresAuth: true }`. A `beforeEach` navigation guard checks `auth.isLoggedIn` and redirects to `/auth` if not logged in.

### Step 6 — Build App.vue

The root component renders the nav bar (only when logged in) and `<router-view>`. The nav has links to Search and Journal, and a Logout button that calls `auth.logout()` and redirects to `/auth`. All global CSS (buttons, inputs, modal styles) lives here.

### Step 7 — Build AuthView.vue

Single page with two tabs: Log In and Register. Both use the same email/password form, Register adds a Confirm Password field. On submit it calls the appropriate Pinia action. On success it redirects to `/search`. Errors from the backend are shown inline.

### Step 8 — Build SearchView.vue

Search bar that calls `GET /api/search?q=` on the backend, which proxies to iTunes. Results render as a grid of album cards with cover art. Clicking "+ Journal" opens a modal with a star rating picker and notes textarea. On save it calls `POST /api/entries` and redirects to `/journal`.

### Step 9 — Build JournalView.vue

Fetches all entries on `created()`. Renders them as a list with cover art, title, artist, stars, notes, and date. Edit button opens a modal pre-filled with current rating and notes — saves with `PUT /api/entries/:id`. Delete button calls `DELETE /api/entries/:id` after a confirm dialog.

### Step 10 — Run the frontend

```bash
cd frontend
npm run dev
```

Frontend runs at `http://localhost:5173`. Backend must also be running at `http://localhost:5001`.