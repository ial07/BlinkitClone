# ──────────────────────────────────────────────────────────────
# apps/web/Dockerfile
# Multi-stage build for Next.js frontend (standalone output)
# Final image: ~120MB (vs ~600MB with full node_modules)
# ──────────────────────────────────────────────────────────────

# ── Stage 1: deps ─────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json turbo.json ./
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY packages/ui/package.json    ./packages/ui/
COPY apps/web/package.json       ./apps/web/

RUN npm ci

# ── Stage 2: builder ──────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# NEXT_PUBLIC_ vars are baked into the JS bundle at build time.
# Override via --build-arg when building for a specific environment.
ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules  ./node_modules

COPY package.json package-lock.json turbo.json ./
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

# Build shared packages
RUN cd packages/types && npx tsc -p tsconfig.json
RUN cd packages/utils && npx tsc -p tsconfig.json

# Build Next.js — produces apps/web/.next/standalone/
RUN cd apps/web && npx next build

# ── Stage 3: production ───────────────────────────────────────
# Next.js standalone output is fully self-contained.
# It includes an embedded Node server (server.js) and only the
# node_modules it actually needs — no full npm install required.
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0

RUN apk add --no-cache dumb-init

# The standalone directory is a complete, runnable Next.js app.
# Its server.js lives at the ROOT of the standalone output.
COPY --from=builder /app/apps/web/.next/standalone ./

# Static assets (CSS, JS chunks) must be in .next/static
# relative to the server.js working directory.
COPY --from=builder /app/apps/web/.next/static ./.next/static

# Public directory (images, fonts, icons)
COPY --from=builder /app/apps/web/public ./public

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

ENTRYPOINT ["dumb-init", "--"]
# server.js is emitted at the root of the standalone directory
CMD ["node", "server.js"]
