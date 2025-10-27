# Onboarding Module

This module handles the user onboarding flow for invited members to complete their registration.

## Endpoints

### POST `/onboarding/send-otp`

Sends a 6-digit OTP to the user's email after they click the invitation link.

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "message": "OTP sent to your email",
  "email": "user@example.com"
}
```

**Notes:**
- OTP expires in 3 minutes
- OTP is sent via email using the template specified in `ZEPTO_ONBOARDING_OTP_TEMPLATE_ID`

---

### POST `/onboarding/verify-otp`

Verifies the OTP code entered by the user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "OTP verified successfully",
  "onboardingToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Notes:**
- OnboardingToken is valid for 1 hour
- Token should be used for subsequent onboarding steps

---

### POST `/onboarding/set-password`

Sets the user's password after OTP verification.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!"
}
```

**Response:**
```json
{
  "message": "Password set successfully",
  "email": "user@example.com"
}
```

**Validation:**
- Password must be at least 8 characters long
- Password and confirmPassword must match
- Passwords are hashed using bcrypt

---

### POST `/onboarding/personal-details`

Saves the user's personal details including first name, last name, and avatar URL.

**Request Body:**
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "avatarUrl": "https://res.cloudinary.com/..."
}
```

**Response:**
```json
{
  "message": "Personal details saved successfully",
  "email": "user@example.com",
  "fullname": "John Doe"
}
```

**Notes:**
- `avatarUrl` is optional
- The avatar URL should be provided from Cloudinary upload
- First name and last name are combined into the `fullname` field

---

### POST `/onboarding/confirm`

Final endpoint to confirm all details and complete registration.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Registration completed successfully",
  "email": "user@example.com",
  "fullname": "John Doe",
  "role": "PM",
  "status": "APPROVED"
}
```

**Notes:**
- Changes user status from `PENDING` to `APPROVED`
- Validates that all previous steps are completed
- Returns user details upon successful completion

---

## Onboarding Flow

1. User clicks invitation link with token → Frontend calls `send-otp`
2. OTP received via email → User enters OTP → Frontend calls `verify-otp`
3. Get onboarding token → Frontend calls `set-password`
4. Upload image to Cloudinary (separate frontend flow) → Frontend calls `personal-details` with Cloudinary URL
5. Frontend calls `confirm` to complete registration

## Environment Variables

- `ZEPTO_ONBOARDING_OTP_TEMPLATE_ID`: Email template ID for onboarding OTP
- `JWT_SECRET`: Secret for signing JWT tokens

## User Status Flow

- **PENDING**: Initial status when user is invited (adminmembers)
- **APPROVED**: Status after successful onboarding completion

## Error Handling

- All endpoints return appropriate HTTP status codes (400, 401, 404)
- Detailed error messages for validation failures
- OTP verification includes attempt tracking
- Password validation enforces minimum security requirements

