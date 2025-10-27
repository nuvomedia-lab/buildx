# BuildX API Documentation

## Overview

BuildX is a RESTful API built with NestJS framework. This documentation provides comprehensive information about all available endpoints, request/response formats, authentication, and usage examples.

## Base URL

```
http://localhost:3000
```

## Swagger Documentation

Interactive API documentation is available at:
```
http://localhost:3000/api
```

## Authentication

The API uses Bearer Token authentication (JWT). Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Getting a Token

To obtain a JWT token, you'll need to implement authentication endpoints or use your existing authentication system. The token should be included in all protected endpoints.

## API Endpoints

### General Endpoints

#### Get Hello Message

**Endpoint:** `GET /`

**Description:** Returns a greeting message with timestamp and version information. This is a simple endpoint to test the API connectivity.

**Authentication:** Required (Bearer Token)

**Request:**
```http
GET / HTTP/1.1
Host: localhost:3000
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Response:**

**Success Response (200 OK):**
```json
{
  "message": "Hello World!",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Something went wrong on our end",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Admin Members Endpoints

#### Send Invitation to Member

**Endpoint:** `POST /adminmembers/invite`

**Description:** Invites a new member to join BuildX by creating a user account and sending an email invitation. The invited member will receive an email with an invitation token and temporary password.

**Authentication:** Not required (but should be protected in production)

**Request:**
```http
POST /adminmembers/invite HTTP/1.1
Host: localhost:3000
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "member@example.com",
  "phoneNumber": "+1234567890",
  "role": "PM",
  "activities": ["activity1", "activity2"],
  "fullname": "John Doe"
}
```

**Request Fields:**
- `email` (required): The email address of the member to invite
- `phoneNumber` (optional): The phone number of the member
- `role` (required): The role of the member (PM, QS, SEF, SK, PROC, ACC, AD)
  - `PM`: Project Manager
  - `QS`: Quantity Surveyor
  - `SEF`: Site Engineer/Foreman
  - `SK`: Store Keeper
  - `PROC`: Procurement
  - `ACC`: Accountant
  - `AD`: Admin
- `activities` (optional): Array of activities the member has access to. Leave empty or include "ALL" for full access
- `fullname` (optional): The full name of the member

**Response:**

**Success Response (200 OK):**
```json
{
  "message": "Invitation sent successfully",
  "userId": 123,
  "email": "member@example.com"
}
```

**Error Response (409 Conflict):**
```json
{
  "statusCode": 409,
  "message": "User with this email already exists"
}
```

**Error Response (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": "Invalid input"
}
```

**Notes:**
- The invited member will receive an email with an invitation token and temporary password
- The email contains a link to complete registration
- The user account is created with `PENDING` approval status
- Environment variables:
  - `ZEPTO_INVITE_TEMPLATE_ID`: Email template ID for member invitations
  - `FRONTEND_URL`: Frontend URL for registration completion

### Onboarding Endpoints

The onboarding flow allows invited members to complete their registration in 5 steps.

#### Step 1: Send OTP

**Endpoint:** `POST /onboarding/send-otp`

**Description:** Sends a 6-digit OTP to the user's email after they click the invitation link.

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
- Token from invitation email should be used

---

#### Step 2: Verify OTP

**Endpoint:** `POST /onboarding/verify-otp`

**Description:** Verifies the OTP code entered by the user.

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

---

#### Step 3: Set Password

**Endpoint:** `POST /onboarding/set-password`

**Description:** Sets the user's password.

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

---

#### Step 4: Save Personal Details

**Endpoint:** `POST /onboarding/personal-details`

**Description:** Saves first name, last name, and avatar URL.

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

---

#### Step 5: Confirm Details

**Endpoint:** `POST /onboarding/confirm`

**Description:** Final step to confirm all details and complete registration.

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

---

**Onboarding Flow:**
1. User clicks invitation link → send-otp
2. User enters OTP → verify-otp
3. User sets password → set-password
4. User uploads image (Cloudinary), then saves details → personal-details
5. User confirms → confirm

## Response Formats

### Success Response Format

All successful responses follow this general structure:

```json
{
  "data": "response_data_here",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

### Error Response Format

All error responses follow this structure:

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Detailed error information",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200  | OK - Request successful |
| 400  | Bad Request - Invalid request parameters |
| 401  | Unauthorized - Authentication required |
| 403  | Forbidden - Insufficient permissions |
| 404  | Not Found - Resource not found |
| 500  | Internal Server Error - Server error |

## Content Types

- **Request Content-Type:** `application/json`
- **Response Content-Type:** `application/json`

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## Error Handling

The API uses standard HTTP status codes and returns detailed error messages in JSON format. Common error scenarios:

1. **Authentication Errors (401):** Missing or invalid JWT token
2. **Validation Errors (400):** Invalid request parameters or malformed JSON
3. **Not Found Errors (404):** Requested resource doesn't exist
4. **Server Errors (500):** Internal server issues

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run start:dev
   ```

4. Access the API at `http://localhost:3000`
5. Access Swagger documentation at `http://localhost:3000/api`

### Available Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run build` - Build the application
- `npm run test` - Run tests
- `npm run test:e2e` - Run end-to-end tests

## Testing the API

### Using cURL

```bash
# Test the hello endpoint
curl -X GET "http://localhost:3000/" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json"
```

### Using Postman

1. Import the Swagger documentation from `http://localhost:3000/api`
2. Set up authentication with your JWT token
3. Test the endpoints

## Contributing

1. Follow the existing code structure
2. Add proper Swagger decorators for new endpoints
3. Update this documentation for any new endpoints
4. Write tests for new functionality

## Version History

- **v1.0.0** - Initial release with basic hello endpoint

## Support

For support and questions, please refer to the project documentation or contact the development team.

## License

This project is licensed under the UNLICENSED license.

