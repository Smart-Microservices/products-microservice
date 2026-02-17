FROM node:22-alpine3.19

WORKDIR /usr/src/app

COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

ARG DATABASE_URL="file:./dev.db"
ENV DATABASE_URL=$DATABASE_URL

RUN pnpm dlx prisma generate

EXPOSE 3000
