# BuildX Deployment Guide

## Pre-Deployment Checklist

1. ✅ Database migrations have been run
2. ✅ Admin user has been seeded
3. ✅ Environment variables are configured
4. ✅ Email templates are uploaded to Zeptomail

## First Time Setup (Remote Server)

### 1. Set up Environment Variables

Create a `.env` file on your remote server with all required variables (see `ENV_VARIABLES.md`)

### 2. Generate Prisma Client

```bash
npm install
npx prisma generate
```

### 3. Run Database Migrations

```bash
npm run prisma:migrate
# Or for production:
npm run prisma:deploy
```

### 4. Seed Admin User

```bash
npm run seed
```

This creates the admin user with:
- Email: `ameh.frank@yahoo.com` (or from your .env)
- Password: `Password@1234` (or from your .env)
- Role: Admin (AD)
- Status: APPROVED
- isActive: true

### 5. Build and Start

```bash
npm run build
npm run start:prod
```

## Production Environment Variables

Key variables for production:

```env
# Database
DATABASE_URL="postgresql://..."

# JWT Secrets (use strong random strings)
JWT_SECRET="your-production-secret"
JWT_REFRESH_SECRET="your-production-refresh-secret"
JWT_RESET_SECRET="your-production-reset-secret"

# Zeptomail
ZEPTO_API_URL="https://api.zeptomail.com/v1.1/email/template"
ZEPTO_PASSWORD="your-zeptomail-api-key"
ZEPTO_FROM="noreply@yourdomain.com"
ZEPTO_FROM_NAME="BuildX"

# Frontend
FRONTEND_URL="https://your-production-domain.com"

# Server
NODE_ENV="production"
PORT=3001
```

## Deployment Scripts

### For Heroku/Render/Vercel:

Add these scripts to your `package.json` (if not already present):

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "deploy": "prisma migrate deploy && npm run seed"
  }
}
```

### For Docker:

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
```

Add to docker-compose.yml:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3001:3001"
    env_file:
      - .env
    command: sh -c "prisma migrate deploy && npm run seed && npm run start:prod"
```

## Common Issues

### Admin user is deactivated

Run the seed script again:
```bash
npm run seed
```

### Database connection error

- Check your `DATABASE_URL` is correct
- Ensure the database server is running
- Verify network access and firewall rules

### Email not sending

- Verify `ZEPTO_PASSWORD` is set
- Check template IDs in Zeptomail dashboard
- Ensure `ZEPTO_FROM` email is verified in Zeptomail

### Prisma Client errors

Run:
```bash
npx prisma generate
```

## Maintenance

### Update Admin Password

1. Log in to your database
2. Update the user table directly, or
3. Use the seed script with new credentials

### Backup Database

```bash
pg_dump $DATABASE_URL > backup.sql
```

### Restore Database

```bash
psql $DATABASE_URL < backup.sql
```

