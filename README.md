# TeleCare: AI-Assisted System to Connecting Rural Patients to Urban Doctors

## Project Overview

**TeleCare** is a web-based telemedicine platform designed to bridge the healthcare accessibility gap between rural patients and urban doctors. The platform enables secure video consultations, AI-powered symptom analysis, and multi-language support to serve India's diverse rural population.


## 📁 Local Development Setup

You can work on this project using your local IDE.

### ✅ Prerequisites

- Node.js & npm installed – [Install via nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### 🛠️ Steps to Run Locally

```sh
# Step 1: Clone the repository
git clone https://github.com/Gani2604/TeleCare-AI-Assisted-System-to-Connect-Rural-Patients-to-Urban-Doctors.git

# Step 2: Navigate to the project directory
cd telecare-connect-india

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
# TeleCare: AI-Assisted Platform to Connect Rural Patients with Urban Doctors

A Vite + React + TypeScript web application that provides telemedicine features such as video consultations (Jitsi), AI-assisted medical chat, multilingual UI, and integration with Firebase for auth and storage.

This README adds setup and execution details so you can run the project locally and push it to Git.

## Key features

- Video consultations using Jitsi
- AI-powered medical chatbot (uses Gemini API key via VITE_GEMINI_API_KEY)
- Supabase as backend for authentication and data
- Multi-language support (i18n)
- Built with React, TypeScript, TailwindCSS and shadcn/ui components

## Tech stack

- Frontend: React 18, TypeScript, Vite
- Styling: TailwindCSS
- Authentication & DB: Supabase (project references in `src/lib/config.ts`)
- Chat/AI: Google generative AI (Gemini) key referenced via `VITE_GEMINI_API_KEY`
- Video calls: Jitsi React SDK

## Prerequisites

- Node.js (recommended 18+) and npm or bun installed
- Git

On Windows with PowerShell, ensure you have a recent Node.js installed. You can use nvm-windows or install from nodejs.org.

## Setup and run (local development)

1. Clone the repository and change into the directory

```powershell
git clone https://github.com/Gani2604/TeleCare-AI-Assisted-System-to-Connect-Rural-Patients-to-Urban-Doctors.git
cd telecare-connect-india-main
```

2. Install dependencies

```powershell
npm install
# or if you use bun: bun install
```

3. Create a `.env` file in the project root (copy `.env.example` if present). The repo uses Vite and expects environment variables prefixed with `VITE_`.

Example `.env` values (DO NOT commit real secrets):

```text
# Google Gemini API key used by the medical chatbot
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Supabase configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional API and DB URIs
VITE_API_URL=http://localhost:5000/api
VITE_MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
```

Note: This repository already contains a `.env` file in the root with an example/key placeholder. Replace values with your own secrets and never commit them.

4. Start the dev server

```powershell
npm run dev
# open http://localhost:5173 (Vite default) in your browser
```

## Available scripts (from `package.json`)

- npm run dev — Start Vite dev server
- npm run build — Build for production
- npm run build:dev — Build in development mode
- npm run preview — Preview the production build locally
- npm run lint — Run ESLint

## Environment variables used in the project (quick map)

- VITE_GEMINI_API_KEY — used by `src/components/chat/MedicalChatbot.tsx` for AI chat
- VITE_SUPABASE_URL — used by `src/lib/api.ts` and `src/lib/config.ts`
- VITE_SUPABASE_ANON_KEY — Supabase anon key
- VITE_API_URL — optional backend API URL
- VITE_MONGODB_URI — optional MongoDB connection string

Search for `import.meta.env.VITE_` in the codebase to find all usages.

## Build & Preview

Build the production assets and preview locally:

```powershell
npm run build
npm run preview
```
