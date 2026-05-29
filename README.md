# DATA FLOW | AI & Software Solutions

A premium futuristic startup website for **DATA FLOW** featuring a cyber-tech design system (neon glowing panels, glassmorphism cards, interactive particle grids) with fully integrated Node.js + Express backend and MongoDB schemas.

## Tech Stack

- **Frontend**: React + Vite, Tailwind CSS v4, Lucide Icons, React Router
- **Backend**: Node.js, Express, ES Modules, Multer (file uploads)
- **Database**: MongoDB (Mongoose schemas)
- **Auth**: JWT, bcryptjs

---

## Workspace Architecture

```
Dataflow/
├── backend/
│   ├── config/
│   │   ├── db.js          # MongoDB Mongoose connection
│   │   └── seeder.js      # Automatic database pre-seeding
│   ├── controllers/       # Controller APIs (Auth, Orders, Projects, etc)
│   ├── middleware/        # JWT Authentication protectors
│   ├── models/            # MongoDB Schemas (User, Service, Order, Project, Feedback)
│   ├── routes/            # Express Routes
│   ├── uploads/           # Client files storage
│   ├── .env               # Server environment configurations
│   ├── package.json
│   └── server.js          # Server entry point
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/    # Navbar, Footer, Floating Chatbot Widget
    │   ├── pages/         # Landing, Login, Signup, Order, Status Tracker, Admin Dashboard
    │   ├── services/      # api.js fetch wrappers
    │   ├── App.css
    │   ├── App.jsx
    │   ├── index.css      # Custom Cyber-Tech styling configurations
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## Execution Guide

### 1. Prerequisite
Ensure MongoDB is running locally on:
`mongodb://localhost:27017`

### 2. Startup the Backend Server
Run the following commands:
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Run server in dev mode
npm run dev
```
*The server will run on `http://localhost:5000` and automatically populate the database.*

### 3. Startup the Frontend React Server
Open a new terminal window and run:
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```
*The React app will launch on `http://localhost:5173`.*

---

## Credentials & Seeding

The database auto-seeds on initial launch:
- **Default Admin Account**:
  - **Email**: `admin@dataflow.io`
  - **Password**: `admin123`
- **Initial Showcase Projects**: 4 seeded projects (AI/ML, Web, Research, Mobile).
- **Initial Services**: 7 seeded services (Documentation, AI/ML, Logo design, Web development, Research papers, Mini/Major projects).
