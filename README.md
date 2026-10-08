# 🚀 PlacementOS

### AI-Powered Placement Preparation Platform

> **Practice. Improve. Get Placement Ready.**

PlacementOS is an AI-powered platform that helps students prepare for placements through **GD practice, quizzes, skill preparation, personalized feedback, and progress tracking**.

---

## ✨ Features

* 🗣️ **GD Practice** — Improve communication, confidence, reasoning, and presentation.
* 🧠 **AI Quizzes** — Practice technical and aptitude-based questions.
* 📚 **Skill Preparation** — Build skills required for target roles.
* 🎯 **Personalized Preparation** — Identify weak areas and focus on improvement.
* 📊 **Progress Tracking** — Monitor performance and preparation over time.
* 🤖 **AI Guidance** — Get personalized feedback and recommendations.

---

## 🔄 How It Works

```text
Student
   ↓
Assessment
   ↓
Weakness Detection
   ↓
Practice
(GD • Quiz • Skills)
   ↓
AI Evaluation
   ↓
Personalized Feedback
   ↓
Progress Tracking
   ↓
Improvement
```

---

## 🏗️ Architecture

```text
                    ┌──────────────┐
                    │    Student   │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │   Next.js    │
                    │  Frontend    │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │ Node +       │
                    │ Express API  │
                    └───┬──────┬───┘
                        │      │
              ┌─────────┘      └─────────┐
              ↓                          ↓
       ┌─────────────┐            ┌─────────────┐
       │   MongoDB   │            │ AI Service  │
       │  Database   │            │ Python      │
       └─────────────┘            │  FastAPI    │
                                  └─────────────┘
                        │
                   Redis + BullMQ
                    Cache / Queue
```

---

## 🛠️ Tech Stack

| Layer          | Technology                        |
| -------------- | --------------------------------- |
| Frontend       | Next.js, TypeScript, Tailwind CSS |
| Backend        | Node.js, Express, TypeScript      |
| AI Service     | Python, FastAPI                   |
| Database       | MongoDB                           |
| Cache          | Redis                             |
| Queue          | BullMQ                            |
| Authentication | JWT                               |

### Technology Flow

```text
Next.js
   ↓
Node.js + Express
   ↓
┌──────────────┬──────────────┐
↓              ↓              ↓
MongoDB      Redis/BullMQ   FastAPI
Database      Cache/Queue   AI Service
```

---

## 📁 Project Structure

```text
PlacementOS/
│
├── apps/
│   ├── web/              # Next.js frontend
│   ├── api/              # Node.js + Express backend
│   └── ai/               # Python + FastAPI AI service
│
├── packages/
│   └── shared/           # Shared types & utilities
│
├── docker/
│   └── docker-compose.yml
│
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js 18+
* MongoDB
* Python 3.10+
* Git
* npm

### Installation

```bash
git clone <your-repository-url>
cd PlacementOS

npm install
npm run build --workspace=packages/shared
npm run seed
```

### Run Services

Open separate terminals:

```bash
npm run dev:api
```

```bash
npm run dev:web
```

```bash
npm run dev:ai
```

Open **http://localhost:3000**

---

## 🐳 Docker

Copy `.env.example` to `.env`, set unique random values for
`JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and `AI_SERVICE_SECRET`, and provide
an `LLM_PROVIDER` credential if you enable a hosted AI provider. The secrets
must not be checked into source control. Then run:

```bash
docker compose -f docker/docker-compose.yml up --build
```

Only the web service is bound to host loopback; the API, database, Redis, and
AI service stay on the private Compose network. Use a TLS-terminating reverse
proxy in front of the web service when hosting this stack publicly.

## 🌐 Production deployment

The web app sends API requests to its own `/api/v1` origin. Its Next.js server
proxies those requests to the API service, so the API address is not embedded
in the browser bundle.

On Render, deploy the Next.js app as a **Web Service** (not a Static Site) and
set `API_URL` in that service's environment to the API service's reachable
origin, without `/api/v1` (for example, `https://your-api.example.com` or the
private service URL when both services are in the same region). Do not set it
to `localhost` for a hosted deployment. The current Render web deployment
returns an “API service is not configured” response until this variable is
set, so GD sessions, sign-in, and other API-backed features will not work
before configuration.

Also configure the API service with a persistent MongoDB connection string,
unique `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` values of at least 32
characters, `WEB_URL` set to the web service's public origin, and the correct
AI service settings. Select a real AI provider and configure its API key for
production rather than using the development `mock` provider. Keep secrets in
Render's environment settings rather than source control. In Docker Compose,
`API_URL=http://api:5000` is set for the private service network; local
non-Docker development defaults to `http://localhost:5000`.

---

## 🎯 Core Concept

PlacementOS follows a continuous preparation cycle:

```text
Diagnose
   ↓
Practice
   ↓
Evaluate
   ↓
Improve
   ↓
Track Progress
   ↓
Repeat
```

> **Don't just practice more. Practice what you need to improve.**

---

## 🔮 Future Scope

* 🎤 AI Mock Interviews
* 🗣️ Advanced GD Evaluation
* 📄 Resume Analysis
* 🎯 Job-Role Matching
* 🧠 Adaptive Question Generation
* 🏢 Company-Specific Preparation
* 📊 Advanced Analytics
* 📈 Placement Readiness Score

---

## ⭐ PlacementOS

**Practice. Improve. Get Placement Ready.**

**Diagnose → Practice → Evaluate → Improve → Get Placement Ready**
