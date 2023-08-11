ARG NODE_VERSION=18.16.0

FROM node:${NODE_VERSION}-alpine as base

WORKDIR /usr/src/app

COPY prisma /usr/src/app/prisma
COPY test /usr/src/app/test

FROM base as deps

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

FROM deps as build

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

FROM base as final

ENV NODE_ENV production

USER node

COPY package.json .

COPY test ./test
COPY prisma ./prisma
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/test ./test
COPY doc ./doc

EXPOSE 4000

CMD npm run start:docker