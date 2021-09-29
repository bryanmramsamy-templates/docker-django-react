FROM node:latest

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json .
COPY yarn.lock .

RUN yarn
RUN npx browserslist@latest --update-db

COPY . .

CMD ["yarn", "start"]
