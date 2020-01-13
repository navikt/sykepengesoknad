FROM node

WORKDIR /usr/src/app
COPY . .

RUN npm install express path mustache-express promise prom-client dotenv jsdom request

RUN npm run nais-build

EXPOSE 8080

CMD ["npm", "start"]
