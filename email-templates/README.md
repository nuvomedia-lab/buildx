# Email Templates for BuildX

## Invitation Email Template

The `invitation.html` template is designed for Zeptomail and matches the Build X brand design.

### Zeptomail Variables

When setting up this template in Zeptomail, you'll need to configure the following merge variables:

```json
{
  "admin_name": "Jennifer Sherry",
  "role": "Project Manager",
  "invite_url": "https://yourapp.com/complete-registration?token=...",
  "expiry_hours": "24 hours"
}
```

### How to Use with Zeptomail

1. **Log into Zeptomail Dashboard**
   - Navigate to Templates section
   - Click "Create New Template"

2. **Upload the HTML**
   - Copy the contents of `invitation.html`
   - Paste into the HTML editor in Zeptomail

3. **Set up Merge Variables**
   - In the template settings, configure the merge tags:
     - `{{admin_name}}` - Name of the admin who sent the invitation
     - `{{role}}` - The assigned role (PM, QS, SEF, SK, PROC, ACC, AD)
     - `{{invite_url}}` - The invitation link with token
     - `{{expiry_hours}}` - Link expiration time

4. **Configure Sending**
   - Set subject: "Invitation to Join Build X"
   - Set from: Your configured sender email
   - Ensure these variables are passed when sending the email

### Template Features

- ✅ Responsive design for mobile and desktop
- ✅ Dark background with geometric pattern
- ✅ White card with rounded corners
- ✅ Orange accent color (#ff6b35)
- ✅ Blue primary color (#1e40af)
- ✅ Professional construction-themed hero section
- ✅ Dynamic content placeholders
- ✅ Social media icons in footer
- ✅ 600px width (email-safe)

### Available Colors

- **Orange Accent**: `#ff6b35`
- **Blue Primary**: `#1e40af`
- **Dark Background**: `#1a1a1a`
- **White**: `#ffffff`
- **Dark Blue Footer**: `#0f172a`

### Environment Variables

Update your `.env` file to include:

```env
ZEPTO_INVITE_TEMPLATE_ID=your_template_id_here
```

### Usage in Code

When sending the invitation email in `adminmembers.service.ts`:

```typescript
await this.mailer.sendTemplate({
  to: dto.email,
  templateId: process.env.ZEPTO_INVITE_TEMPLATE_ID,
  subject: 'Invitation to Join Build X',
  variables: {
    admin_name: 'Jennifer Sherry', // Replace with actual admin
    role: dto.role,
    invite_url: inviteUrl,
    expiry_hours: '24 hours',
  },
});
```

### Design Notes

- The template uses a sans-serif font stack for compatibility
- Tables are used for layout (email HTML standard)
- Inline styles are used for maximum client compatibility
- The geometric pattern background adds visual interest
- Bullet points are customized with orange dots
- The CTA button stands out with blue color
- Footer has dark blue background with contact info

