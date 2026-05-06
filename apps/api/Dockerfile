# ── Stage 2: builder ──────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Ambil SEMUA yang sudah diinstall (termasuk symlinks monorepo)
COPY --from=deps /app ./

# Copy sisa source code yang belum ada (karena deps cuma copy manifest)
COPY . .

# Build pake turbo biar pinter (dia bakal handle urutan build otomatis)
# Kalau gak pake turbo, pake perintah manual lu yang tadi juga gaperlu pindah dir
RUN npx tsc -p packages/types/tsconfig.json
RUN npx tsc -p packages/utils/tsconfig.json

# Compile NestJS
RUN cd apps/api && npx nest build