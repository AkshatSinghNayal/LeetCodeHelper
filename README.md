# DSA Revision Reminder

A web application that reminds you to revise solved coding problems using **spaced repetition**. Add a problem you solved and the system automatically schedules revision reminders and sends email notifications when it is time to solve it again.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) |
| Backend | Node.js + Express |
| Database | MongoDB (Atlas compatible) |
| Email | Nodemailer (Gmail SMTP) |
| Scheduler | node-cron |

## Features

- **Add Solved Problems** — submit problem name, link, difficulty, pattern, and solved date
- **Spaced Repetition** — automatic review scheduling at 3, 10, 30, and 90 day intervals
- **Daily Email Reminders** — cron job sends an email listing problems due for review
- **Dashboard** — view all problems in a table with a "Mark as Revised" button
- **Responsive UI** — works on desktop and mobile

## Project Structure

```
backend/
├── controllers/       # Route handlers
│   └── problemController.js
├── cron/              # Scheduled jobs
│   └── scheduler.js
├── models/            # Mongoose schemas
│   └── Problem.js
├── routes/            # Express routes
│   └── problemRoutes.js
├── services/          # Business logic
│   └── emailService.js
├── server.js          # Entry point
├── package.json
└── .env.example

frontend/
├── src/
│   ├── api/           # Axios API layer
│   │   └── problemApi.js
│   ├── components/    # React components
│   │   ├── AddProblemForm.jsx
│   │   └── ProblemTable.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── vite.config.js
├── package.json
└── .env.example
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/problems` | Add a new problem |
| `GET` | `/api/problems` | Get all problems |
| `POST` | `/api/problems/:id/review` | Mark a problem as revised |
| `GET` | `/api/problems/due` | Get problems due for review today |

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dsa-reminder` |
| `EMAIL_USER` | Gmail address for sending reminders | `you@gmail.com` |
| `EMAIL_PASS` | Gmail App Password | `xxxx xxxx xxxx xxxx` |
| `CLIENT_URL` | Frontend URL (for CORS) | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL (leave empty for dev proxy) | `https://your-backend.onrender.com` |

## Running Locally

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Gmail account with [App Password](https://support.google.com/accounts/answer/185833) enabled

### 1. Clone the repository

```bash
git clone https://github.com/AkshatSinghNayal/LeetCodeHelper.git
cd LeetCodeHelper
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

The backend will start on `http://localhost:5000`.

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173` with API requests proxied to the backend.

## Deployment

### Deploy Backend to Render

1. Push the repository to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set the **Root Directory** to `backend`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start`
6. Add environment variables: `PORT`, `MONGO_URI`, `EMAIL_USER`, `EMAIL_PASS`, `CLIENT_URL`

### Deploy Frontend to Vercel

1. Import the repository on [Vercel](https://vercel.com)
2. Set the **Root Directory** to `frontend`
3. Set **Build Command**: `npm run build`
4. Set **Output Directory**: `dist`
5. Add environment variable: `VITE_API_URL` = your Render backend URL

### Configure MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Whitelist `0.0.0.0/0` for network access (or specific IPs)
4. Copy the connection string and set it as `MONGO_URI`

### Configure Gmail

1. Enable 2-Step Verification on your Google Account
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Use your Gmail address as `EMAIL_USER` and the App Password as `EMAIL_PASS`

## Scripts

### Backend

| Script | Command | Description |
|--------|---------|-------------|
| Development | `npm run dev` | Start with nodemon (auto-reload) |
| Production | `npm start` | Start with node |

### Frontend

| Script | Command | Description |
|--------|---------|-------------|
| Development | `npm run dev` | Start Vite dev server |
| Build | `npm run build` | Build for production |
| Preview | `npm run preview` | Preview production build |

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.