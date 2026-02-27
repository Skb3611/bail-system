# Bail Recognizer System - Technical Documentation

A full-stack Legal Tech application built with **Next.js 14**, designed to automate bail eligibility analysis through rule-based logic. This project serves as a comprehensive case study for students to understand **modern web architecture**, **session-based authentication**, and **legal-to-technical logic mapping**.

---

## 🏗️ Technical Architecture

The project follows a **Monolithic App Router** architecture using Next.js, integrating both frontend and backend logic within a single deployment unit.

### 💻 Tech Stack
- **Frontend**: [Next.js 14](https://nextjs.org/) (Client Components, Tailwind CSS, shadcn/ui)
- **Backend**: Next.js [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) (Node.js runtime)
- **Database**: [MongoDB](https://www.mongodb.com/) (NoSQL for flexible case schemas)
- **AI Integration**: [Google Gemini 2.0 Flash](https://deepmind.google/technologies/gemini/) (Context-aware legal assistant)
- **Security**: SHA-256 password hashing & HTTP-only cookies

---

## 🧠 Core Logic: Bail Eligibility Engine

The heart of this system is the `evaluateBailEligibility` function found in [route.js](file:///c:\Users\Asus\Desktop\project-hub-projects\bail-system\app\api\[[...path]]\route.js). It translates complex legal principles into executable code using a hierarchical rule-set:

### **Rule Hierarchy**
1.  **Purely Bailable**: If all offenses are categorized as 'Bailable' in the `legalRules` collection $\rightarrow$ **Eligible**.
2.  **Serious Crimes**: If any offense is 'Non-Bailable' and categorized as 'High' risk $\rightarrow$ **Not Eligible**.
3.  **Humanitarian Grounds**: If the accused is over 60 years old (Senior Citizen) $\rightarrow$ **Conditional Bail**.
4.  **Moderate Risk**: Non-bailable offenses with 'Medium' or 'Low' risk $\rightarrow$ **Conditional Bail** (requires surety).
5.  **Complexity Fallback**: Mixed offense types default to **Conditional Bail** to ensure judicial oversight.

---

## � Security & Session Management

Students can study the implementation of **Session-Based Authentication** in this project:

-   **Stateful Sessions**: Active sessions are stored in the `sessions` MongoDB collection, mapping a unique token to a `userId`.
-   **Cookie Security**: The session token is sent to the client via a `Set-Cookie` header with `httpOnly: true`, preventing XSS-based token theft.
-   **Middleware-like Protection**: The `getSession` helper validates the token on every restricted API call, checking for both existence and expiration.
-   **Audit Trail**: Every significant action (Login, Case Update, Analysis) triggers a `createAuditLog` entry, ensuring accountability.

---

## 🤖 AI Assistant Implementation

The Chatbot.jsx component demonstrates how to integrate LLMs into a business workflow:

-   **Context Injection**: The AI is given a `systemInstruction` that defines its role as a "Bail Legal Assistant".
-   **History Sanitation**: To comply with the Gemini API, the history is cleaned to ensure it always begins with a `user` role message.
-   **Streaming UI**: Uses React state to manage real-time message updates and a "thinking" indicator.

---

## 📊 Database Schema

| Collection | Responsibility | Key Fields |
| :--- | :--- | :--- |
| `users` | Identity management | `name`, `email`, `password` (hashed), `role` |
| `cases` | Core business data | `firNumber`, `ipcSections`, `legalAnalysis`, `bailEvaluation` |
| `legalRules` | Knowledge base | `section`, `offense`, `category`, `riskLevel` |
| `auditLogs` | Compliance | `userId`, `action`, `details`, `timestamp` |
| `sessions` | Auth state | `token`, `userId`, `expiresAt` |

---

## � Getting Started for Students

### 1. Environment Setup
Create a `.env` file in the root directory:
```env
MONGO_URL=your_mongodb_connection_string
GEMINI_API_KEY=your_google_ai_key
```

### 2. Data Population
Run the following command to seed the database with test cases and the admin user:
```bash
node populate_dummy_data.js
```

### 3. Study Path
1.  **Authentication**: Start with `POST /api/auth/login` in [route.js](file:///c:\Users\Asus\Desktop\project-hub-projects\bail-system\app\api\[[...path]]\route.js).
2.  **State Management**: Explore how `app/page.js` handles the complex UI state transitions between different dashboard views.
3.  **Legal Logic**: Deep dive into the `analyzeCase` logic to see how IPC sections are parsed and matched against the database.
4.  **Responsive UI**: Study the Tailwind classes in [Chatbot.jsx](file:///c:\Users\Asus\Desktop\project-hub-projects\bail-system\components\Chatbot.jsx) to see how the interface adapts to mobile screens.

---

## 📁 Project Structure

```text
bail-system/
├── app/                  # Next.js App Router
│   ├── api/              # API Route Handlers
│   │   ├── [[...path]]/  # Main CRUD & Logic (Cases, Users, Auth)
│   │   ├── chat/         # Gemini AI Integration
│   │   └── legal-rules/  # Legal Rules Data Fetching
│   ├── layout.js         # Global Layout & Providers
│   └── page.js           # Main Dashboard UI
├── components/           # React Components
│   ├── ui/               # Shared shadcn/ui components
│   ├── Chatbot.jsx       # AI Assistant Interface
│   └── LegalRules.jsx    # Rules Management UI
├── lib/                  # Utility Functions
├── public/               # Static Assets
└── populate_dummy_data.js # DB Seeding Script
```

---

## 📡 API Endpoints

The system uses a combination of standard RESTful routes and a catch-all route handler.

### **Authentication**
- `POST /api/auth/login` - Authenticates user and sets HTTP-only session cookie.
- `POST /api/auth/logout` - Clears the session cookie.
- `GET /api/auth/session` - Returns the current user session if valid.

### **Case Management**
- `GET /api/cases` - Retrieves all registered cases.
- `POST /api/cases` - Registers a new case.
- `GET /api/cases/:id` - Retrieves detailed information for a specific case.
- `PUT /api/cases/:id` - Updates existing case data.
- `GET /api/cases/:id/analyze` - Triggers the rule-based bail analysis for a case.
- `POST /api/cases/analyze-all` - Runs batch analysis on all registered cases.
- `GET /api/cases/:id/report` - Generates data for the print-ready report.

### **User Management (Admin Only)**
- `GET /api/users` - Lists all system users.
- `POST /api/users` - Creates a new user account.
- `PUT /api/users/:id` - Updates user roles or status.
- `DELETE /api/users/:id` - Soft-disables a user account.

### **System & AI**
- `GET /api/dashboard/stats` - Aggregated metrics for the dashboard cards.
- `GET /api/audit/logs` - (Admin) Retrieves the system activity trail.
- `GET /api/legal-rules` - Fetches the IPC/CrPC rules database.
- `POST /api/chat` - Interface for the Gemini 2.0 Flash AI assistant.

---

## ⚖️ Legal Disclaimer
This system is an **educational prototype**. The bail eligibility logic is based on simplified interpretations of the Indian Penal Code (IPC) and should not be used for actual legal decision-making.
