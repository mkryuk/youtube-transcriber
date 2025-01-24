# Use a Node.js 18 base image
FROM node:18-alpine

# Install Python and other necessary tools
RUN apk add --no-cache python3 py3-pip make g++ bash ffmpeg

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose a port (if required, optional for console apps)
EXPOSE 3000

# Set the command to run the application
CMD ["npx", "ts-node", "src/index.ts"]
