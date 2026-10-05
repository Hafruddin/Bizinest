# MSME AI Business Assistant

> **An Intelligent Multi-Agent Platform for Small Business Automation**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stack](https://img.shields.io/badge/Stack-Next.js%2015%20%7C%20Node.js%20%7C%20MongoDB%20%7C%20LangGraph-blue)](#tech-stack)

---

## 📌 Incubation & Proposal Context

- **Business Incubator Name**: Dr. R. Ashok Kumar
- **Business Incubator Email ID**: msme.hi@rmd.ac.in
- **Business Incubator Mobile Number**: 9790739133
- **HI/BI State**: TAMIL NADU
- **HI/BI Name**: RMD ENGINEERING COLLEGE
- **Theme**: Industry 4.0 and 5.0
- **Idea Sector**: Services, Education, Hospitality, Media, Publishing, Entertainment, Design, Wellness, Logistics, Sports
- **Title of Innovation**: MSME AI Business Assistant - An Intelligent Multi-Agent Platform for Small Business Automation

---

## 🌟 Key Features

1. **Multi-Agent AI Swarm Orchestrator (LangGraph Engine)**:
   - Evaluates incoming queries and dynamically routes work across 10 domain-specialized agents:
     - 🧾 **Invoice Agent**: GST invoicing, auto stock deduction, PDF export, QR codes.
     - 📦 **Inventory Agent**: SKU tracking, low stock alerts, barcode/QR tag generator.
     - 💰 **Finance Agent**: Cash Flow tracking, Profit & Loss reports, Tax liability summaries.
     - 📄 **Document Agent**: OCR parsing, PDF/Excel RAG semantic Q&A.
     - 💬 **Customer Support Agent**: Complaint tickets, automated FAQ response.
     - 🏛️ **Govt Scheme Advisor**: Indian MSME schemes matching (PMEGP, Mudra, CGTMSE).
     - 📊 **Business Analytics Agent**: Demand forecasting, revenue growth trends.
     - 📢 **Marketing Agent**: Social media post generator, promotional copy.
     - 👥 **HR Agent**: Payroll estimates, leave tracking, employee records.
     - 💼 **AI Business Advisor**: High-level executive consultant & risk analysis.

2. **Enterprise Technical Foundations**:
   - MongoDB Atlas 15-Collection schema architecture with ACID transaction support.
   - Real-time Server-Sent Events (SSE) streaming for AI agent responses.
   - Dark & Light theme modes, Command Palette (`Cmd + K`), and intuitive responsive UI.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 / React 19, TypeScript, Tailwind CSS, Framer Motion, Recharts, Lucide Icons.
- **Backend**: FastAPI / Node.js Express Gateway, MongoDB Mongoose, Redis, JWT Auth, WebSockets.
- **AI & RAG**: Google Gemini 2.5/3.5 models, LangGraph, LangChain, MongoDB Vector Search, OCR.
- **DevOps**: Docker, Docker Compose, NGINX Reverse Proxy.

---

## 🚀 Quickstart & Installation

### Option 1: Running with Docker Compose (Recommended)

```bash
# Clone or navigate to directory
cd /Users/skhafruddin/.gemini/antigravity/scratch/msme-ai-assistant

# Start all services
docker-compose up --build -d
```

Access the Web Application at `http://localhost:3000` and API at `http://localhost:5001/api/health`.

### Option 2: Running Locally

#### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📂 Project Structure

```
msme-ai-assistant/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & Environment Config
│   │   ├── controllers/     # API Business Controllers
│   │   ├── middlewares/     # JWT Auth & Error Handlers
│   │   ├── models/          # 15 MongoDB Mongoose Models
│   │   ├── routes/          # RESTful Endpoints
│   │   └── services/        # LangGraph & Multi-Agent AI Service
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── context/         # App State & Theme Context
│   │   ├── layouts/         # SaaS Shell & Navigation Layouts
│   │   ├── pages/           # Dashboard & Agent Views
│   │   └── services/        # Axios API Client
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## 📜 License
Licensed under the MIT License.
