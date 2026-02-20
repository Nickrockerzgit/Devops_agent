# AUTONOMOUS DEVOPS AGENT - RIFT 2026 HACKATHON

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Here-blue)]((https://devops-agent-h3vq.onrender.com/))
[![Video Demo](https://img.shields.io/badge/Video-LinkedIn-0077B5)]()
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
# Autonomous DevOps Agent — Consolidated Documentation

This repository contains an Autonomous DevOps Agent built for the RIFT 2026 Hackathon. The agent automates repository analysis, test execution, failure classification, fix generation, and CI/CD monitoring. The repository includes a React dashboard and a Node.js backend that orchestrates agent workflows.

Table of contents

- Overview
- Live deployment
- Demo video guidance
- Architecture
- Features
- Tech stack
- Installation
- Environment
- Usage
- Supported bug types
- API reference
- Known limitations
- Team members
- Deliverables (files)
- License and contact

----

Overview

The Autonomous DevOps Agent performs the following high-level steps for a submitted repository:

- Clone the repository
- Detect language and test frameworks
- Run tests inside a sandboxed environment
- Classify test failures using AI
- Generate and apply patches where appropriate
- Commit and push fixes to a new branch
- Monitor CI/CD and iterate until success or retry limit
- Export run results as `results.json` for analysis or scoring

Live deployment

- Frontend (React dashboard): update deployment URL in this README when available.
- Backend (Agent API): update deployment URL in this README when available.

Demo video guidance

See `docs/LINKEDIN_VIDEO.md` for a full checklist and script. The video should show a short run, architecture overview, and final dashboard results. Ensure the post is public and includes repository and deployment links.

Architecture

Mermaid diagram (also available at `docs/ARCHITECTURE.mmd`):

```mermaid
flowchart LR
    subgraph Frontend
      A[React Dashboard] -->|REST / WebSocket| B[Express API]
    end

    subgraph Backend
      B --> C[Agent Service]
      C --> D[Analyzer Agent]
      C --> E[Test Runner]
      C --> F[Classifier Agent]
      C --> G[Fix Generator]
      C --> H[Git Ops]
      B --> I[Auth Service]
      B --> J[Database (Prisma)]
    end

    D --> K[GitHub Repo]
    E --> L[Docker Sandbox]
    F --> M[OpenAI GPT]
    G --> M
    H --> K

    classDef comp fill:#f9f,stroke:#333,stroke-width:1px
    class C,D,E,F,G,H comp
```

Features

- Autonomous analysis and repair workflow
- Multi-language support: JavaScript, TypeScript, Python (basic Java support)
- Bug classification and patch generation using AI
- Git integration for branch creation and commits
- Sandboxed test execution using Docker
- Results export and dashboard visualization

Tech stack

Frontend: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui

Backend: Node.js 18, Express, Prisma, MySQL, OpenAI SDK, simple-git, Docker

Installation

Prerequisites

- Node.js 18+
- npm or pnpm
- Docker (recommended for sandboxed test runs)
- MySQL 8+ (or compatible SQL database)

Backend (development)

1. Install dependencies

```bash
cd backend
npm install
```

2. Create environment file

```bash
cp .env.example .env
# Edit backend/.env: set DATABASE_URL, OPENAI_API_KEY, JWT_SECRET, GITHUB_TOKEN (if needed)
```

3. Prisma / database

```bash
cd backend
npm run db:generate   # Generates Prisma client
npm run db:migrate    # Runs migrations (development)
```

4. Start backend

```bash
cd backend
npm run dev           # nodemon src/server.js
# or for production: npm run prod
```

Frontend (development)

1. Install dependencies

```bash
cd Frontend
npm install
```

2. Configure frontend env

```bash
cd Frontend
cp .env.example .env
# Set VITE_API_URL (e.g. http://localhost:5000) and VITE_USE_REAL_BACKEND
```

3. Start frontend

```bash
cd Frontend
npm run dev
```

Build frontend

```bash
cd Frontend
npm run build
```

Docker

See `docker-compose.yml` for a recommended composition. Docker is recommended for running the sandboxed test runner and database in isolation.

Environment

Key backend variables (defaults in `backend/src/config/index.js`):

- `DATABASE_URL` — MySQL connection string, e.g. `mysql://user:pass@localhost:3306/devops_agent` (required)
- `OPENAI_API_KEY` — OpenAI API key used by the agent (required for real fixes)
- `JWT_SECRET` — JWT signing secret (change for production)
- `JWT_EXPIRES_IN` — Token expiry (default `7d`)
- `PORT` — Backend port (default `5000`)
- `FRONTEND_URL` — Frontend origin allowed for CORS (default `http://localhost:5173`)
- `GITHUB_TOKEN` — Required for authenticated Git operations on private repos
- `MAIL_HOST`, `MAIL_USER`, `MAIL_PASS`, `MAIL_FROM`, `MAIL_PORT` — Optional SMTP settings
- `AGENT_RETRY_LIMIT` — Agent iteration limit (default `5`)

Frontend env

- `VITE_API_URL` — Backend URL
- `VITE_USE_REAL_BACKEND` — `true` or `false` (simulation/demo mode)

Security notes

- Never commit secrets to source control. Use secret management offered by hosting platforms.

Usage

From the dashboard (default `http://localhost:5173`):

1. Paste repository URL
2. Enter team name and leader name
3. Click Run Agent

Expected workflow

- Clone repository
- Analyze and detect tests/failures
- Run tests in Docker sandbox
- Classify failures and generate candidate fixes
- Commit and push changes to a new branch
- Monitor CI/CD and iterate until success or retry limit
- Download `results.json` from the dashboard for submission

API examples

- `POST /api/agent/run` — Protected. Triggers an agent run for a repository.
- `POST /api/auth/register` — Register user.
- `POST /api/auth/login` — Login and obtain JWT.
- `GET /health` — Health check endpoint.

Known limitations

1. Private repo operations require `GITHUB_TOKEN`.
2. AI-generated fixes are not guaranteed; complex fixes may need manual review.
3. Large repositories may take longer; use small-to-medium repos for demos.
4. Language support is optimized for JS/TS and Python.

Team members

| Name | Role | LinkedIn |
|------|------|----------|
| Your Name | Team Lead / Full-Stack | https://www.linkedin.com/in/rishabh-jhade |
| Member 2 | Backend Engineer | https://www.linkedin.com/in/chanchal-gupta-5bb866269 |
| Member 3 | Frontend Engineer | https://www.linkedin.com/in/vikram-sen-741bab228 |
| Member 4 | DevOps / Infrastructure | https://linkedin.com/in/abhishekcse2004 |

Team name: DOMINATOR$

Deliverables (files)

- `docs/ARCHITECTURE.mmd` — architecture diagram
- `docs/LINKEDIN_VIDEO.md` — video checklist and script
- `docs/INSTALLATION.md` — installation and local deployment
- `docs/ENVIRONMENT.md` — environment variables and security notes
- `docs/USAGE.md` — usage examples and auth commands
- `docs/SUPPORTED_BUGS.md` — supported bug types and examples
- `docs/TECH_STACK.md` — tech stack rationale
- `docs/LIMITATIONS.md` — known limitations and mitigations
- `docs/TEAM.md` — team members file (update before submission)
- `docs/README_DELIVERABLES.md` — deliverables index

License

This project is licensed under the MIT License. See `LICENSE` for details.

Contact

For questions or feedback, update the contact details in this README or see `docs/TEAM.md` for team links.

4. **Performance:**
   - Large repositories (>1000 files) may take 5-10 minutes
   - OpenAI API rate limits may affect speed

5. **Language Support:**
   - Best performance with JavaScript, TypeScript, Python
   - Java support is basic

6. **Docker Requirement:**
   - Production deployment requires Docker for sandboxing
   - Local dev can run without Docker (less secure)

---

## Team Members

| Name | Role | LinkedIn |
|------|------|----------|
| **Your Name** | Team Leader, Full-Stack Dev | [Profile](https://linkedin.com/in/yourprofile) |
| **Member 2** | Backend Engineer | [Profile](https://linkedin.com/in/member2) |
| **Member 3** | Frontend Engineer | [Profile](https://linkedin.com/in/member3) |
| **Member 4** | DevOps Engineer | [Profile](https://linkedin.com/in/member4) |

> **Team Name:** YOUR_TEAM_NAME  
> **Hackathon:** RIFT 2026 - AI/ML Track  
> **Submission Date:** February 19, 2026

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **RIFT 2026 Organizers** for hosting this amazing hackathon
- **OpenAI** for GPT-4 API access
- **shadcn/ui** for beautiful React components
- **Prisma** for excellent ORM
- **Vercel** and **Railway** for hosting platforms

---

## Contact

For questions or feedback:
- **Email:** your.email@example.com
- **LinkedIn:** [Your Profile](https://linkedin.com/in/yourprofile)
- **GitHub:** [@yourusername](https://github.com/yourusername)

---

<div align="center">

Built for RIFT 2026 Hackathon

⭐ Star this repo if you found it helpful!

</div>
