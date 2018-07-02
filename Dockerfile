FROM node:8

WORKDIR "/app"

# Install app dependencies
COPY package.json .
RUN npm install

# Bundle app source
COPY . .

RUN node_modules/.bin/gulp js

EXPOSE 8080
WORKDIR "/app/src/server"
CMD [ "node", "--require", "ts-node/register", "server.ts" ]
