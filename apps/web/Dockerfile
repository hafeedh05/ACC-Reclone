FROM node:22-alpine

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/web ./apps/web
COPY packages/contracts ./packages/contracts

RUN pnpm install --frozen-lockfile
RUN pnpm --dir apps/web build

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["pnpm", "--dir", "apps/web", "start", "-p", "8080"]
