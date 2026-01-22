# WorkflowHub – SaaS Project Management Backend

A multi-tenant SaaS backend built with Node.js, TypeScript, and MongoDB.
The system supports organization-based access, role-based permissions,
AI-powered task suggestions, and scalable architecture.

---

## Tech Stack

- Node.js (v@22.21.1)
- TypeScript
- Express
- MongoDB + Mongoose
- JWT Authentication (Access & Refresh tokens)
- Zod (request validation)
- PM2 (production process manager)
- AI integration via Ollama (local LLM)

---

## Core Features

- User authentication & authorization (JWT)
- Role-based access control (Admin, Manager, Member)
- Organization-based multi-tenancy
- Project and task management
- AI-generated task suggestions
- Pagination and filtering
- Global error handling
- Request logging and validation  with Zod

---

## Environment Variables

Create a `.env` file:

PORT=5000
MONGO_URI=your_mongodb_url
JWT_ACCESS_SECRET=access_secret
JWT_REFRESH_SECRET=refresh_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

## Run Locally

npm install  
npm run dev

## Production

npm run build  
pm2 start dist/server.js