# BRAINSTORM.md
 
## AI Brainstorming Transcript
 
---
 
**Me:** I need to build a full-stack web app for my capstone project. It has to use Vue 3, Express, MongoDB, and JWT auth. I'm into music and arts and want something fun and creative, but I'm not super confident with the stack so it can't be too complicated. Any ideas?
 
**AI:** Great starting point. Music and creativity is a strong space to work in — there's a lot of room for apps that feel personal and satisfying to use. Let me suggest three directions and you can tell me which sparks something.
 
The first is a **Listening Journal** — you log albums or tracks you've listened to, write short notes, give them a rating, and over time you build up a personal archive of your music taste. Think of it like Letterboxd but for music. The second is a **Gig Tracker** — you log live concerts you've been to, add setlists, memories, ratings. More niche, but very personal. The third is a **Mood Board / Playlist Curator** — you build visual mood boards tied to playlists or artists, drag and drop images and colors to capture a vibe, and make them shareable.
 
Which of those pulls you?
 
---
 
**Me:** I like the Listening Journal idea but I don't want it to be too complicated.
 
**AI:** Good instinct — scope discipline is one of the most important skills in a project like this. A bloated unfinished app is worse than a small finished one every time.
 
Here's what a well-scoped Listening Journal looks like. The core loop is: sign up and log in, search for an album using a free music API, add it to your journal with a star rating and a short written note, then browse, edit, or delete your past entries. As a fifth feature, you could add a simple stats page — things like your most-logged genres or your average rating over time.
 
That's five features. Tight, complete, and more than enough to demonstrate the full stack. Does that feel right, or would you swap anything out?
 
---
 
**Me:** I like this. Maybe instead of stats I could do a wishlist — like albums I want to listen to?
 
**AI:** That's actually a better swap for your skill level. A stats page requires aggregation queries in MongoDB which adds complexity. A wishlist is simpler — it's just a second list with a different status flag, or a separate collection. It also adds a natural second user action: you can move something from your wishlist into your journal once you've listened to it. That's a satisfying interaction and it makes the app feel more alive.
 
So the five core features would be: authentication (sign up / log in), album search via a music API, journal entries (with rating and notes), a wishlist, and the ability to move a wishlist item into the journal. Each one maps cleanly to a Vue view, an Express route, and a MongoDB collection. This is a solid scope.
 
---
 
**Me:** What API should I use for album search?
 
**AI:** The best free option for this use case is the **MusicBrainz API**. It requires no API key, has solid album and artist data, and is free to use for personal projects. The tradeoff is that it doesn't return album artwork. If you want cover art, you can pair it with the **Cover Art Archive API**, which is also free and works alongside MusicBrainz using the same IDs.
 
A simpler alternative is the **iTunes Search API** — also no key required, returns basic metadata and artwork in one call, and is very beginner-friendly. For a project at this scope, iTunes Search is probably the right call. It keeps your backend simple.
 
---
 
**Me:** Ok iTunes Search sounds easier. Let's go with that.
 
**AI:** Good call. iTunes Search is a single GET request, returns JSON with album name, artist, artwork URL, and genre — everything you need. You can call it directly from your Vue frontend or proxy it through Express. Either works; proxying through Express keeps your architecture cleaner.
 
To summarize what you're building: a personal music listening journal called something like **Vinyl** or **Tracklist** or **NoteWorthy**. Users sign up, search for albums via iTunes, log entries with a rating and notes, maintain a wishlist, and can move wishlist items into their journal. Vue 3 frontend, Express + MongoDB backend, JWT auth. This is a realistic, achievable, and genuinely useful project for four weeks of part-time work.
 
---
 
**Me:** I like the name "Tracklist"
 
**AI:** Tracklist it is. Clean, musical, immediately understood. Now go build your BRIEF.md and lock in the data model and API routes before you write a line of code.
 
---
 
## Reflection
Going into this brainstorm I had a vague sense that I wanted to build something music-related, but no real idea of what that meant in practice. The AI helped me narrow that down quickly by giving me three concrete options rather than an open-ended question — that structure made it easier to react and decide. I hadn't thought about using an external API at all, so the suggestion to use iTunes Search was genuinely useful; it solved a problem I hadn't even identified yet (where does the album data come from?). The most useful pushback was on the stats page. I liked the idea of it, but once the AI pointed out it would require aggregation queries in MongoDB, swapping it for a wishlist felt like the smarter call — simpler to build, and arguably more useful day-to-day. I don't think I disagreed with anything strongly. If anything, the AI was more conservative about scope than I was, which in hindsight is probably right for a four-week project. 