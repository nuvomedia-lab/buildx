# Base Response System

This module provides a standardized response format for all API endpoints in the BuildX application.

## Features

- **Consistent Response Format**: All endpoints return responses in the same structure
- **Automatic Response Wrapping**: Responses are automatically wrapped using interceptors
- **Error Handling**: Comprehensive error handling with detailed error information
- **Validation**: Built-in validation with custom error messages
- **Swagger Integration**: Full OpenAPI documentation support

## Response Structure

All API responses follow this structure:

```typescript
{
  isSuccessful: boolean;        // Whether the operation was successful
  responseMessage: string;      // Human-readable message
  responseCode: number;         // HTTP status code
  data?: any;                  // The actual response data
  errorResponse?: {            // Error details (only present on errors)
    errorCode: string;
    errorMessage: string;
    errorDetails?: any;
    timestamp: string;
  }
}
```

## Usage Examples

### Automatic Response Wrapping

The response interceptor automatically wraps all controller responses:

```typescript
@Controller('users')
export class UsersController {
  @Get()
  async findAll() {
    const users = await this.prisma.user.findMany();
    // Automatically wrapped in BaseResponseDto
    return users;
  }
}
```

### Manual Response Creation

For custom responses, use the ResponseService:

```typescript
@Controller('users')
export class UsersController {
  constructor(private responseService: ResponseService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.prisma.user.create({ data: createUserDto });
      return this.responseService.success(user, 'User created successfully', 201);
    } catch (error) {
      return this.responseService.error('Failed to create user', 500);
    }
  }
}
```

### Error Handling

Errors are automatically caught and formatted:

```typescript
@Get(':id')
async findOne(@Param('id') id: string) {
  const user = await this.prisma.user.findUnique({ where: { id } });
  
  if (!user) {
    // This will be caught by the exception filter
    throw new NotFoundException('User not found');
  }
  
  return user;
}
```

## Available Services

### ResponseService

- `success(data, message?, statusCode?)` - Create successful response
- `error(message, statusCode?, errorCode?, errorDetails?)` - Create error response
- `validationError(message?, errorDetails?)` - Create validation error
- `notFound(message?)` - Create not found error
- `unauthorized(message?)` - Create unauthorized error
- `forbidden(message?)` - Create forbidden error
- `conflict(message?)` - Create conflict error

## Configuration

The base response system is configured in `main.ts`:

```typescript
// Global response interceptor
app.useGlobalInterceptors(new ResponseInterceptor());

// Global exception filters
app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

// Global validation pipe
app.useGlobalPipes(new CustomValidationPipe());
```

## Benefits

1. **Consistency**: All endpoints return the same response structure
2. **Error Handling**: Comprehensive error handling with detailed information
3. **Documentation**: Automatic Swagger documentation generation
4. **Validation**: Built-in request validation with custom error messages
5. **Maintainability**: Centralized response logic makes updates easier
