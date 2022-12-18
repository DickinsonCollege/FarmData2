# Specifies the image of your engine
FROM node

# The working directory inside your container
WORKDIR /app

# Get the package.json first to install dependencies
ADD package.json /app
# This will install those dependencies
RUN npm install

# Copy the rest of the app to the working directory
ADD . /app

# Run the container
CMD ["npm", "start"]