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

