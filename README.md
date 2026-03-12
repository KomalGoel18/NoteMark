## NoteMark

**NoteMark** is a full‑stack note and bookmark manager that lets you securely store, search and organize your notes and links in a single workspace.

The project is split into two apps:
- **Backend** (`backend`): Node.js/Express REST API with MongoDB, JWT auth, and OAuth (Google/GitHub).
- **Frontend** (`frontend`): Next.js + React dashboard with a modern, responsive UI.

---

## Features

- **Secure authentication**
  - Email/password login and registration
  - Multi‑provider OAuth (Google, GitHub)
  - Session and token based access

- **Notes**
  - Create, edit, delete notes
  - Search notes by text
  - Favorite/star important notes
  - Tag‑based filtering

- **Bookmarks**
  - Save and manage web links
  - Automatic title fetching for URLs
  - Starred/favorite bookmarks

- **Modern UI**
  - Dark themed dashboard
  - Skeleton loading states and toasts
  - Keyboard‑friendly navigation (command palette, search)

---

## Tech Stack

- **Frontend**
  - Next.js 13 (App Router), React 18, TypeScript
  - Tailwind CSS, Radix UI components, Shadcn‑style UI
  - Zustand for state management
  - Axios for API communication

- **Backend**
  - Node.js + Express
  - MongoDB + Mongoose
  - Passport (Google, GitHub strategies)
  - JSON Web Tokens (JWT)
  - Zod for request validation

---

## Project Structure

```text
NoteMark/
  backend/      # Node/Express API (auth, notes, bookmarks)
  frontend/     # Next.js app (landing page + dashboard)
  README.md     # This file
```

For more details, see:
- `backend/README.md` – API & backend setup
- `frontend/README.md` – frontend/dashboard setup

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A running MongoDB instance (local or hosted, e.g. MongoDB Atlas)

### Clone the repository

```bash
git clone https://github.com/KomalGoel18/NoteMark
cd NoteMark
```

### Install dependencies

Install backend packages:

```bash
cd backend
npm install
```

Install frontend packages:

```bash
cd ../frontend
npm install
```

---

## Environment Variables

### Backend (`backend/.env`)

Create a `.env` file in `backend` with values similar to:

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

Adjust keys to match your actual configuration (see your auth and mailer setup if present).

### Frontend (`frontend/.env.local`)

Create a `.env.local` file in `frontend`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

Update this when deploying to production.

---

## Running the Apps in Development

### Backend

```bash
cd backend
npm run dev
```

This starts the Express API on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm run dev
```

This starts the Next.js app on `http://localhost:3000`.

Make sure the backend CORS `origin` list in `backend/app.js` includes your frontend URL.

---

## API Overview

Base URL: `http://localhost:5000/api`

- **Auth**
  - `POST /auth/register`
  - `POST /auth/login`
  - OAuth routes for Google/GitHub (see `backend/routes/auth.routes.js`)

- **Notes**
  - `GET /notes` – list notes (supports `?q=` search and `&tags=` filter)
  - `POST /notes` – create a note
  - `PATCH /notes/:id` – update a note
  - `DELETE /notes/:id` – delete a note
  - `PATCH /notes/:id/favorite` – toggle favorite

- **Bookmarks**
  - `GET /bookmarks`
  - `POST /bookmarks`
  - `PATCH /bookmarks/:id`
  - `DELETE /bookmarks/:id`

See the backend README for more details and any additional routes.

---

## Frontend Overview

Key routes in the Next.js app:

- `/` – public marketing/landing page
- `/login` – login form
- `/register` – registration
- `/forgot-password`, `/reset-password/[token]` – auth flows
- `/notes` – notes dashboard
- `/bookmarks` – bookmarks dashboard
- `/starred` – starred items

The UI uses reusable components in `components/ui` and domain components like `CreateNoteModal` and `AddBookmarkModal`.

---

## Scripts

- **Backend**
  - `npm run dev` – start backend with nodemon
  - `npm start` – start backend with Node

- **Frontend**
  - `npm run dev` – start Next.js dev server
  - `npm run build` – build for production
  - `npm start` – run production build
  - `npm run lint` – lint the codebase
  - `npm run typecheck` – TypeScript type checking

---