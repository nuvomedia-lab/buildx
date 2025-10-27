# How to Seed Admin Data

## Quick Start

Run the seed command:
```bash
npm run seed
```

This creates an admin user with these default credentials:
- **Email:** `ameh.frank@yahoo.com` (or from .env)
- **Password:** `Password@1234` (or from .env)
- **Role:** Admin (AD)
- **Status:** Approved

## Custom Admin Credentials

To use custom credentials, create a `.env` file in the root directory:

```env
SEED_ADMIN_EMAIL="admin@yourcompany.com"
SEED_ADMIN_PASSWORD="YourSecurePassword123!"
SEED_ADMIN_FULLNAME="Admin User"
SEED_ADMIN_PHONE="+1234567890"
SEED_ADMIN_AVATAR="https://example.com/avatar.jpg"
```

Then run:
```bash
npm run seed
```

## What Gets Created

The seed script creates:
- ✅ Admin user with role `AD` (Admin)
- ✅ Status set to `APPROVED`
- ✅ Password is hashed using bcrypt
- ✅ If user already exists, it's skipped (upsert)

## Default Credentials

If no `.env` is configured, the seed uses:
- **Email:** `ameh.frank@yahoo.com`
- **Password:** `Password@1234`
- **Full Name:** `Ameh Frank`
- **Phone:** `null`
- **Avatar:** `null`

## After Seeding

You can log in with the admin credentials to:
1. Invite members
2. Manage user access
3. Deactivate/reactivate users

## Troubleshooting

### Error: Cannot find module
```bash
npm install
npm run build
npm run seed
```

### Error: Database connection
Make sure your `.env` has a valid `DATABASE_URL`

### User already exists
The seed uses `upsert`, so it won't create duplicates. It will update existing records if needed.

