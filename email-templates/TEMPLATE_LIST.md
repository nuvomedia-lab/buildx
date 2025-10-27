# BuildX Email Templates

This document lists all email templates required for the BuildX platform with their placeholders.

## Template List

### 1. Member Invitation (member-invitation)
**File:** `invitation.html`  
**Subject:** Invitation to Join Build X  
**Placeholders:**
- `{{admin_name}}` - Name of the admin sending invitation
- `{{role}}` - Assigned role (PM, QS, SEF, etc.)
- `{{invite_url}}` - Registration link with token
- `{{expiry_hours}}` - Link expiration time

**Usage:** Sent when admin invites a new member

---

### 2. Onboarding OTP (onboarding-otp)
**File:** `onboarding-otp.html`  
**Subject:** Complete Your Registration  
**Placeholders:**
- `{{fullname}}` - User's full name
- `{{otp}}` - 6-digit verification code

**Usage:** Sent during onboarding when user clicks invitation link

---

### 3. Password Reset OTP (forgot-password)
**File:** `forgot-password.html`  
**Subject:** Reset Your Password  
**Placeholders:**
- `{{fullname}}` - User's full name
- `{{otp}}` - 6-digit verification code

**Usage:** Sent when user requests password reset or admin triggers password reset

---

## Environment Variables

Copy the `.env.example` file to `.env` and fill in your values:

```bash
cp .env.example .env
```

### Required Email Template Variables:

```env
# Zeptomail API Configuration
ZEPTO_API_URL=https://api.zeptomail.com/v1.1/email/template
ZEPTO_PASSWORD=your_zeptomail_api_key_here
MAIL_FROM=noreply@buildx.app

# Template IDs (Update after uploading to Zeptomail)
ZEPTO_INVITE_TEMPLATE_ID=member-invitation
ZEPTO_ONBOARDING_OTP_TEMPLATE_ID=onboarding-otp
ZEPTO_FORGOT_TEMPLATE_ID=forgot-password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### How to Get Zeptomail API Key:

1. Sign up at [Zeptomail](https://www.zeptomail.com)
2. Go to **Settings** → **API Keys**
3. Create a new API key
4. Copy and paste it in your `.env` file as `ZEPTO_PASSWORD`

## Uploading to Zeptomail

1. Log into [Zeptomail Dashboard](https://app.zeptomail.com)
2. Navigate to **Templates**
3. Click **Create New Template**
4. For each template:
   - Upload the HTML file
   - Set the Template ID (as specified above)
   - Configure merge variables in the template settings
   - Test with sample data

## Template IDs Reference

| Template ID | Purpose | Expires |
|------------|---------|---------|
| `member-invitation` | Invite new members | 7 days |
| `onboarding-otp` | Complete registration | 3 minutes |
| `forgot-password` | Reset password | 15 minutes |

## Notes

- All templates use the same color scheme and branding
- Templates are responsive and mobile-friendly
- All merge variables are wrapped in double curly braces `{{variable}}`
- Expiration times are configurable in the code
- Templates include security notices about expiration and unauthorized use

