FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

COPY . .

EXPOSE 3000

RUN yarn install --frozen-lockfile

RUN yarn build
CMD ["yarn", "start:migrate:prod"]