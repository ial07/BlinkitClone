# Phase 10: Deployment

## Objective
Dockerize both applications and prepare deployment configuration for production.

---

## Scope
- Dockerfile for NestJS backend
- Dockerfile for Next.js frontend
- Docker Compose for local orchestration
- Environment variable documentation
- README with setup and deployment instructions

---

## Tasks

### 10.1 Backend Dockerfile
```dockerfile
# apps/api/Dockerfile
FROM node:20-alpine AS builder
# Multi-stage build for NestJS
# Build stage → Production stage
```
- Multi-stage build (builder + production)
- Expose port 3001
- Health check endpoint

### 10.2 Frontend Dockerfile
```dockerfile
# apps/web/Dockerfile
FROM node:20-alpine AS builder
# Multi-stage build for Next.js
# Build stage → Production stage (standalone output)
```
- Use Next.js standalone output mode
- Expose port 3000

### 10.3 Docker Compose
```yaml
# docker-compose.yml
services:
  api:
    build: ./apps/api
    ports: ["3001:3001"]
    env_file: ./apps/api/.env
  web:
    build: ./apps/web
    ports: ["3000:3000"]
    depends_on: [api]
```

### 10.4 Documentation
- Update root README.md:
  - Project overview
  - Prerequisites
  - Setup instructions (local + Docker)
  - Seed data instructions
  - API documentation
  - Architecture diagram

### 10.5 Environment Configuration
- Document all required environment variables
- Create `.env.example` files
- Ensure Supabase config is properly externalized

---

## Expected Output
- `docker-compose up` starts entire stack
- README provides clear setup path
- Application ready for demo deployment

---

## Acceptance Criteria
- [ ] `docker-compose up` starts both services
- [ ] API reachable at localhost:3001
- [ ] Frontend reachable at localhost:3000
- [ ] README has complete setup instructions
- [ ] Environment variables documented
- [ ] Health check endpoints working

---

## Out of Scope
- CI/CD pipeline
- Kubernetes manifests
- Cloud-specific deployment (AWS/GCP/Vercel)
- SSL/TLS configuration
- Domain setup
- Monitoring/alerting
