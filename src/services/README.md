# Service Architecture

This document outlines the service architecture pattern used in the BuildX application, following NestJS best practices.

## Architecture Overview

The application follows a clean architecture pattern where:

- **Controllers** are thin and only handle HTTP requests/responses
- **Services** contain all business logic and data access
- **Base Services** provide common functionality for all services
- **DTOs** handle data validation and transformation

## Service Structure

### BaseService

All services extend `BaseService` which provides common functionality:

```typescript
export abstract class BaseService {
  // Database error handling
  protected handleDatabaseError(error: any, operation: string): never
  
  // Utility methods
  protected generateId(): string
  protected sanitizeString(input: string): string
  protected isValidEmail(email: string): boolean
  protected getCurrentTimestamp(): Date
  protected formatDate(date: Date): string
}
```

### Service Pattern

Each service follows this pattern:

```typescript
@Injectable()
export class ExampleService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super(prisma);
  }

  // Business logic methods
  async create(data: CreateDto): Promise<Entity> {
    // Validation
    // Business logic
    // Database operations
    // Error handling
  }
}
```

## Service Responsibilities

### UsersService

- **Create User**: Validates email, checks uniqueness, sanitizes data
- **Find All Users**: Retrieves users with ordering
- **Find One User**: Retrieves single user with existence check
- **Update User**: Validates updates, checks email uniqueness
- **Delete User**: Removes user with existence check
- **Find by Email**: Utility method for authentication
- **Get Count**: Returns total user count

### AppService

- **Get Hello**: Returns basic application info
- **Get App Info**: Returns detailed application information
- **Get Health Status**: Returns application health metrics

## Error Handling

Services use consistent error handling:

1. **Validation Errors**: Throw descriptive errors for invalid input
2. **Business Logic Errors**: Use appropriate HTTP exceptions
3. **Database Errors**: Use BaseService error handling for Prisma errors
4. **Custom Errors**: Provide meaningful error messages

## Data Sanitization

All services sanitize input data:

- **Email**: Converted to lowercase and trimmed
- **Strings**: Trimmed and normalized whitespace
- **Validation**: Email format validation before database operations

## Best Practices

1. **Single Responsibility**: Each service handles one domain
2. **Dependency Injection**: Services are injected into controllers
3. **Error Handling**: Consistent error handling across all services
4. **Data Validation**: Input validation and sanitization
5. **Database Abstraction**: Services handle all database operations
6. **Documentation**: All methods are documented with JSDoc

## Service Registration

Services are registered in their respective modules:

```typescript
@Module({
  controllers: [ExampleController],
  providers: [ExampleService],
  exports: [ExampleService], // Export if used by other modules
})
export class ExampleModule {}
```

## Testing Services

Services can be easily tested by mocking dependencies:

```typescript
describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });
});
```

This architecture ensures:
- **Maintainability**: Clear separation of concerns
- **Testability**: Easy to unit test business logic
- **Scalability**: Easy to add new services and features
- **Consistency**: Uniform patterns across all services
