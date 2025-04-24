FROM node:slim

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies without running scripts
RUN npm install --ignore-scripts

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Run the MCP server
CMD ["node", "build/mx-api-index.js"]
