# FlowLedger — Personal Budget Tracker

A modern, full-stack personal finance management application with a premium SaaS-grade UI. Track income, expenses, and savings with beautiful charts and real-time insights.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)

---

## ✨ Features

### Authentication
- 🔐 JWT-based authentication (register, login, logout)
- 🔒 Password hashing with bcrypt (12 salt rounds)
- 🛡️ Protected routes with automatic token refresh

### Budget Tracking
- ➕ Create, edit, and delete transactions
- 📊 Income and expense categorization
- 🏷️ Default categories + custom user categories
- 📅 Date-based transaction tracking
- 📝 Optional notes for each transaction

### Dashboard
- 💵 Summary cards (Total Income, Expenses, Balance, Monthly Savings)
- 🥧 Expense breakdown pie chart
- 📈 Monthly income vs expense bar chart (6-month trend)
- 📋 Recent transactions list

### Filtering & Search
- 🔍 Search transactions by title
- 📅 Filter by date range
- 🏷️ Filter by category
- 💰 Filter by type (Income/Expense)

### UI/UX
- 🌙 Dark/Light mode toggle with system preference detection
- 📱 Fully responsive (Mobile, Tablet, Desktop)
- ✨ Glassmorphic cards with subtle animations
- 🎨 Premium gradient accents
- ⚡ Skeleton loading states
- 🍞 Toast notifications
- 🛡️ Error boundaries

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite 8 | Build tool |
| Tailwind CSS v4 | Utility-first styling |
| React Router 7 | Client-side routing |
| Recharts | Data visualization |
| Axios | HTTP client |
| Lucide React | Icon library |
| Zod | Runtime validation |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime |
| Express 5 | HTTP framework |
| TypeScript | Type safety |
| Prisma ORM | Database access |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Zod | Request validation |

### Database
| Technology | Purpose |
|-----------|---------|
| PostgreSQL | Relational database |
| Neon | Serverless PostgreSQL hosting |

---

## 📁 Project Structure

```
azentrix-fullstack-task1/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/              # Shared UI components
│   │   │   └── ErrorBoundary.tsx
│   │   ├── features/                # Feature-based modules
│   │   │   ├── auth/
│   │   │   │   ├── components/      # Login & Register forms
│   │   │   │   ├── hooks/           # useAuth context
│   │   │   │   └── services/        # Auth API calls
│   │   │   ├── dashboard/
│   │   │   │   ├── components/      # Charts & summary cards
│   │   │   │   └── services/        # Dashboard API calls
│   │   │   └── transactions/
│   │   │       ├── components/      # List, form, filters
│   │   │       └── services/        # Transaction & category API
│   │   ├── hooks/                   # Global hooks (toast, theme)
│   │   ├── layouts/                 # Auth & Dashboard layouts
│   │   ├── lib/                     # Utilities (cn, formatters)
│   │   ├── pages/                   # Page components
│   │   ├── routes/                  # Router & protected routes
│   │   ├── services/                # Axios instance
│   │   └── types/                   # TypeScript interfaces
│   ├── vite.config.ts
│   └── vercel.json
│
├── server/                          # Express backend
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema
│   │   └── seed.ts                  # Default categories seeder
│   ├── src/
│   │   ├── config/                  # DB & env configuration
│   │   ├── middleware/              # Auth, validation, errors
│   │   ├── modules/
│   │   │   ├── auth/                # Register, login, profile
│   │   │   ├── categories/          # List & create categories
│   │   │   ├── dashboard/           # Summary & chart data
│   │   │   └── transactions/        # Full CRUD + filters
│   │   ├── routes/                  # Route aggregator
│   │   └── utils/                   # Response helpers & errors
│   └── render.yaml
│
├── package.json                     # Root workspace scripts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 20.x
- npm ≥ 10.x
- A PostgreSQL database (Neon recommended — free tier)

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/azentrix-fullstack-task1.git
cd azentrix-fullstack-task1
```

### 2. Set Up the Database

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the **connection strings** from the dashboard

### 3. Configure Environment Variables

```bash
# Server environment
cp server/.env.example server/.env
```

Edit `server/.env` with your Neon credentials:
```env
DATABASE_URL="postgresql://user:password@endpoint-pooler.region.aws.neon.tech/dbname?sslmode=require"
DIRECT_URL="postgresql://user:password@endpoint.region.aws.neon.tech/dbname?sslmode=require"
JWT_SECRET="your-secure-random-secret-at-least-32-chars"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
CLIENT_URL="http://localhost:5173"
```

### 4. Install Dependencies

```bash
# Install all dependencies (root + client + server)
npm run install:all
```

### 5. Set Up the Database Schema

```bash
cd server
npx prisma migrate dev --name init
npx prisma db seed
```

> **Note:** The seed script creates default categories (Salary, Freelance, Food, Travel, etc.)

### 6. Run the Application

```bash
# From the root directory — runs both client and server
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user profile |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | List transactions (with filters & pagination) |
| GET | `/api/transactions/:id` | Get single transaction |
| POST | `/api/transactions` | Create transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories (default + custom) |
| POST | `/api/categories` | Create custom category |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/summary` | Financial summary |
| GET | `/api/dashboard/expense-breakdown` | Category-wise expenses |
| GET | `/api/dashboard/monthly-trend` | 6-month income vs expense |

---

## 🌐 Deployment Guide

### Database — Neon PostgreSQL
1. Create a Neon account at [neon.tech](https://neon.tech)
2. Create a new project → select a region close to your server
3. Copy the **pooled** and **direct** connection strings

### Backend — Render
1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repository, set root directory to `server/`
4. Build Command: `npm install && npx prisma generate && npx tsc`
5. Start Command: `node dist/index.js`
6. Add environment variables:
   - `DATABASE_URL` — Neon pooled connection string
   - `DIRECT_URL` — Neon direct connection string
   - `JWT_SECRET` — Generate a secure random string
   - `CLIENT_URL` — Your Vercel frontend URL
   - `NODE_ENV` — `production`

### Frontend — Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo, set root directory to `client/`
3. Framework: Vite
4. Add environment variable:
   - `VITE_API_URL` — Your Render backend URL (e.g., `https://your-api.onrender.com/api`)
5. Deploy!

---

## 🗄️ Database Schema

```
┌──────────┐       ┌──────────────┐       ┌───────────────┐
│   User   │       │   Category   │       │  Transaction  │
├──────────┤       ├──────────────┤       ├───────────────┤
│ id       │──┐    │ id           │──┐    │ id            │
│ name     │  │    │ name         │  │    │ title         │
│ email    │  │    │ type         │  │    │ amount        │
│ password │  ├───▶│ isDefault    │  ├───▶│ type          │
│ createdAt│  │    │ userId (FK)  │  │    │ date          │
└──────────┘  │    │ createdAt    │  │    │ notes         │
              │    └──────────────┘  │    │ categoryId(FK)│
              │                      │    │ userId (FK)   │
              └──────────────────────┘    │ createdAt     │
                                          └───────────────┘
```

---

## 📋 Environment Variables

### Server (`server/.env`)
| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon pooled connection string | ✅ |
| `DIRECT_URL` | Neon direct connection string | ✅ |
| `JWT_SECRET` | Secret key for JWT signing | ✅ |
| `JWT_EXPIRES_IN` | Token expiration (default: `7d`) | ❌ |
| `PORT` | Server port (default: `5000`) | ❌ |
| `NODE_ENV` | Environment (`development`/`production`) | ❌ |
| `CLIENT_URL` | Frontend URL for CORS | ✅ |

### Client (`client/.env`)
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | ❌ (uses proxy in dev) |

---

## 🧪 Validation Rules

### Authentication
- Email: Valid email format
- Password: Minimum 8 characters
- Name: 2-50 characters

### Transactions
- Title: Required, max 100 characters
- Amount: Must be greater than zero
- Category: Required
- Date: Required, valid date format
- Notes: Optional, max 500 characters

---

## 📄 License

This project is built for the Azentrix internship selection task.

---

## 👤 Author

**Prasanth Golla**
