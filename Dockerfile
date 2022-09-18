# specify the node base image with your desired version node:<version>
FROM node:16

WORKDIR /app

# Install app dependencies
COPY ./frontend/ ./build/frontend/

WORKDIR /app/build/frontend
RUN npm install --force
RUN npm run build
RUN mv ./dist/evil-vilage ../../angularBuild/
WORKDIR /app
RUN rm -r ./build/frontend


COPY ./backend ./build/backend

WORKDIR /app/build/backend

RUN npm install
RUN npm run build

WORKDIR /app

RUN mv ./build/backend/build/* ./


RUN rm -r ./build/backend

# Bundle app source
COPY ./backend/package*.json ./
COPY ./backend/names.json ./
COPY ./backend/json/ ./json/
COPY ./backend/maps/ ./maps/

RUN npm install -P

# replace this with your application's default port
EXPOSE 3000
CMD [ "node", "index.js" ]