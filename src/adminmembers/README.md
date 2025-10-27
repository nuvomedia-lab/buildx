# Admin Members Module

This module handles the invitation and management of team members by administrators.

## Endpoints

### POST `/adminmembers/invite`

Invite a new member to join BuildX by sending them an email invitation.

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

**Fields:**
- `email` (required): The email address of the member to invite
- `phoneNumber` (optional): The phone number of the member
- `role` (required): The role of the member (PM, QS, SEF, SK, PROC, ACC, AD)
- `activities` (optional): Array of activities the member has access to. For "all access", include "ALL" in the array or leave it empty
- `fullname` (optional): The full name of the member

**Response:**
```json
{
  "message": "Invitation sent successfully",
  "userId": 123,
  "email": "member@example.com"
}
```

**Email Invitation:**
The endpoint automatically sends an email to the invited member containing:
- An invitation token
- A temporary password (for initial login)
- A link to complete registration
- Their assigned role and activities

**Environment Variables:**
- `ZEPTO_INVITE_TEMPLATE_ID`: The email template ID for member invitations
- `FRONTEND_URL`: The frontend URL for registration completion

**Error Responses:**
- `409 Conflict`: User with the email or phone number already exists
- `400 Bad Request`: Invalid input or failed to send invitation

## Database Schema

The module creates users with the following status:
- Status: `PENDING` (awaiting completion of registration)
- Users must complete registration using the invitation link before they can access the system

## Role Enum

Available roles:
- `PM`: Project Manager
- `QS`: Quantity Surveyor
- `SEF`: Site Engineer/Foreman
- `SK`: Store Keeper
- `PROC`: Procurement
- `ACC`: Accountant
- `AD`: Admin

## Activities

Activities are stored as an array of strings. The invited member will have access to the specified activities. For full access, you can include "ALL" as an activity or leave the activities array empty (defaults to all access).

