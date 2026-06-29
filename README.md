# DSA Revision Reminder

> Never forget to revise your LeetCode problems — powered by spaced repetition.

Track coding problems you've solved, get automatic reminders when it's time to revise them, and build long-term retention. Built with React, Node.js, and MongoDB.

## Features

| Feature | Description |
|---------|-------------|
| **Demo Login** | Click **"Demo Login"** to instantly explore the app with 10 pre-seeded problems — no registration needed |
| **JWT Authentication** | Register or login with secure token-based access, each user's data is isolated |
| **Spaced Repetition** | Auto-schedules reviews at 3, 10, 30, and 90 day intervals based on the optimal forgetting curve |
| **Add Problems** | Log solved problems with name, link, difficulty, pattern, and date |
| **Review Tracking** | Click "Mark as Revised" to advance to the next interval |
| **Daily Email Reminders** | Cron job sends a morning email listing all problems due for review that day |
| **Responsive Dashboard** | Full table view with pagination, difficulty badges, and due-date highlighting |

---

## Demo

Click **"Demo Login"** on the sign-in page to instantly enter the app. A demo account is auto-created on first use with these pre-loaded problems:

| Problem | Difficulty | Pattern | Review Count |
|---------|:----------:|---------|:------------:|
| Two Sum | `Easy` | Hash Map | 1 |
| Valid Parentheses | `Easy` | Stack | 0 |
| Merge Two Sorted Lists | `Easy` | Linked List | 0 |
| Maximum Subarray | `Medium` | Kadane's Algorithm | 2 |
| Binary Tree Level Order Traversal | `Medium` | BFS | 1 |
| Longest Substring Without Repeating Characters | `Medium` | Sliding Window | 0 |
| LRU Cache | `Medium` | Design | 1 |
| Number of Islands | `Medium` | DFS | 0 |
| Median of Two Sorted Arrays | `Hard` | Binary Search | 3 |
| Trapping Rain Water | `Hard` | Two Pointers | 2 |

---

## Tech Stack

| Layer | Technology | Badge |
|-------|-----------|-------|
| Frontend | React 18 + Vite 6 | ![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white) |
| Backend | Node.js + Express 4 | ![Node](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white) |
| Database | MongoDB + Mongoose 8 | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white) |
| Auth | bcryptjs + JWT | ![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white) |
| Emails | Nodemailer (Gmail SMTP) | ![Gmail](https://img.shields.io/badge/Gmail-EA4335?logo=gmail&logoColor=white) |
| Scheduler | node-cron | ![Cron](https://img.shields.io/badge/Cron-000000?logo=clock&logoColor=white) |

---

## Demo Login

The **"Demo Login"** button on the sign-in page lets anyone try the full app in one click:

1. Click **"Demo Login"** on the auth form
2. The app auto-creates a demo user (`demo@example.com`) and seeds **10 realistic LeetCode problems** with staggered review dates
3. You're logged in immediately — no email or password needed
4. All features work: add problems, mark revised, see due dates

On subsequent clicks, the same demo account is reused (problems are not duplicated).

---

## Project Structure

```
backend/
├── controllers/          # Route handlers (auth, problems)
│   ├── authController.js
│   └── problemController.js
├── cron/                 # Scheduled job (daily email)
│   └── scheduler.js
├── middleware/            # JWT auth middleware
│   └── auth.js
├── models/               # Mongoose schemas
│   ├── Problem.js
│   ├── User.js
│   └── CronLog.js
├── routes/               # Express route definitions
│   ├── authRoutes.js
│   └── problemRoutes.js
├── scripts/              # Utility scripts
│   └── migrateLegacyProblemsToUser.js
├── services/             # Email sending logic
│   └── emailService.js
├── server.js             # Application entry point
└── package.json

frontend/
├── src/
│   ├── api/              # Axios API client + interceptors
│   │   └── problemApi.js
│   ├── components/       # React components
│   │   ├── AuthForm.jsx
│   │   ├── AddProblemForm.jsx
│   │   └── ProblemTable.jsx
│   ├── App.jsx           # Root component with auth flow
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|:----:|
| `POST` | `/api/auth/register` | Create a new account | — |
| `POST` | `/api/auth/login` | Login with email & password | — |
| `POST` | `/api/auth/demo-login` | Instant demo access (creates user + seeds data on first call) | — |

### Problems (all require Bearer token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/problems` | Get all problems for the logged-in user |
| `POST` | `/api/problems` | Add a new problem |
| `POST` | `/api/problems/:id/review` | Mark a problem as revised (advances next review date) |
| `GET` | `/api/problems/due` | Get problems due for review today |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required |
|----------|-------------|:--------:|
| `PORT` | Server port (default `5000`) | |
| `MONGO_URI` | MongoDB connection string | ✅ |
| `EMAIL_USER` | Gmail address for sending reminders | For email |
| `EMAIL_PASS` | Gmail App Password | For email |
| `CLIENT_URL` | Frontend URL (for CORS) | ✅ |
| `JWT_SECRET` | Secret key for signing JWT tokens | ✅ |

### Frontend (`frontend/.env`)

| Variable | Description | Required |
|----------|-------------|:--------:|
| `VITE_API_URL` | Backend URL (leave empty for proxy in dev) | |

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))
- Gmail account with [App Password](https://support.google.com/accounts/answer/185833) (for email reminders)

### 1. Clone

```bash
git clone https://github.com/AkshatSinghNayal/LeetCodeHelper.git
cd LeetCodeHelper
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, etc.
npm run dev
```

Server starts at `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App opens at `http://localhost:5173`.

---

## Scripts

### Backend

| Script | Command | Description |
|--------|---------|-------------|
| Dev server | `npm run dev` | Start with nodemon (hot reload) |
| Production | `npm start` | Start with node |
| Generate JWT secret | `npm run generate:jwt-secret` | Print a cryptographically random secret |
| Migrate legacy problems | `npm run migrate:legacy-problems -- --email user@example.com` | Attach old (pre-auth) problems to a user |

### Frontend

| Script | Command | Description |
|--------|---------|-------------|
| Dev server | `npm run dev` | Start Vite dev server |
| Build | `npm run build` | Production build |
| Preview | `npm run preview` | Preview production build |

---

## Deployment

### Backend (Render)

1. Push repo to GitHub
2. Create **Web Service** on [Render](https://render.com)
3. Root Directory: `backend`
4. Build: `npm install`
5. Start: `npm start`
6. Add env vars: `PORT`, `MONGO_URI`, `EMAIL_USER`, `EMAIL_PASS`, `CLIENT_URL`, `JWT_SECRET`

### Frontend (Vercel)

1. Import repo on [Vercel](https://vercel.com)
2. Root Directory: `frontend`
3. Build: `npm run build`
4. Output: `dist`
5. Env: `VITE_API_URL` = your Render backend URL

---

## Spaced Repetition Intervals

| Review Cycle | Interval After |
|:------------:|:--------------:|
| 1st | 3 days |
| 2nd | 10 days |
| 3rd | 30 days |
| 4th+ | 90 days |

---

## License

[MIT](LICENSE)
