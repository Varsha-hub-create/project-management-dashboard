# Project Management Dashboard

An intermediate full-stack project built with React, TypeScript, Node.js, Express, and PostgreSQL.

## Features

- User registration and login
- JWT authentication
- Protected dashboard
- Create, read, update, and delete projects
- Create, update, complete, and delete tasks
- PostgreSQL relational data
- Task status and priority
- Search and filtering
- Dashboard statistics
- REST API architecture
- TypeScript on frontend and backend
- CORS and environment configuration

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- React Router
- CSS

### Backend
- Node.js
- Express
- TypeScript
- JWT
- bcrypt
- Zod
- PostgreSQL
- pg

## Project Structure

```text
project-management-dashboard/
├── backend/
│   ├── database/
│   │   └── schema.sql
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── types/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── pages/
    │   ├── types/
    │   ├── App.tsx
    │   └── main.tsx
    ├── .env.example
    ├── package.json
    └── tsconfig.json
```

## Database

Create a PostgreSQL database:

```sql
CREATE DATABASE project_manager;
```

Run:

```text
backend/database/schema.sql
```

## Backend Setup

```bash
cd backend
npm install
```

Copy `.env.example` to `.env`.

Example:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/project_manager
JWT_SECRET=change_this_to_a_long_random_secret
FRONTEND_URL=http://localhost:5173
```

Run:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

## Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Copy `.env.example` to `.env`.

Run:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## API Endpoints

### Auth

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Projects

```text
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PATCH  /api/projects/:id
DELETE /api/projects/:id
```

### Tasks

```text
GET    /api/projects/:projectId/tasks
POST   /api/projects/:projectId/tasks
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
```

## CV Description

### Project Management Dashboard | React, TypeScript, Node.js, Express, PostgreSQL

- Developed a full-stack project management dashboard using React, TypeScript, Node.js, Express, and PostgreSQL.
- Implemented JWT-based authentication with protected API routes and password hashing.
- Built RESTful APIs for project and task management with PostgreSQL relational data and CRUD operations.
- Added task filtering, status/priority management, dashboard statistics, and responsive UI.
- Structured the application into reusable frontend components, backend controllers, routes, middleware, and database layers.

## What to Learn From This Project

After completing this project, you should understand:

1. React + TypeScript
2. REST APIs
3. Express architecture
4. JWT authentication
5. PostgreSQL relationships
6. SQL joins
7. API validation
8. Protected routes
9. Frontend routing
10. State management basics
11. Error handling
12. Environment variables

Next upgrades can include Docker, Redis, testing, CI/CD, AWS deployment, and role-based access control.
