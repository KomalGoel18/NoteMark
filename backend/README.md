## NoteMark Backend

**NoteMark Backend** is a Node.js + Express API that powers authentication, notes, and bookmarks for the NoteMark application.

It exposes REST endpoints for:
- User auth (email/password + OAuth)
- Password reset
- Notes CRUD with search and favorites
- Bookmarks CRUD with favorites and automatic title fetching

---

## Tech Stack

- Node.js, Express
- MongoDB with Mongoose
- Passport (Google & GitHub strategies)
- JSON Web Tokens (JWT)
- Zod for validation
- Nodemailer for transactional emails (password reset)

---

## Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment variables

Create a `.env` file in `backend`:

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=you@example.com
EMAIL_PASSWORD=your_smtp_password
```

Adjust variable names/values to match your actual deployment.

### 3. Run in development

```bash
npm run dev
```

This starts the API on `http://localhost:5000`.

For production:

```bash
npm start
```

---

## CORS

`backend/app.js` configures CORS to allow:

- `http://localhost:3000`
- `https://notemark-hub.vercel.app`

If your frontend runs on another URL, add it to the `origin` array in `app.js`.

---

## API Routes

Base path: `http://localhost:5000/api`

### Auth (`/auth`)

- `POST /auth/register` – register a new user
- `POST /auth/login` – login with email/password
- `GET /auth/me` – get current user (requires auth token)
- `POST /auth/forgot-password` – send password reset email
- `POST /auth/reset-password/:token` – reset password

**OAuth**

- `GET /auth/google` – redirect to Google OAuth
- `GET /auth/google/callback` – Google callback, redirects to `CLIENT_URL/oauth-success?token=...`
- `GET /auth/github` – redirect to GitHub OAuth
- `GET /auth/github/callback` – GitHub callback, redirects to `CLIENT_URL/oauth-success?token=...`

### Notes (`/notes`)

All note routes are protected by `auth.middleware`.

- `POST /notes` – create a note  
- `GET /notes` – list notes  
  - Supports:
    - `?q=searchText` – text search
    - `&tags=tag1,tag2` – filter by tags
- `GET /notes/:id` – get a single note
- `PUT /notes/:id` – update a note
- `DELETE /notes/:id` – delete a note
- `PATCH /notes/:id/favorite` – toggle favorite flag

### Bookmarks (`/bookmarks`)

All bookmark routes are protected by `auth.middleware`.

- `POST /bookmarks` – create a bookmark
- `GET /bookmarks` – list bookmarks
- `GET /bookmarks/:id` – get a single bookmark
- `PUT /bookmarks/:id` – update a bookmark
- `DELETE /bookmarks/:id` – delete a bookmark
- `PATCH /bookmarks/:id/favorite` – toggle favorite flag

The backend uses a utility in `utils/fetchTitle.js` to fetch titles for saved URLs.

---

## Scripts

From `backend/package.json`:

- `npm run dev` – start dev server with nodemon (`server.js`)
- `npm start` – start server with Node (`server.js`)

---

## Notes

- Make sure MongoDB is reachable from the environment where this app runs.
- Keep JWT secrets and OAuth credentials **out of version control** by using `.env` files or a secrets manager.

