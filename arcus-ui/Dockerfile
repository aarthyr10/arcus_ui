FROM node:lts-alpine AS build

WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:lts-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./build

EXPOSE 5173

CMD ["serve", "-s", "build", "-l", "5173"]
