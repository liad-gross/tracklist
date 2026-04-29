# REFLECTION.md

---

## Q1 — Scope Decisions

My original BRIEF.md included five features: authentication, album search, journal entries, a wishlist, and the ability to move wishlist items into the journal. Before I wrote a single line of code I cut the wishlist entirely. The reason was simple — it added a second collection, extra API routes, and a modal flow just to support a feature that wasn't core to the app. The real point of Tracklist is logging albums you've already heard, not managing a queue. Cutting it made the data model cleaner (one `entries` collection instead of two), the API smaller, and the frontend easier to reason about. What I actually built matches the trimmed scope almost exactly: auth, search via iTunes, and full CRUD on journal entries. The one thing that changed slightly was the search — I originally planned to call iTunes directly from the frontend, but ended up proxying through Express instead, which kept the architecture cleaner and made it easier to shape the response data before it hit the UI.

---

## Q2 — Technical Challenge

The hardest problem was getting the deployed frontend to talk to the deployed backend. Locally everything worked fine — Vue called localhost, Express responded, done. But once the frontend was on GitHub Pages and the backend was on Railway, two separate problems hit at once. The first was CORS: Railway was blocking requests from `liad-gross.github.io` because the backend wasn't configured to allow that origin. The fix was adding an explicit origin whitelist to the `cors()` middleware in `server.js`. The second problem was MongoDB Atlas blocking Railway's outbound IP — Atlas had my laptop's IP whitelisted from development, but Railway's servers use different IPs entirely. The fix was setting the Atlas Network Access to allow all IPs (`0.0.0.0/0`). Neither error was obvious at first because both showed up as vague network failures in the browser. Reading the Railway logs carefully was what revealed the MongoDB connection error, and the browser DevTools Network tab showed the CORS preflight failing with a 502, which pointed me to the server crash.

---

## Q3 — AI and Vibe-Coding

One area where the AI output worked almost perfectly with minimal changes was the backend. The Express routes, Mongoose models, and JWT middleware were generated in one go and ran correctly the first time I tested them in Thunder Client. The structure was clean — auth middleware as a separate file, routes split by resource, `.env` for secrets — and I didn't have to touch any of it to get all seven endpoints passing. That was genuinely useful because it let me focus on understanding the code rather than fighting syntax errors.

The area that needed more work was the deployment configuration. The AI gave me the right general approach for GitHub Pages and Railway but couldn't anticipate the specific combination of problems that came up in my actual environment — the CORS issue, the MongoDB IP whitelist, and the Node version being too old for the version of Vite that got installed. Each of those required reading error messages carefully and working out what was actually wrong rather than just following the steps. The lesson is that AI-generated setup instructions are a good starting point but real deployment always involves environment-specific problems that you have to debug yourself.

---

## Q4 — Architecture

When a user clicks **Save Entry** in the Add to Journal modal on the Search page, this is what happens. The Vue component collects the album data (title, artist, artwork URL, genre, iTunes ID) along with the rating and notes the user entered, and calls `api.post('/entries', payload)`. The `api` object is an axios instance configured with the backend's base URL. Before the request is sent, an axios interceptor reads the JWT token from localStorage and attaches it to the `Authorization` header as a Bearer token. The request hits the Express route `POST /api/entries`. The auth middleware runs first — it reads the token from the header, verifies it with `jwt.verify`, and attaches the decoded `userId` to `req`. The route handler then creates a new Mongoose `Entry` document using the request body plus `req.userId`, and saves it to MongoDB Atlas. MongoDB returns the saved document with its generated `_id`. Express sends that back as JSON with a 201 status. Back in Vue, axios resolves the promise, the component calls `this.$router.push('/journal')`, and the Journal view loads and fetches the updated list of entries — which now includes the one just saved.

---

## Q5 — If You Had Two More Weeks

The first thing I would add is a stats or insights page. Right now the journal is just a list — there's no way to see patterns in your listening. A simple stats view showing your average rating, your most logged genre, and a count of entries per month would make the app feel much more alive and give users a reason to keep coming back. Technically this would mean adding a new Express route that runs MongoDB aggregation queries — `$group` by genre, `$avg` on rating, `$count` on entries — and a new Vue view to display the results as simple text stats or a basic chart using a library like Chart.js. The second thing I would improve is the album search results — right now iTunes returns a lot of duplicates and reissues, and there's no way to filter by decade or genre. Adding client-side filtering on the results array in Vue would be relatively straightforward and would make the search much more usable.