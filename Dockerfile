FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json and lockfile
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
# We don't need to copy .env file, environment variables will be provided in docker-compose
ENV NODE_ENV=production
# During build, use dummy values for any required environment variables (they'll be replaced at runtime)
ENV MONGODB_URI="mongodb+srv://cpl:266696687@curlware.s8xco.mongodb.net/?retryWrites=true&w=majority&appName=Curlware"
ENV JWT_SECRET=dummy-build-secret
ENV IMAGEKIT_PRIVATE_KEY=private_GXKh12J0vpBsX9Ae563qq7CLxLU=
ENV IMAGEKIT_PUBLIC_KEY=public_FDarbtqogcccz1AM0mjcCOV7p/8=
ENV NEXT_PUBLIC_APP_URL=http://localhost:3000
ENV NEXT_PUBLIC_API=http://localhost:3000/api
ENV NEXT_SKIP_API_CALLS=true
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create a non-root user to run the app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next && chown nextjs:nodejs .next

# Copy built application
COPY --from=builder /app/public ./public

# Set proper permissions for the public directory
RUN chown -R nextjs:nodejs ./public

# Copy .next directory and standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
