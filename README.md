
# UniConnect

## Overview

UniConnect is a campus engagement platform that brings students, administrators, clubs, and alumni together in one place. 

Students can report campus issues, track their resolution, discover student Clubs, connect with Alumni, and collaborate on campus events — all through a clean and modern interface.

---

## Live Demo

Frontend — https://uniconnect-eeku.vercel.app

Backend API — https://uniconnect-backend-bf70.onrender.com

> The backend is hosted on Render's free tier. The first request after inactivity may take around 30 seconds to respond.

---

## Features

**Authentication**
- Student registration with OTP email verification
- JWT-based login with persistent sessions
- Protected routes on both frontend and backend

**Campus Issue Reporting**
- Create issues with title, description, and optional image
- Upvote and un-upvote issues (duplicate votes prevented server-side)
- Comment on issues for community discussion
- Track issue status — Pending, In Progress, Resolved

**AI Duplicate Issue Detection**
- Before posting, the system generates semantic embeddings using the Gemini Embeddings API
- Similar existing issues are detected using MongoDB Atlas Vector Search with cosine similarity
- If a similar issue is found above the 85% similarity threshold, users are shown existing issues and prompted to upvote them instead of creating a duplicate
- Users can still choose to post anyway if their issue is genuinely different
- If the AI check fails for any reason, issue creation proceeds normally without blocking the user

**Trending Issues**
- Dedicated trending page showing top 10 most-upvoted Pending issues from the last 24 hours
- All remaining unresolved Pending issues displayed below sorted by newest first
- Trending sidebar visible on the home dashboard in real time

**Campus Events**
- Admin can create campus events with title, description, venue, date, time, organizer, poster image, and registration link
- Students can browse all upcoming events as responsive cards
- Each event has a dedicated discussion page where students can collaborate, find teammates, ask questions, and coordinate participation
- Students can delete their own messages and admin can delete any message

**Clubs Directory**
- Browse campus clubs with contact details
- Admin-managed club creation via API

**Alumni Network**
- Explore alumni profiles with graduation year, company, and role
- Direct contact via email and phone links
- Admin-managed alumni records via API

**Performance and Caching**
- Redis-backed API caching for issues, trending, clubs, and alumni
- Cache invalidated automatically on any data mutation
- OTP stored and rate-limited in Redis — max 3 requests per minute per email
- Zero page-flicker navigation using Redux store caching

**UI and UX**
- LinkedIn-style 3-column dashboard layout
- Left sidebar with user profile and stats
- Right sidebar with live trending issues
- Skeleton loading states across all pages
- Toast notifications for all user actions
- Fully responsive across mobile, tablet, and desktop

---

## Tech Stack

**Frontend**
- React.js
- Redux Toolkit
- React Router DOM
- Axios
- Tailwind CSS v4
- Vite

**Backend**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs
- Multer
- Cloudinary
- Nodemailer
- Redis (ioredis)

**AI and Search**
- Gemini Embeddings API — semantic text embeddings
- MongoDB Atlas Vector Search — cosine similarity search

**Deployment**
- Vercel — Frontend
- Render — Backend and Redis
- MongoDB Atlas — Database
- Cloudinary — Image storage

---

## Getting Started

**Prerequisites**
- Node.js v18 or above
- MongoDB local instance or MongoDB Atlas account
- Gmail account with App Password enabled
- Cloudinary free account
- Redis local instance or Render Redis
- Gemini API key from Google AI Studio

**Clone the repository**

```bash
git clone https://github.com/M-EEKSHITHKUMAR/UniConnect.git
cd UniConnect
```

**Backend setup**

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder with the required environment variables then start the backend:

```bash
npm run dev
```

**Frontend setup**

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder with the required environment variables then start the frontend:

```bash
npm run dev
```

The app will be running at `http://localhost:3000`

---

## API Endpoints

**Auth — /api/auth**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /send-otp | Send OTP to email | Public |
| POST | /verify-otp | Verify OTP | Public |
| POST | /register | Register new user | Public |
| POST | /login | Login user | Public |
| GET | /profile | Get current user profile | Private |
| PUT | /profile | Update user profile | Private |

**Issues — /api/issues**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | / | Get all issues | Public |
| POST | / | Create new issue | Private |
| GET | /trending | Get trending issues | Public |
| GET | /pending | Get all pending issues | Public |
| POST | /check-similarity | Check for duplicate issues via AI | Private |
| PUT | /:id/upvote | Toggle upvote on issue | Private |
| PUT | /:id/status | Update issue status | Admin |
| DELETE | /:id | Delete resolved issue | Admin |
| POST | /:id/comments | Add comment | Private |
| GET | /:id/comments | Get comments | Public |

**Clubs — /api/clubs**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | / | Get all clubs | Public |
| POST | / | Create club | Admin |

**Alumni — /api/alumni**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | / | Get all alumni | Public |
| POST | / | Create alumni record | Admin |

**Events — /api/events**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | / | Get all events | Public |
| POST | / | Create event with poster | Admin |
| GET | /:id | Get single event details | Public |
| DELETE | /:id | Delete event | Admin |
| GET | /:id/discussions | Get event discussions | Public |
| POST | /:id/discussions | Post discussion message | Private |
| DELETE | /:eventId/discussions/:discussionId | Delete discussion message | Private/Admin |

---

## AI Duplicate Detection Flow

```
User fills issue title and description
              ↓
Clicks Post Issue
              ↓
Backend generates semantic embedding via Gemini Embeddings API
              ↓
MongoDB Atlas Vector Search finds similar issues using cosine similarity
              ↓
Similarity >= 85% threshold?
        ↓               ↓
       Yes              No
        ↓               ↓
Show modal with     Create issue normally
similar issues
        ↓
User chooses:
  Upvote existing  →  Upvotes that issue instead
  Post Anyway      →  Creates new issue
  Cancel           →  Returns to form
```

---

## Authentication Flow

```
Student fills registration form
        ↓
OTP sent to registered email
stored in Redis, valid for 10 minutes
        ↓
Student enters 6-digit OTP
        ↓
Email verified, OTP deleted from Redis
        ↓
Account created and JWT issued
        ↓
JWT stored in localStorage
        ↓
All protected API requests carry Bearer token
        ↓
Backend validates token on every protected route
```

---

## Admin Access

There is no separate admin login. The user who registers and logs in with the email `admin@gmail.com` is treated as admin.

Admin privileges include:
- Updating issue status (Pending, In Progress, Resolved)
- Deleting resolved issues
- Creating campus events with poster images
- Deleting any event discussion message
- Creating clubs via API
- Creating alumni records via API

---

## Deployment Notes

| Layer | Service | Details |
|-------|---------|---------|
| Frontend | Vercel | Root directory set to `frontend` |
| Backend | Render | Root directory set to `backend` |
| Database | MongoDB Atlas | Free M0 cluster, IP whitelist set to 0.0.0.0/0 |
| Cache | Render Redis | Free instance, internal URL used |
| Images | Cloudinary | Free tier, folders — `uniconnect/issues` and `uniconnect/events` |
| Vector Index | MongoDB Atlas | `issue_vector_index` with 3072 dimensions, cosine similarity |

Every push to the `main` branch triggers automatic redeployment on both Vercel and Render.

---

## Author

**M. Eekshith Kumar**

GitHub — https://github.com/M-EEKSHITHKUMAR

---

*If you found this project helpful, consider giving it a star on GitHub.*
