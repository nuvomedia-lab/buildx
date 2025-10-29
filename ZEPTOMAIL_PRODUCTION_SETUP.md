# Zeptomail: Switch from Sandbox to Production

## Steps to Enable Production Mode

1. **Log into Zeptomail Dashboard**
   - Go to https://app.zeptomail.com
   - Sign in with your account

2. **Navigate to Settings**
   - Click on your profile/settings icon
   - Go to **Account Settings** or **Subscription**

3. **Upgrade to Production**
   - Look for "Sandbox Mode" toggle or status
   - Click **"Upgrade to Production"** or **"Enable Production Mode"**
   - Complete the upgrade process (may require payment/billing setup)

4. **Verify Domain**
   - In sandbox, emails only go to verified test addresses
   - In production, you need to verify your sending domain
   - Go to **Settings** → **Domains**
   - Add your domain (e.g., `yourdomain.com`)
   - Add the required DNS records (SPF, DKIM, DKIM-S)

5. **Update DNS Records**
   
   Add these records to your domain's DNS:
   
   **SPF Record:**
   ```
   Type: TXT
   Name: @
   Value: v=spf1 include:zeptomail.net ~all
   ```
   
   **DKIM Records:**
   (Zeptomail will provide specific DKIM keys)
   
6. **Verify Domain**
   - Once DNS records are added, verify in Zeptomail dashboard
   - Status should change to "Verified"

7. **Update Sender Address**
   
   In your `.env`:
   ```env
   ZEPTO_FROM="noreply@yourdomain.com"  # Change to your verified domain
   ZEPTO_FROM_NAME="BuildX"
   ```

## Important Notes

- **Sandbox Mode**: Emails only send to verified test addresses
- **Production Mode**: Can send to any email address
- **Domain Verification**: Required for production to prevent spam
- **DNS Propagation**: Can take 24-48 hours for DNS changes

## After Upgrade

1. Test email sending
2. Check spam folder initially
3. Monitor email delivery

## Troubleshooting

If emails bounce:
- Check DNS records are correct
- Wait for DNS propagation
- Verify domain in Zeptomail dashboard
- Check spam score in email headers

