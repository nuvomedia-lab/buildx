# Fix AWS Login Issue

## Problem
Same credentials work locally but fail on AWS with "Invalid credentials"

## Root Cause
AWS database has a different password hash than local

## Solution

### Option 1: Run Seed on AWS (Recommended)

SSH into your AWS instance and run:

```bash
npm run seed
```

This will:
- Update the admin password to match `Password@1234`
- Set `isActive: true`
- Set `status: APPROVED`

### Option 2: Run Activate Admin Script

If you just need to activate without changing password:

```bash
npm run activate-admin
```

### Option 3: Manual Database Update

If you have database access, run:

```sql
UPDATE users 
SET 
  password = '$2b$10$fkCMW/5LiNqIYhdtqAqTi.a2booTG85moIXZQ3GsEaDPVrwRNMw/a',
  "isActive" = true,
  status = 'APPROVED'
WHERE email = 'admin@buildx.local';
```

This uses the same password hash that works locally.

## After Fix

Try logging in:
- **Email:** `admin@buildx.local`
- **Password:** `Password@1234`

## Prevention

Add to your AWS deployment script:

```bash
# After deployment
npm run seed
```

This ensures the admin password always matches across environments.

