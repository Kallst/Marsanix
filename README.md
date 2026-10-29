# Marsanix Esports

Web platform for organizing and managing public video game tournaments. It centralizes users, teams, tournaments, registrations, matches and results, aiming to reduce the manual work of tournament organizers.

Academic project for Software Engineering II. The MVP scope is: public tournaments, single-elimination format and a single supported video game (**Rocket League**), with an architecture that allows adding other games later.

## Project status

Current version: **v0.2.x** (backend only).

| Area | Status |
|---|---|
| Backend base structure and hexagonal architecture | Done |
| Teams: creation, members and captain | Done |
| Game templates with rules (Rocket League) | Done |
| Users: registration, login (JWT) and profile | Done |
| Swagger/OpenAPI documentation | Done |
| Tournaments, registrations and lifecycle | Pending (ACT-016 to ACT-020, ACT-026) |
| Bracket and matches | Pending (ACT-021, ACT-022) |
| Video game API integration and results | Pending (ACT-023 to ACT-025) |
| Basic statistics | Pending (ACT-027) |
| Angular frontend | Pending (ACT-028, ACT-029) |
| Automated tests, final documentation and deployment | Pending (ACT-030) |

The `tournaments`, `matches` and `statistics` folders exist as structure only and have no functionality yet.

## Tech stack

- Node.js, Express 5 and TypeScript
- PostgreSQL (accessed with the `pg` package)
- JWT (`jsonwebtoken`) and bcrypt for authentication
- Swagger UI for API documentation
- `tsx` for development
- Angular for the frontend (pending)

## Prerequisites

| Tool | Recommended version | Check with |
|---|---|---|
| Node.js | 20 or higher (tested with 24) | `node -v` |
| npm | Included with Node.js | `npm -v` |
| PostgreSQL | 13 or higher (tested with 18) | `psql --version` |
| Git | Any recent version | `git --version` |

PostgreSQL 13 or higher is required because the seed script uses `gen_random_uuid()`.

## Repository structure

```
Marsanix - Ingeniería de software II/
├── README.md
├── .gitignore
└── Backend/
    ├── package.json
    ├── tsconfig.json
    ├── example.env          # environment variables template
    ├── .env                 # your local configuration (not committed)
    └── src/
        ├── server.ts        # server entry point
        ├── app.ts           # composition root: wires repositories, use cases and controllers
        ├── db.ts            # PostgreSQL connection
        ├── openapi.ts       # Swagger documentation
        └── context/
            ├── users/       # implemented
            ├── teams/       # implemented
            ├── games/       # implemented
            ├── tournaments/ # pending
            ├── matches/     # pending
            └── statistics/  # pending
```

Each context follows the hexagonal architecture with three layers:

- `domain/`: entities, value objects, exceptions and repository interfaces. It does not depend on any external technology.
- `application/`: use cases and DTOs.
- `infrastructure/`: Express controllers, routes and PostgreSQL repositories.

## Step-by-step installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd "Marsanix - Ingeniería de software II"
git checkout develop
```

### 2. Install dependencies

All `npm` commands are run **inside the `Backend` folder**:

```bash
cd Backend
npm install
```

This