# Use Alpine here because its small and we don't need to add anything.
FROM node:alpine3.17

WORKDIR /app

# Get the package.json and install dependencies
COPY package.json .
RUN npm install

# Start the express api hander.
CMD ["npm", "start"]