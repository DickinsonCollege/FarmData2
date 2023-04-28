# Use Alpine here because its small and we don't need to add anything.
FROM node:alpine3.17

WORKDIR /app

# Get the package.json, package-lock.json and install the dependencies
# NOTE: Use npm ci here so that we use package-lock.json and
#       so that we are alerted if there are any changes.
COPY package.json package-lock.json ./
RUN npm ci

# Start the express api hander.
CMD ["npm", "start"]