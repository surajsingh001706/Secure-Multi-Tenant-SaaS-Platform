# Secure Multi-Tenant SaaS Platform

A production-ready SaaS boilerplate featuring multi-tenancy (subdomain/ID based), role-based access control, and AI-powered analytics using Google Gemini.

## Features

- **Multi-Tenancy**: Data isolation by Tenant ID.
- **Authentication**: JWT-based auth with secure password hashing.
- **Frontend**: React + Vite + TailwindCSS with dynamic tenant branding.
- **Backend**: Node.js + Express + MongoDB.
- **AI Analytics**: Integrated with Google Gemini 2.0 Flash (`gemini-2.0-flash`) for report generation.
- **Deployment**: Docker Compose ready.

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB (Atlas or Local)
- **AI**: Google Gemini API

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Running locally or Atlas URI)
- Google Gemini API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repo_url>
    cd Secure_Multi_tenant_SAAS_APP
    ```

2.  **Install dependencies:**
    ```bash
    cd backend && npm install
    cd ../frontend && npm install
    ```

3.  **Environment Variables:**
    Create `backend/.env` based on example:
    ```env
    PORT=5000
    MONGO_URI=your_mongo_uri
    JWT_SECRET=your_jwt_secret
    GEMINI_API_KEY=your_gemini_key
    ```
    (Frontend uses Vite, environment variables should be prefixed with `VITE_` if needed, but currently uses dynamic backend config).

4.  **Seed Data (Optional):**
    Populate the database with demo tenants and users:
    ```bash
    cd backend
    node seed.js
    ```
    *Check the output for Tenant IDs and User credentials.*

### Running Locally

1.  **Start Backend:**
    ```bash
    cd backend
    npm start
    ```

2.  **Start Frontend:**
    ```bash
    cd frontend
    npm run dev
    ```

3.  **Access App:**
    Open [http://localhost:5173](http://localhost:5173)

### Docker Deployment

Run the entire stack with Docker Compose:

```bash
docker-compose up --build
```

The app will be available at [http://localhost:3000](http://localhost:3000) (Frontend) and [http://localhost:5000](http://localhost:5000) (Backend).

## Screenshots

*(Add screenshots here)*

## License

MIT
