# 🚀 8eyond Infinite NestJS Advanced Starter

A production-ready NestJS boilerplate with **Domain-Driven Design (DDD)**, **Hexagonal Architecture (Ports & Adapters)**, **Prisma ORM**, and **Docker** support — built for teams who care about scalability, maintainability, and code quality.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Architecture Overview](#-architecture-overview)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
  - [Running with Docker](#running-with-docker)
- [Database](#-database)
- [Code Quality](#-code-quality)
- [License](#-license)

---

## ✨ Features

- ✅ **Domain-Driven Design (DDD)** — clear separation of domain, application, and infrastructure layers
- ✅ **Hexagonal Architecture (Ports & Adapters)** — domain at the center, isolated from frameworks and databases via explicit ports and adapters
- ✅ **Prisma ORM** — type-safe database access with auto-generated client
- ✅ **Value Objects** — strongly-typed domain primitives (e.g. `UserId`)
- ✅ **Repository Pattern** — abstract domain repositories with Prisma implementations
- ✅ **Domain Mappers** — clean mapping between Prisma models and domain entities
- ✅ **Shared Module** — reusable infrastructure services (Prisma, base value objects)
- ✅ **Docker & Docker Compose** — containerized development and deployment
- ✅ **ESLint + Prettier** — enforced code style on every commit via Husky pre-commit hooks
- ✅ **TypeScript** — strict typing throughout the entire codebase

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [NestJS](https://nestjs.com/) |
| Language | TypeScript |
| ORM | [Prisma](https://www.prisma.io/) |
| Runtime | Node.js |
| Container | Docker / Docker Compose |
| Linter | ESLint (flat config) |
| Formatter | Prettier |
| Git Hooks | Husky |

---

## 📁 Project Structure

```
src/
├── app.module.ts               # Root application module
├── main.ts                     # Application entry point
│
├── contexts/                   # Bounded contexts (DDD)
│   └── iam/                    # Identity & Access Management context
│       ├── iam.module.ts
│       └── users/
│           ├── domain/         # Pure domain logic (no framework dependencies)
│           │   ├── user.repository.ts          # Abstract repository interface
│           │   ├── entities/
│           │   │   └── user.entity.ts          # User domain entity
│           │   └── value-objects/
│           │       └── user-id.vo.ts           # UserId value object
│           └── infrastructure/ # Framework & DB implementations
│               ├── mappers/
│               │   └── user.mapper.ts          # Prisma ↔ Domain mapper
│               └── repositories/
│                   └── prisma-user.repository.ts  # Prisma implementation
│
└── shared/                     # Cross-cutting concerns
    ├── shared.module.ts
    ├── infrastructure/
    │   └── prisma/
    │       └── prisma.service.ts   # PrismaClient wrapper
    └── value-objects/
        └── base-id.vo.ts           # Base class for ID value objects

prisma/
└── schema.prisma               # Database schema definition
```

---

## 🏛 Architecture Overview

This starter combines **Domain-Driven Design (DDD)** with **Hexagonal Architecture (Ports & Adapters)**. The domain sits at the center and is completely isolated from the outside world — it never depends on NestJS, Prisma, or any external library. All communication flows through **Ports** (interfaces defined in the domain) and **Adapters** (concrete implementations in the infrastructure layer).

```
                        ┌─────────────────────────────────┐
                        │           DOMAIN CORE            │
                        │                                  │
   ┌────────────┐       │  Entities · Value Objects        │       ┌──────────────────┐
   │  NestJS    │──────▶│                                  │──────▶│  Prisma Database │
   │ Controllers│       │  «Port»                          │       │  (Adapter)       │
   │ (Adapter)  │       │  UserRepository (interface)      │       │  PrismaUser      │
   └────────────┘       │                                  │       │  Repository      │
                        │  No framework / DB dependencies  │       └──────────────────┘
                        └─────────────────────────────────┘
```

### Ports & Adapters in This Project

| Concept | Role | Example |
|---|---|---|
| **Port** | Interface defined in the domain layer | `user.repository.ts` |
| **Adapter (Driven)** | Infrastructure implementation of a Port | `prisma-user.repository.ts` |
| **Mapper** | Translates between DB models and domain entities | `user.mapper.ts` |
| **Value Object** | Strongly-typed domain primitive with built-in validation | `user-id.vo.ts`, `base-id.vo.ts` |
| **Bounded Context** | Self-contained domain module | `contexts/iam/` |

### Key Design Decisions

- **Domain entities** are plain TypeScript classes — zero dependency on Prisma or NestJS.
- **Repository interfaces (Ports)** live inside the domain layer, not the infrastructure layer. The domain dictates the contract; infrastructure fulfills it.
- **Prisma repositories (Adapters)** implement domain ports and are registered in NestJS DI as the concrete providers.
- **Mappers** handle all conversion between Prisma models and domain entities, so neither layer is polluted by the other's shape.
- **Value Objects** (like `UserId`) encapsulate validation and identity logic, preventing primitive obsession.
- **Bounded contexts** under `src/contexts/` allow the codebase to scale horizontally into independent domain modules without coupling.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- **Docker** & **Docker Compose** (optional, for containerized setup)
- A supported database (PostgreSQL recommended — configure via `DATABASE_URL`)

### Installation

```bash
# Clone the repository
git clone https://github.com/8eyond/infinite-nestjs-advanced-starter.git
cd infinite-nestjs-advanced-starter

# Install dependencies
npm install
```

### Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | Prisma connection string | `postgresql://user:pass@localhost:5432/mydb` |
| `PORT` | HTTP port the app listens on | `3000` |

> See `.env.example` for the full list of required variables.

### Running the App

```bash
# Development (watch mode)
npm run start:dev

# Production build
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

### Running with Docker

```bash
# Start all services (app + database)
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# Stop all services
docker-compose down
```

The app will be available at `http://localhost:3000` by default.

---

## 🗄 Database

This project uses **Prisma** as the ORM. The schema is defined in `prisma/schema.prisma`.

```bash
# Push schema changes to the database (development)
npx prisma db push

# Generate Prisma client after schema changes
npx prisma generate

# Open Prisma Studio (GUI for your database)
npx prisma studio

# Run migrations (production)
npx prisma migrate deploy

# Create a new migration
npx prisma migrate dev --name <migration_name>
```

> **Note:** Always run `npx prisma generate` after modifying `schema.prisma` to keep the type-safe client in sync.

---

## 🧹 Code Quality

### Linting

```bash
# Run ESLint
npm run lint

# Auto-fix lint issues
npm run lint -- --fix
```

### Formatting

```bash
# Check formatting
npm run format

# Auto-format with Prettier
npx prettier --write .
```

### Git Hooks

Husky is configured to run lint and format checks automatically on every `git commit` via the `.husky/pre-commit` hook — keeping the codebase consistently clean without manual effort.

---

## 📄 License

This project is licensed under the terms specified in the [LICENSE](./LICENSE) file.

---

<div align="center">
  Built with ❤️ by <a href="https://github.com/trhgatu"><strong>trhgatu</strong></a>
</div>