# Phase 10: Deployment (Sumopod Optimized)

## Objective

Prepare the application for deployment using Docker with a structure optimized for container-based platforms like Sumopod.

---

## Scope

- Dockerfile for NestJS backend (optimized)
- Dockerfile for Next.js frontend (standalone mode)
- Docker Compose for local development only
- Environment variable management
- Sumopod deployment guide (separate services)
- Health check implementation

---

## Tasks

---

### 10.1 Backend Dockerfile (Production Ready)

Location:
`apps/api/Dockerfile`

Requirements:

- Multi-stage build:
  - Builder stage (install + build)
  - Production stage (lightweight)

- Use:
  - node:20-alpine

- Only install production dependencies in final stage

- Expose:
  - PORT 3001

- Add health endpoint:
  - GET /health

- Optimize:
  - Small image size
  - Fast startup

---

### 10.2 Frontend Dockerfile (Next.js Standalone)

Location:
`apps/web/Dockerfile`

Requirements:

- Use Next.js standalone output:
  - output: "standalone"

- Multi-stage build

- Copy only:
  - .next/standalone
  - .next/static
  - public

- Expose:
  - PORT 3000

- Ensure:
  - Minimal image size
  - No dev dependencies

---

### 10.3 Docker Compose (LOCAL ONLY)

File:
`docker-compose.yml`

Purpose:

- Local development ONLY
- NOT used in Sumopod production

Services:

- api
- web

Rules:

- No database container (Supabase is external)
- Use internal networking:
  - api:3001

Example:

```yaml
services:
  api:
    build: ./apps/api
    ports:
      - '3001:3001'
    env_file:
      - ./apps/api/.env

  web:
    build: ./apps/web
    ports:
      - '3000:3000'
    depends_on:
      - api
    env_file:
      - ./apps/web/.env
```

---

### 10.4 Environment Configuration

Create:

- `apps/api/.env.example`
- `apps/web/.env.example`

---

#### Backend (.env)

```
PORT=3001
SUPABASE_URL=
SUPABASE_KEY=
```

---

#### Frontend (.env)

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

IMPORTANT:

- NEVER expose Supabase service key in frontend
- Use only public-safe variables in Next.js

---

### 10.5 Health Check Endpoint

Backend must provide:

```
GET /health
```

Response:

```json
{
  "status": "ok"
}
```

---

### 10.6 Sumopod Deployment Strategy (CRITICAL)

Deployment model:

Deploy as **2 separate services**:

1. api-service
2. web-service

---

#### API Service

- Build from:
  `apps/api/Dockerfile`

- Port:
  3001

- Env:
  - SUPABASE_URL
  - SUPABASE_KEY

---

#### Web Service

- Build from:
  `apps/web/Dockerfile`

- Port:
  3000

- Env:
  - NEXT_PUBLIC_API_URL=[https://your-api-url](https://your-api-url)

---

IMPORTANT:

- Do NOT use docker-compose in Sumopod
- Each service runs independently

---

### 10.7 README Update

Add section:

#### Docker (Local)

```
docker-compose up --build
```

Access:

- Web: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:3001](http://localhost:3001)

---

#### Deployment (Sumopod)

Steps:

1. Build container
2. Configure environment variables
3. Deploy API service
4. Deploy Web service
5. Connect frontend to API URL

---

## Expected Output

- Dockerized backend & frontend
- Local environment works via docker-compose
- Ready to deploy on Sumopod without changes

---

## Acceptance Criteria

- [ ] docker-compose up works locally
- [ ] API accessible at localhost:3001
- [ ] Web accessible at localhost:3000
- [ ] Health check endpoint works
- [ ] Env variables properly externalized
- [ ] Deployment guide clear for Sumopod
- [ ] No secrets leaked to frontend

---

## Out of Scope

- CI/CD pipeline
- Kubernetes
- Domain & SSL
- Monitoring tools
- Advanced scaling setup
