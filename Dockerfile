# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Stage 1 -- build
#
# This project has no backend and no third-party services -- the only
# environment variable it uses is VITE_ADMIN_PASSWORD (see the
# "Environment variables" section of README.md for what it does and, more
# importantly, what it does NOT protect against). Vite bakes VITE_-
# prefixed variables into the compiled JS at BUILD time, so it has to be
# supplied as a build ARG here, not a runtime -e flag on `docker run`.
# ---------------------------------------------------------------------------
FROM node:20-alpine AS build

ARG VITE_ADMIN_PASSWORD=changeme123
ENV VITE_ADMIN_PASSWORD=$VITE_ADMIN_PASSWORD

WORKDIR /app

# Copy lockfile + package.json first so this layer (and `npm ci`) is only
# invalidated when dependencies actually change, not on every source edit.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------------------------------------------------------------------------
# Stage 2 -- serve
#
# nginx:alpine is a few MB and needs no runtime beyond what's built in --
# appropriate for a project with "no budget for subscriptions": this
# image runs anywhere that can run a container, no paid platform required.
# Nothing from the build stage except the compiled dist/ folder makes it
# into this final image -- no source code, no node_modules, no ARG value
# lingering in a layer beyond the one that used it.
# ---------------------------------------------------------------------------
FROM nginx:1.27-alpine AS serve

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -q -O /dev/null http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
