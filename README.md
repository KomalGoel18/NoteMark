# NoteMark - Personal Notes & Bookmark Manager

## Tech Stack

**Backend**
- Node.js, Express, MongoDB, JWT (jsonwebtoken)

**Frontend**
- Next.js (App Router), React, Tailwind CSS, TypeScript

## Project Setup

### Backend

1. Install dependencies:
   ```bash
   cd backend && npm install
   ```

2. Environment variables: create a `.env` file in `backend/` with:
   - `PORT` – 5000
   - `MONGO_URI` – MongoDB connection string
   - `JWT_SECRET` – secret for signing JWT tokens

3. Run:
   ```bash
   npm run dev
   ```

4. Backend base URL: `http://localhost:5000`
   - API base: `http://localhost:5000/api`

### Frontend

1. Install dependencies:
   ```bash
   cd frontend && npm install
   ```

2. Environment variables: create `.env.local` in `frontend/` with:
   - `NEXT_PUBLIC_API_URL` – `http://localhost:5000/api`

3. Run:
   ```bash
   npm run dev
   ```

4. Frontend URL: `http://localhost:3000`

## Features

- Create, update, delete notes
- Create, update, delete bookmarks
- Search notes and bookmarks
- Filter by tags
- Mark as favorites
- Responsive UI

**Bonus Implemented**
- JWT authentication (register, login)
- User-specific data (notes and bookmarks scoped to logged-in user)
- Auto-fetch bookmark title when title is empty

## API Documentation (brief)

### Auth
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login; returns JWT |

### Notes
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/notes` | Create a note |
| GET | `/api/notes` | List notes (query: `q`, `tags`) |
| GET | `/api/notes/:id` | Get note by id |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |

### Bookmarks
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/bookmarks` | Create a bookmark |
| GET | `/api/bookmarks` | List bookmarks (query: `q`, `tags`) |
| GET | `/api/bookmarks/:id` | Get bookmark by id |
| PUT | `/api/bookmarks/:id` | Update bookmark |
| DELETE | `/api/bookmarks/:id` | Delete bookmark |

All note and bookmark routes require `Authorization: Bearer <token>`.

## Sample cURL Requests

Create a note (replace `YOUR_JWT_TOKEN` with a token from `/api/auth/login`):

```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d "{\"title\":\"My Note\",\"content\":\"Note content here\",\"tags\":[\"work\"]}"
```

Create a bookmark:

```bash
curl -X POST http://localhost:5000/api/bookmarks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d "{\"url\":\"https://example.com\",\"description\":\"Example site\",\"tags\":[\"reference\"]}"
```

## Skills This Tests

- REST API design
- Data validation and error handling
- React (Next.js) routing and state
- Tailwind CSS for UI
- Clean code and structure
- Real-world data modeling

## Folder Structure

### Backend
```
backend/
├── config/
│   └── db.js
├── controllers/
│   ├── auth.controller.js
│   ├── bookmarks.controller.js
│   └── notes.controller.js
├── middleware/
│   └── auth.middleware.js
├── models/
│   ├── user.model.js
│   ├── note.model.js
│   └── bookmark.model.js
├── routes/
│   ├── auth.routes.js
│   ├── notes.routes.js
│   └── bookmarks.routes.js
├── utils/
│   └── fetchTitle.js
├── validations/
│   ├── auth.validation.js
│   ├── note.validation.js
│   └── bookmark.validation.js
├── app.js
├── server.js
└── package.json
```

### Frontend
```
frontend/
├── app/
│   ├── notes/
│   │   └── page.tsx
│   ├── bookmarks/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   ├── CreateNoteModal.tsx
│   └── AddBookmarkModal.tsx
└── package.json
```
