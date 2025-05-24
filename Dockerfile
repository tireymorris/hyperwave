FROM oven/bun:1 AS base
WORKDIR /usr/src/app

FROM base AS install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS release
COPY --from=install /usr/src/app/node_modules node_modules
COPY . ./
RUN cp .env.example .env

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_PATH=/data/app.db

RUN mkdir -p /data

USER bun
EXPOSE 3000/tcp
ENTRYPOINT ["bun", "run", "src/server.tsx"]
