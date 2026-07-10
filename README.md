# UniConnect

## Overview

UniConnect is a campus engagement platform that brings students, administrators, clubs, and alumni together in one place. Students can report campus issues, track their resolution, discover student organizations, and connect with alumni — all through a clean and modern interface.

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
- Password hashing using bcrypt
- Protected routes on both frontend and backend
- Role-based admin access via email detection

**Campus Issue Reporting**
- Create issues with title, description, and optional image
- Upvote and un-upvote issues (duplicate votes prevented server-side)
- Comment on issues for community discussion
- Track issue status — Pending, In Progress, Resolved
- Image uploads stored on Cloudinary (persistent across deployments)

**Trending Issues**
- Dedicated trending page showing top 10 most-upvoted Pending issues from the last 24 hours
- Trending sidebar visible on the home dashboard in real time

**Clubs Directory**
- Browse campus clubs with contact details
- Admin-managed club creation via API

**Alumni Network**
- Explore alumni profiles with graduation year, company, and role
- Direct contact via email and phone links
- Admin-managed alumni records via API

**UI and UX**
- LinkedIn-style 3-column dashboard layout
- Left sidebar with user profile and stats
- Right sidebar with live trending issues
- Skeleton loading states across all pages
- Toast notifications for all user actions
- Fully responsive across mobile, tablet, and desktop
- Zero page-flicker navigation using Redux store caching

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

**Deployment**
- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database
- Cloudinary — Image storage

---

## Getting Started

**Prerequisites**
- Node.js v18 or above
- MongoDB local instance or MongoDB Atlas account
- Gmail account with App Password enabled
- Cloudinary free account

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

Create a `.env` file inside the `backend` folder:
Start the backend:

```bash
npm run dev
```

**Frontend setup**

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder:

Start the frontend:

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

---

---

## Admin Access

There is no separate admin login. The user who registers and logs in with the email `admin@gmail.com` is treated as admin.

Admin privileges include:
- Updating issue status (Pending, In Progress, Resolved)
- Deleting resolved issues
- Creating clubs via API
- Creating alumni records via API

---

## Deployment Notes

| Layer | Service | Details |
|-------|---------|---------|
| Frontend | Vercel | Root directory set to `frontend` |
| Backend | Render | Root directory set to `backend` |
| Database | MongoDB Atlas | Free M0 cluster, IP whitelist set to 0.0.0.0/0 |
| Images | Cloudinary | Free tier, images stored under `uniconnect/issues` |

Every push to the `main` branch triggers automatic redeployment on both Vercel and Render.

---

## Author

**M. Eekshith Kumar**

GitHub — https://github.com/M-EEKSHITHKUMAR

---

*If you found this project helpful, consider giving it a star on GitHub.*
