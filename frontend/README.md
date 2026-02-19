# DevOps Fixer Bot

An autonomous AI-powered agent simulation designed to identify, classify, and fix bugs in software repositories. This project demonstrates a multi-agent pipeline that automates the DevOps lifecycle, from repository analysis to CI/CD monitoring.

## 🚀 Key Features

- **Autonomous Analysis**: Automatically scans repositories to detect linting, syntax, logic, and type errors.
- **AI-Driven Fixes**: Generates patches and commit messages using simulated AI agents.
- **CI/CD Integration**: Simulates a full CI/CD pipeline, including branch creation, pushing changes, and monitoring build status.
- **Real-time Terminal Logs**: Provides a live, interactive terminal view of the agent's progress.
- **Comprehensive Dashboard**: Visualizes results with fix tables, CI timelines, and performance scoring.

## 🛠 Tech Stack

- **Frontend**: React (TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui + Framer Motion
- **State Management**: TanStack Query
- **Build Tool**: Vite
- **Testing**: Vitest

## 🏃 How to Run the Project

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [Bun](https://bun.sh/)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd devops-fixer-bot-main
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server with hot-reloading:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### Testing

Run the test suite:
```bash
npm test
```

### Production Build

Create an optimized build for production:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

## 📂 Project Structure

- `src/components`: UI components built with shadcn/ui and Framer Motion.
- `src/lib/agent-simulation.ts`: The core simulation logic for the DevOps agent.
- `src/pages`: Main application views (Index, NotFound).
- `src/types/agent.ts`: TypeScript definitions for agent states and results.
- `src/test`: Vitest configuration and example tests.

## 🤖 How the Simulation Works

1. **Input**: Provide a repository URL and team details.
2. **Phase 1 (Cloning & Analysis)**: The agent clones the repo and scans for failures.
3. **Phase 2 (Classification)**: Bugs are classified into types (e.g., LINTING, LOGIC).
4. **Phase 3 (Patching)**: The agent generates and applies fixes in multiple iterations.
5. **Phase 4 (CI/CD)**: Changes are "pushed" to a new branch, and the CI pipeline status is monitored.
6. **Phase 5 (Completion)**: A final report is generated with a performance score.

---
Built with ⚡ by Lovable.
