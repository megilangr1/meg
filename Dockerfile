# Production-style image, modelled on examples/with-docker (canary):
# dependencies -> builder -> migrator (prisma CLI) -> runner (standalone, non-root)
ARG NODE_VERSION=22-bookworm-slim

# ============================================
# Stage 1: dependencies
# ============================================
FROM node:${NODE_VERSION} AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

# ============================================
# Stage 2: build (standalone output)
# ============================================
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
# NEXT_PUBLIC_* is inlined at build time, so it must exist here, not just at runtime
ARG NEXT_PUBLIC_APP_URL=https://meggi.chiro-it.site
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# build-time placeholders only: the app reads the real values from the runtime env
ENV BETTER_AUTH_URL=https://meggi.chiro-it.site
ENV BETTER_AUTH_SECRET=build-time-placeholder-not-used-at-runtime
ENV DATABASE_URL=mysql://build:build@127.0.0.1:3306/build
RUN npx prisma generate && npm run build

# ============================================
# Stage 3: migrator (one-shot: migrate deploy + seed)
# Kept out of the runner so the runtime image stays minimal and non-root.
# ============================================
FROM node:${NODE_VERSION} AS migrator
WORKDIR /app
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*
COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json package-lock.json prisma.config.ts tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
RUN npx prisma generate
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed"]

# ============================================
# Stage 4: runner (minimal, non-root)
# ============================================
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

RUN groupadd --system --gid 1001 nodejs \
 && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3001

HEALTHCHECK --interval=10s --timeout=5s --start-period=20s --retries=5 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:'+(process.env.PORT||3001)+'/api/auth/ok').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]

CMD ["node", "server.js"]
