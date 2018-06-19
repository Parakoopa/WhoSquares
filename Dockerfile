FROM nexus.informatik.haw-hamburg.de/node:8

# Install app dependencies
COPY package.json .
RUN npm install

# Bundle app source
COPY . .

EXPOSE 8080
WORKDIR "src/server"
CMD [ "node", "--require", "ts-node/register", "server.ts" ]
