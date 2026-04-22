# BRIEF.md
 
## Project Name
**Tracklist**
 
---
 
## The Problem It Solves
 
Music listeners have no simple personal space to record what they've heard and how they felt about it. Tracklist gives you a private listening journal — log albums, rate them, and write notes to build a personal record of your music taste over time.
 
---
 
## Core Features
 
- **Authentication** — Users can sign up and log in. All journal data is private to each user.
- **Album Search** — Search for any album by name or artist using the iTunes Search API. Results show cover art, album title, artist, and genre.
- **Journal Entries** — Add a searched album to your journal with a 1–5 star rating and a short personal note.
- **Edit & Delete** — Update the rating or notes on any past entry, or remove it entirely.
---
 
## Data Model
 
### Collection: `users`
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `email` | String | Unique, required |
| `password` | String | Hashed with bcrypt |
| `createdAt` | Date | Auto-generated |
 
### Collection: `entries`
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `userId` | ObjectId | Ref: users |
| `albumTitle` | String | From iTunes API |
| `artist` | String | From iTunes API |
| `artworkUrl` | String | From iTunes API |
| `genre` | String | From iTunes API |
| `itunesId` | String | iTunes collection ID |
| `rating` | Number | 1–5 |
| `notes` | String | User's personal note |
| `listenedAt` | Date | Defaults to now |
 
---
 
## API Endpoint Table
 
### Auth Routes
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in, returns JWT |
 
### Journal Entry Routes *(protected)*
| Method | Path | Description |
|---|---|---|
| GET | `/api/entries` | Get all journal entries for logged-in user |
| POST | `/api/entries` | Add a new journal entry |
| PUT | `/api/entries/:id` | Edit rating or notes on an entry |
| DELETE | `/api/entries/:id` | Delete a journal entry |
 
### Search Route
| Method | Path | Description |
|---|---|---|
| GET | `/api/search?q=` | Proxy search to iTunes API, return results |
 
---
 
## Authentication
 
**Yes.** The app is built around personal user data — every journal entry belongs to a specific user. Without authentication, users would see each other's data. JWT tokens are used to protect all `/api/entries` routes.