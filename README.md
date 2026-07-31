# CareerHub

**CareerHub** is a full-stack job application tracker. Instead of juggling spreadsheets and email threads, log every application, interview and CV version in one place and see your progress — response rate, interview conversion, offer rate — at a glance.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-6DB33F)
![React](https://img.shields.io/badge/React-18.3-61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
  - [Run with Docker Compose (recommended)](#run-with-docker-compose-recommended)
  - [Run locally without Docker](#run-locally-without-docker)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [API overview](#api-overview)
- [Data model notes](#data-model-notes)
- [Testing](#testing)
- [Roadmap](#roadmap)
- [License](#license)

## Features

- **Application pipeline** — track every application by status (Applied, Interviewing, Offer, Rejected, Withdrawn), with inline status changes from the list view.
- **Interview scheduling** — log phone, video and on-site rounds against each application; scheduling an interview automatically advances the application to "Interviewing".
- **Reusable CV library** — upload multiple CV versions and attach the one you used to any number of applications (not limited to a single application per CV).
- **Analytics dashboard** — response rate, interview conversion rate, offer rate, an applications-by-status chart, and a recent-applications feed.
- **Authentication** — email/password registration and login with JWT-based sessions, scoped per user.
- **Responsive UI** — a card-based layout on mobile (no horizontal-scrolling tables) and a marketing landing page for signed-out visitors.

## Tech stack

**Backend**
- Java 17, Spring Boot 3.3.4 (Web, Data JPA, Security, Validation)
- PostgreSQL 16, managed with Flyway migrations
- JWT authentication (`jjwt`)
- JUnit 5, Mockito, AssertJ, JaCoCo for coverage

**Frontend**
- React 18 + Vite
- React Router
- Tailwind CSS
- Recharts (dashboard charts)
- Axios

**Infrastructure**
- Docker Compose (Postgres + Spring Boot + nginx-served React build)

## Project structure

```
careerhub/
├── backend/                 # Spring Boot API
│   ├── src/main/java/com/careerhub/
│   │   ├── auth/             # Registration, login, JWT issuing
│   │   ├── application/      # Job applications (entity, DTOs, controller, service)
│   │   ├── interview/        # Interviews linked to an application
│   │   ├── cv/                # CV upload/storage/download
│   │   ├── analytics/         # Dashboard stats aggregation
│   │   ├── security/           # JWT filter, user details, security config
│   │   └── common/            # Global exception handling
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── db/migration/       # Flyway SQL migrations
│   └── src/test/java/...       # Unit tests per service
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── pages/              # Landing, Login, Register, Dashboard, Applications, ...
│   │   ├── components/         # Layout, Logo, StatusBadge, StatusSelect, icons, ...
│   │   ├── api/                 # Axios API clients
│   │   ├── context/            # Auth context
│   │   └── routes/             # Route guards
│   └── Dockerfile
├── docker-compose.yml
└── backend/Dockerfile
```

## Getting started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose (for the quick start), **or**
- Java 17+ and Maven, Node.js 18+, and a local PostgreSQL 16 instance (for running services individually)

### Run with Docker Compose (recommended)

This brings up PostgreSQL, the Spring Boot API and the React app (served via nginx) together:

```bash
docker compose up -d --build
```

| Service  | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080/api |
| PostgreSQL | localhost:5432 |

Database schema is created automatically on startup via Flyway migrations — no manual setup needed.

### Run locally without Docker

**1. Start PostgreSQL** and create a database matching `backend/src/main/resources/application.yml` (defaults to `careerhub` / `careerhub` / `careerhub`), or override via environment variables (see [Configuration](#configuration)).

**2. Backend**

```bash
cd backend
mvn spring-boot:run
```

The API starts on `http://localhost:8080`, with every endpoint under `/api`, and Flyway applies migrations automatically.

**3. Frontend**

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173` and talks to the backend at `http://localhost:8080/api` (see `frontend/src/api/client.js`).

## Configuration

The backend reads the following environment variables (all optional, with local-friendly defaults in `application.yml`):

| Variable | Description | Default |
|----------|--------------|---------|
| `SPRING_DATASOURCE_URL` | JDBC URL for PostgreSQL | `jdbc:postgresql://localhost:5432/careerhub` |
| `SPRING_DATASOURCE_USERNAME` | Database user | `careerhub` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | `careerhub` |
| `JWT_SECRET` | Signing secret for JWTs | a development default (**override in production**) |
| `CV_STORAGE_DIR` | Filesystem directory where uploaded CVs are stored | `./cv-storage` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated list of origins allowed to call the API | `http://localhost:5173,http://localhost:3000` |

Uploaded CVs are limited to PDF or DOCX files, up to 5 MB (`spring.servlet.multipart.max-file-size`).

The frontend reads one build-time variable (see `frontend/.env.example`):

| Variable | Description | Default |
|----------|--------------|---------|
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:8080/api` |

## Deployment

This is one way to run CareerHub for free: **Vercel** for the frontend, **Render** for the backend, **Neon** for PostgreSQL. All three have a free tier; the main trade-offs are cold starts (the Render service and the Neon database both suspend after a few minutes of inactivity and take a moment to wake up) and an **ephemeral filesystem on Render's free web services** — uploaded CV files won't survive a redeploy or a spin-down. That's fine for a demo/portfolio deployment; swap `CvService`'s file storage for an object store (e.g. Cloudflare R2, S3) if you need uploads to persist.

**1. Database — Neon**
1. Create a free project at [neon.tech](https://neon.tech).
2. Copy the connection details (host, database, username, password).

**2. Backend — Render**
1. New **Web Service** → connect this repo → root directory `backend` → Render will detect and build `backend/Dockerfile`.
2. Set environment variables:
   - `SPRING_DATASOURCE_URL` = `jdbc:postgresql://<neon-host>/<db>?sslmode=require`
   - `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD` = from Neon
   - `JWT_SECRET` = a long random string
   - `CORS_ALLOWED_ORIGINS` = your Vercel URL(s), e.g. `https://careerhub.vercel.app,https://your-custom-domain.com`
3. Deploy. Flyway applies the schema automatically on first boot.

**3. Frontend — Vercel**
1. New Project → import this repo → set **Root Directory** to `frontend` (Vercel auto-detects the Vite preset).
2. Set the environment variable `VITE_API_URL` to your Render backend URL plus `/api` (e.g. `https://careerhub-backend.onrender.com/api`).
3. Point your custom domain at the Vercel project. `frontend/vercel.json` handles the SPA rewrite so client-side routes work on refresh/direct navigation.

## API overview

All endpoints are prefixed with `/api` and (except auth) require a `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|--------------|
| POST | `/auth/register` | Create an account, returns a JWT |
| POST | `/auth/login` | Authenticate, returns a JWT |
| GET | `/applications` | List the current user's applications (optional `status` filter) |
| POST | `/applications` | Create an application |
| GET / PUT / DELETE | `/applications/{id}` | Read, update or delete an application |
| GET / POST | `/applications/{id}/interviews` | List or schedule interviews for an application |
| PUT / DELETE | `/interviews/{id}` | Update or delete an interview |
| GET | `/interviews` | List all interviews across the user's applications |
| GET | `/cv` | List the current user's CVs, including which applications use each one |
| POST | `/cv` | Upload a CV (multipart: `file`, optional `label`) |
| GET | `/cv/{id}/download` | Download a CV file |
| DELETE | `/cv/{id}` | Delete a CV |
| GET | `/dashboard/stats` | Aggregated stats for the dashboard |

## Data model notes

- A CV (`cv_documents`) can be attached to **any number of applications** — the foreign key lives on `applications.cv_id`, not the other way around, so the same resume can be reused across applications.
- Creating an interview for an application that is still in `APPLIED` automatically advances its status to `INTERVIEWING`. Any other status is left untouched.
- All data is scoped per authenticated user; ownership is checked on every read/write.

## Testing

```bash
cd backend
mvn test
```

Unit tests cover the application, interview, CV and analytics services (ownership checks, status transitions, percentage calculations) using JUnit 5, Mockito and AssertJ. `mvn test` also generates a JaCoCo coverage report at `target/site/jacoco/index.html`.

## Roadmap

- Quick "add interview" action directly from the applications list (without opening the detail page)
- Code-splitting the frontend bundle
- Reminders/notifications for upcoming interviews

## License

No license file is currently included in this repository. All rights reserved unless a license is added.
