FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install --ignore-scripts

# Copy application code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 8000

# Run with Node
CMD ["node", "dist/index.js"]
