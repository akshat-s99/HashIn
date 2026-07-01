# HashIn 🔗

> A professional networking platform for developers to connect, network, and showcase projects.

[![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue)](#) [![Architecture](https://img.shields.io/badge/Pattern-MVC--S-green)](#) [![Auth](https://img.shields.io/badge/Auth-JWT-orange)](#)

---

## 🎯 What is HashIn?

HashIn is a skill-based professional networking platform where developers can:
- **Discover** peers through a swipe-based skill-matching engine
- **Connect** professionally via connection requests
- **Share** updates through a text-based feed
- **Showcase** their skills, projects, and experience

## 🏗️ Architecture

This project follows a **Service-Oriented MVC (MVC-S)** pattern:

```
Route → Middleware → Controller → Service → Model → Database
```

- **Routes**: URL → middleware chain → controller mapping
- **Controllers**: HTTP concerns only (thin layer)
- **Services**: All business logic (DiscoveryService, SocialService, ContentService)
- **Models**: Mongoose schemas and data access

## 📁 Project Structure

```
HashIn/
├── server/          # Express.js API (Node.js)
│   └── src/
│       ├── config/       # DB, env, constants
│       ├── middleware/    # Auth, validation, rate limiting, error handling
│       ├── models/       # Mongoose schemas
│       ├── routes/       # API route definitions
│       ├── controllers/  # HTTP request handlers
│       ├── services/     # Business logic layer
│       ├── validators/   # Zod schemas
│       └── utils/        # JWT, password, response helpers
├── client/          # React SPA (Vite)
│   └── src/
│       ├── components/   # Feature-organized components
│       ├── pages/        # Page-level components
│       ├── context/      # Auth state management
│       ├── hooks/        # Custom React hooks
│       └── api/          # Axios API client
└── docs/            # Documentation
    ├── requirements.md
    ├── design.md
    ├── api-spec.md
    ├── database-design.md
    └── testing-strategy.md
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Bootstrap 5, Vanilla CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | JWT (access + refresh tokens) |
| **Validation** | Zod |
| **Security** | Helmet, CORS, express-rate-limit |

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

### Setup

```bash
# Clone the repo
git clone <repo-url>
cd HashIn

# Backend
cd server
cp .env.example .env    # Configure your environment variables
npm install
npm run dev

# Frontend (new terminal)
cd client
npm install
npm run dev
```

### Environment Variables

```env
# server/.env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hashin
ACCESS_TOKEN_SECRET=your-access-secret
REFRESH_TOKEN_SECRET=your-refresh-secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## 📋 Feature Roadmap

| Phase | Features | Status |
|-------|----------|--------|
| **P0** | JWT Auth, Profile CRUD, Discovery Engine, Connections, Text Feed, Security | 🔨 In Progress |
| **P1** | Google OAuth, Image/Video Posts, Real-time Chat, Admin Dashboard | 📋 Planned |
| **P2** | Theme Switching, Aggregation Pipelines, Advanced Analytics | 📋 Future |

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [requirements.md](docs/requirements.md) | Functional & non-functional requirements |
| [design.md](docs/design.md) | System architecture & design decisions |
| [api-spec.md](docs/api-spec.md) | REST API specification |
| [database-design.md](docs/database-design.md) | MongoDB schema & indexing strategy |
| [testing-strategy.md](docs/testing-strategy.md) | Testing approach & coverage plan |

## 📄 License

This project is developed as part of an academic project.
