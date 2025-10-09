# ================================
# Build Stage - Uses full Node.js for building
# ================================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --no-cache

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ================================
# Production Stage - Uses minimal runtime image
# ================================
FROM node:20-alpine AS runner

# Install curl for health checks
RUN apk add --no-cache curl

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set working directory
WORKDIR /app

# Copy the built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port 3000
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=http://backend:8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Start the optimized standalone production server
CMD ["node", "server.js"]
