# Install dependencies only when needed
FROM node:16-alpine AS BASE
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:16-alpine AS BUILD

WORKDIR /app

COPY --from=BASE /app/node_modules ./node_modules

COPY . .

RUN yarn build

# Production image, copy all the files and run next
FROM node:16-alpine AS PRODUCTION
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=BUILD /app/node_modules ./node_modules
COPY --from=BUILD /app/public ./public
COPY --from=BUILD /app/package.json ./package.json


COPY --from=BUILD /app/.next/standalone ./
COPY --from=BUILD /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]