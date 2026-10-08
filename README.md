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

Run the complete application using:

```bash
docker compose -f docker/docker-compose.yml up --build
```

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
