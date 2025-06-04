This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### Docker Setup

This project includes Docker configuration for easy deployment with Node.js v22 and MongoDB Atlas.

### Quick Start with Docker

The easiest way to get started is by using our setup script:

```bash
./docker-setup.sh
```

This script will:

1. Use your existing `.env` file if available
2. Create an `.env` file from the template if needed
3. Configure all environment variables automatically
4. Build and start the Docker container

### Manual Configuration

If you prefer to configure Docker manually:

1. Set the required environment variables:

```bash
export MONGODB_URI="mongodb+srv://username:password@cluster0.example.mongodb.net/database?retryWrites=true&w=majority"
export JWT_SECRET="your-secret-key"
export NEXT_PUBLIC_APP_URL="http://localhost:3001"
```

2. Build and start the Docker container:

```bash
docker compose up -d
```

3. To stop the container:

```bash
docker compose down
```

5. To rebuild the application after changes:

```bash
docker compose up -d --build
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# cpl

# ingress-solution

# ingress-solution

# cpl-next
