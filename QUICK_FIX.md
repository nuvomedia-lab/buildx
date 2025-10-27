# Quick Fix: Activate Admin User on Remote Server

## Problem
Your admin account is deactivated on the remote server (`isActive: false`)

## Solution 1: Run the Activation Script

SSH into your remote server and run:

```bash
npm run activate-admin
```

This will activate the admin user and set status to APPROVED.

## Solution 2: Manual Database Update

If you have direct database access:

```sql
UPDATE users 
SET "isActive" = true, status = 'APPROVED' 
WHERE email = 'ameh.frank@yahoo.com';
```

## Solution 3: Re-seed the Admin

```bash
npm run seed
```

This will update the existing admin user's `isActive` status.

## After Activation

Try logging in again with:
- **Email:** `ameh.frank@yahoo.com`
- **Password:** `Password@1234`

## Prevention

Add to your deployment process to always ensure admin is active:

```bash
# Add to deployment script
npm run seed
```

Or add this to your CI/CD pipeline to run after deployment.

