ARG NODE_VERSION=18.16.0

FROM node:${NODE_VERSION}-alpine as development

WORKDIR /usr/src/app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci   

COPY . .

EXPOSE 4000

CMD npm run start:docker