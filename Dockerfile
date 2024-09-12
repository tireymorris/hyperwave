# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Env vars
ENV NODE_ENV=production

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=prerelease /usr/src/app .
COPY --from=install /temp/dev/node_modules node_modules
COPY --from=prerelease /usr/src/app/public public

# run the app
USER bun
EXPOSE 3000/tcp
WORKDIR /usr/src/app
ENV PORT=3000
ENTRYPOINT ["bun", "run", "src/server.tsx"]
