# Phase 10: Deployment (Leapcell & Vercel Optimized)

## Objective

Deploy a full-stack monorepo with a NestJS backend on Leapcell and a Next.js frontend on Vercel, ensuring seamless communication via CORS and environment variables.

---

## Scope

- **Backend**: NestJS on Leapcell (Containerized).
- **Frontend**: Next.js on Vercel (Edge/Serverless).
- **Shared Packages**: Handling `@blinkit/types` and `@blinkit/utils` in a monorepo environment.
- **Cross-Origin**: CORS configuration for secure cross-domain communication.

---

## Tasks

### 10.1 Backend Deployment (Leapcell)

**Platform**: Leapcell
**Build Command**:

```bash
npm install && \
npm run build --workspace=@blinkit/types && \
npm run build --workspace=@blinkit/utils && \
cd apps/api && npm run build
```

**Start Command**: `node apps/api/dist/main.js`

**Configuration**:

- Ensure `SUPABASE_URL` starts with `https://` and has no trailing spaces.
- Expose `PORT` via environment variables (default 3001).

---

### 10.2 Frontend Deployment (Vercel)

**Platform**: Vercel
**Root Directory**: `.` (Project Root)
**Build Command**: `npx turbo build --filter=@blinkit/web`
**Output Directory**: `apps/web/.next`

**Monorepo Strategy**:

- Vercel must have access to the root `node_modules` and the `packages/` directory to resolve internal workspace dependencies.

---

### 10.3 CORS Configuration (Critical)

The backend must explicitly allow the Vercel domain to prevent "Failed to fetch" errors.

**File**: `apps/api/src/main.ts`

```typescript
app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://blinkit-clone-web.vercel.app', // Your production Vercel URL
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
```

---

### 10.4 Environment Variable Management

#### Backend (Leapcell Dashboard)

- `PORT`: 3001
- `SUPABASE_URL`: `[https://your-project.supabase.co](https://your-project.supabase.co)`
- `SUPABASE_SERVICE_KEY`: `your-secret-key`

#### Frontend (Vercel Dashboard)

- `NEXT_PUBLIC_API_URL`: `[https://your-api.leapcell.dev](https://your-api.leapcell.dev)`

---

### 10.5 Health Check & Verification

- **Liveness Check**: Verify backend status at `[https://your-api.leapcell.dev/health](https://your-api.leapcell.dev/health)`.
- **Database Check**: Verify data fetching at `[https://your-api.leapcell.dev/products](https://your-api.leapcell.dev/products)`.
- **CORS Verification**: Ensure the `Access-Control-Allow-Origin` header in the browser's Network tab matches your Vercel URL.

---

## Acceptance Criteria

- [ ] Backend builds successfully on Leapcell using workspace commands.
- [ ] Frontend builds on Vercel with Turbo and resolves shared packages.
- [ ] API is accessible via the Leapcell assigned domain.
- [ ] Frontend successfully fetches data from the Leapcell API without CORS errors.
- [ ] Environment variables are properly hidden and not leaked to the client (except `NEXT_PUBLIC`).

---

## Out of Scope

- Local Docker Compose (redundant with current PaaS setup).
- Self-managed VPS infrastructure.
- CI/CD pipelines outside of GitHub-to-PaaS integration.
