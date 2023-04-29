ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine AS base
RUN apk add --no-cache cpio findutils git
RUN yarn config set --home enableTelemetry 0