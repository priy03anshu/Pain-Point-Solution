# PlacementOS — AI-Powered Placement Preparation Platform

> **Diagnosis → Guidance → Practice → Feedback → Progress**  
> A personal career intelligence command center for students of **ANY** degree background (BTech, BCA, MCA, BBA, MBA, BCom, BSc, BA, Diploma, or custom).

---

## 🏗 Architecture & Tech Stack

PlacementOS is structured as a production-grade modular monorepo:

- **Frontend (`apps/web`)**: Next.js (App Router), TypeScript, Tailwind CSS, TanStack Query, Recharts, Lucide Icons.
- **Backend API (`apps/api`)**: Node.js, Express, TypeScript, Mongoose (19 schema models), REST, JWT with refresh rotation, Zod validation, rate limiting, and Helmet.
- **AI Microservice (`apps/ai-service`)**: Python 3.11, FastAPI, Pydantic, scikit-learn, pandas, NumPy, provider-agnostic LLM interface with fallback mocking.
- **Shared Library (`packages/shared`)**: Shared TypeScript types, Zod schemas, scoring constants, and contracts.
- **Database**: MongoDB 7.0 (Mongoose schemas with indexes for high-speed queries).
- **Cache & Queue**: Redis 7.2 & BullMQ architecture (with local fallback).

---

## 🚀 Quick Start (Local Run)

### 1. Prerequisites
- **Node.js**: v18+ (verified on Node.js v26)
- **MongoDB**: Running locally on port 27017 or remote URI
- **Python**: v3.10+ (for AI microservice)

### 2. Install Dependencies
```bash
# In monorepo root:
npm install
```

### 3. Build Shared Packages
```bash
npm run build --workspace=packages/shared
```

### 4. Seed Database with Questions & Sample Accounts
```bash
npm run seed
```
This populates:
- Curated adaptive diagnostic questions (Technical, Aptitude, Communication)
- Company recruitment profiles (Google, Microsoft, Amazon, Razorpay)
- Default Student: `student@placementos.com` / `Placement@123`
- Default Admin: `admin@placementos.com` / `Placement@123`

### 5. Run the Services
You can run the API, Web frontend, and AI microservice in separate terminals:

```bash
# Terminal 1: Backend API (Port 5000)
npm run dev:api

# Terminal 2: Next.js Frontend (Port 3000)
npm run dev:web

# Terminal 3: Python FastAPI Microservice (Port 8000)
npm run dev:ai
```

Open your browser at **[http://localhost:3000](http://localhost:3000)**.

---

## 🐳 Running with Docker Compose

To launch all containers (MongoDB, Redis, API, Web, AI Service) in one command:

```bash
docker compose -f docker/docker-compose.yml up --build
```

---

## 🧪 Running Automated Tests

Run the unit and integration test suite:

```bash
npm test
```

Tests verify:
- Deterministic readiness scoring formula and weight sum invariants
- Dynamic role weighting adjustments (Engineering vs Business vs Product)
- Top 3 improvement opportunities ranking logic
- Password hashing and JWT access & refresh token signing
- Public health and landing stats integration endpoints
- Request validation and security protections

---

## 📊 Phase 1 Deliverables Summary

1. **Public Landing Page (`/`)**:
   - Hero: *"Prepare Smarter. Get Placement Ready."*
   - Problem diagnosis, 5-phase loop, 8-dimension readiness breakdown, preview widgets, and FAQ.
2. **Authentication & Security (`/login`, `/register`)**:
   - Password hashing with Bcrypt
   - JWT access + refresh tokens with rotation
   - Rate limiting & Zod input validation
3. **Multi-Step Onboarding (`/onboarding`)**:
   - Degree, College, Graduation Year, Semester (free-text with suggestions)
   - Custom skills roster with interactive proficiency sliders
   - Target roles and dream companies
   - Placement deadline & daily time budget
4. **Adaptive Initial Assessment Runner (`/assessment`)**:
   - Timed, adaptive multi-category diagnostic runner
   - Immediate deterministic scoring, topic weakness identification, and diagnostic report
5. **Command Center Dashboard (`/dashboard`)**:
   - Overall Readiness Score Gauge (0-100%) and Tier badge
   - 8-Dimension Category Competency Bar Chart
   - Primary Placement Risk alert card
   - Top 3 Improvement Opportunities (potential point gains)
   - Today's Tasks preview with interactive completion toggles
   - Streak and XP counter
