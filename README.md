# Tracklist

A personal music listening journal. Search for albums, log what you've heard, rate them, and write notes — all saved to your own private account.

## Live URLs

| | URL |
|---|---|
| **Frontend** | https://liad-gross.github.io/tracklist/ |
| **Backend API** | https://tracklist-production.up.railway.app |

## Tech Stack

| Layer | Technology |
|---|---|
| Front-end | Vue 3 (Vite, Options API) |
| State management | Pinia |
| Routing | Vue Router 4 (hash mode) |
| Back-end | Node.js + Express.js |
| Database | MongoDB Atlas + Mongoose |
| Authentication | JWT |
| Deployment | GitHub Pages (frontend) + Railway (backend) |

## Features

- Register and log in — all data is private to your account
- Search any album by name or artist via the iTunes Search API
- Add albums to your journal with a 1–5 star rating and personal notes
- Edit or delete any journal entry
- Fully deployed — works from any browser, no local setup needed

## Running Locally

### Backend
```bash
cd backend
npm install
# create a .env file with MONGO_URI, JWT_SECRET, PORT
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:5001`.

## Project Structure

```
tracklist/
  backend/
    models/        ← Mongoose schemas (User, Entry)
    middleware/    ← JWT auth middleware
    routes/        ← Express routes (auth, entries, search)
    server.js
  frontend/
    src/
      views/       ← AuthView, SearchView, JournalView
      stores/      ← Pinia auth store
      router/      ← Vue Router
      api.js       ← Axios instance
  BRIEF.md
  BRAINSTORM.md
  WIREFRAMES.md
  wireframes/
  STEP-BY-STEP-GUIDE.md
  REFLECTION.md
```