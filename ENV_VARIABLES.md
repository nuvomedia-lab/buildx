# BuildX Environment Variables

Copy this file to `.env` in the root directory and replace the placeholder values.

## Setup Instructions

1. Copy this file:
   ```bash
   cp ENV_VARIABLES.md .env
   ```

2. Replace all placeholder values with your actual credentials

3. Never commit the `.env` file to git (it's already in `.gitignore`)

---

## Environment Variables Template

```env
# ===========================================
# DATABASE CONFIGURATION
# ===========================================
DATABASE_URL="postgresql://user:password@localhost:5432/buildx_db?schema=public"

# ===========================================
# JWT SECURITY
# ===========================================
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
JWT_RESET_SECRET="your-super-secret-reset-key-change-in-production"

# ===========================================
# ZEPTOMAIL EMAIL CONFIGURATION
# ===========================================
# Sign up at https://www.zeptomail.com
# Get API key from Settings → API Keys
ZEPTO_API_URL="https://api.zeptomail.com/v1.1/email/template"
ZEPTO_PASSWORD="REPLACE_WITH_YOUR_ZEPTOMAIL_API_KEY"
ZEPTO_FROM="noreply@buildx.app"
ZEPTO_FROM_NAME="BuildX"

# Backup for generic mail (if not using Zeptomail)
MAIL_FROM="noreply@buildx.app"

# Traditional SMTP (backup/unused if using Zeptomail)
MAIL_HOST="smtp.zeptomail.com"
MAIL_PORT=587
MAIL_USER="your-mail-username"
MAIL_PASSWORD="your-mail-password"

# ===========================================
# EMAIL TEMPLATE IDs (Zeptomail)
# ===========================================
# After uploading templates to Zeptomail, update these IDs
ZEPTO_INVITE_TEMPLATE_ID="member-invitation"
ZEPTO_ONBOARDING_OTP_TEMPLATE_ID="onboarding-otp"
ZEPTO_FORGOT_TEMPLATE_ID="forgot-password"

# ===========================================
# FRONTEND URL
# ===========================================
# Update this to your production URL when deploying
FRONTEND_URL="http://localhost:3000"

# ===========================================
# GOOGLE OAUTH
# ===========================================
GOOGLE_CLIENT_ID="REPLACE_WITH_YOUR_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="REPLACE_WITH_YOUR_GOOGLE_CLIENT_SECRET"
GOOGLE_REDIRECT_URI="http://localhost:3001/auth/google/callback"

# ===========================================
# MICROSOFT OAUTH
# ===========================================
MS_CLIENT_ID="REPLACE_WITH_YOUR_MICROSOFT_CLIENT_ID"
MS_CLIENT_SECRET="REPLACE_WITH_YOUR_MICROSOFT_CLIENT_SECRET"
MS_TENANT_ID="REPLACE_WITH_YOUR_TENANT_ID"
MS_REDIRECT_URI="http://localhost:3001/auth/microsoft/callback"

# ===========================================
# SERVER CONFIGURATION
# ===========================================
PORT=3001
NODE_ENV="development"

# ===========================================
# ADMIN USER SEED CONFIGURATION
# ===========================================
# Used when running npm run seed
SEED_ADMIN_EMAIL="ameh.frank@yahoo.com"
SEED_ADMIN_PASSWORD="Password@1234"
SEED_ADMIN_FULLNAME="Ameh Frank"
SEED_ADMIN_PHONE=null
SEED_ADMIN_AVATAR=null
```

## Required Values to Replace

### 1. Database (`DATABASE_URL`)
- Your PostgreSQL connection string
- Format: `postgresql://username:password@host:port/database_name`

### 2. JWT Secrets
- Generate secure random strings for production
- You can use: `openssl rand -base64 32`

### 3. Zeptomail API Key (`ZEPTO_PASSWORD`)
- Sign up at https://www.zeptomail.com
- Get your API key from Settings → API Keys
- Replace `REPLACE_WITH_YOUR_ZEPTOMAIL_API_KEY`

### 4. Email From Address (`MAIL_FROM`)
- Use your verified domain email
- Example: `noreply@yourdomain.com`

### 5. OAuth Credentials
- **Google:** Get from https://console.cloud.google.com
- **Microsoft:** Get from https://portal.azure.com

### 6. Frontend URL
- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`

## After Setup

1. Upload email templates to Zeptomail (see `email-templates/TEMPLATE_LIST.md`)
2. Update template IDs if they differ
3. Run migrations: `npm run prisma:migrate`
4. Run seed: `npm run seed`
5. Start server: `npm run start:dev`

## Security Notes

- Never commit `.env` file to version control
- Use strong, unique passwords for JWT secrets
- Rotate API keys regularly
- Use environment-specific `.env` files for dev/staging/production

