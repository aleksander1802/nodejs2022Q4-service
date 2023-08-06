FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN npx prisma generate

RUN npm run build

RUN npm cache clean --force

FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/ .

RUN npm install --production

RUN npm install @nestjs/config

EXPOSE 3000

CMD ["node", "dist/main.js"]

