# Use the official node base image
FROM node:latest

# Create a directory inside the container to store the application code
WORKDIR /app

# Copy package.json and package-lock.json to the newly created directory
COPY package*.json . /app

# Install the application dependencies using npm
RUN npm install --legacy-peer-deps

# Copy the application source code to the newly created directory
COPY . .

# Tell the Docker app that it will be served on port 3000
EXPOSE 3000

# Define the application startup command
CMD ["npm", "start"]