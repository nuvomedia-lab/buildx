# Fix: isActive is undefined on AWS

## Problem
`isActive: undefined` in logs means Prisma client is outdated

## Solution

On your AWS server, run:

```bash
npx prisma generate
npm run build
pm2 restart all
```

This will:
1. Regenerate Prisma client with `isActive` field
2. Rebuild the app
3. Restart the server

## After Regeneration

Try login again. You should see:
```
[LOGIN] User found - ID: 1, Role: AD, isActive: true
```

## Quick Commands

```bash
# SSH into AWS
ssh ubuntu@your-aws-ip

# Navigate to project
cd /home/ubuntu/buildx

# Regenerate Prisma
npx prisma generate

# Rebuild
npm run build

# Restart
pm2 restart all

# Watch logs
pm2 logs --follow
```

