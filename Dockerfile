# Base stage for building the static files
FROM node:24.16.0 AS base
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@11.2.2 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Runtime stage for serving the application
FROM nginx:1.31.0-alpine-slim@sha256:241b0d0fe06250e026e7a35a008d022c9a1d3bec19442d65cc33b84d0b5dd64d AS runtime
COPY --from=base /app/dist /usr/share/nginx/html
EXPOSE 80
