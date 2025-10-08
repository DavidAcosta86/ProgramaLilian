# Use Node.js 20 Alpine for smaller image
FROM node:20-alpine

# Install curl for health check
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . ./

# Build the Next.js application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Set Next.js to serve in production
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=http://backend:8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Start the application
CMD ["npm", "run", "start"]
