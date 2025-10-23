# Swagger API Documentation Setup

## Overview

This document explains the Swagger (OpenAPI 3.0) implementation for the Plant Backend API.

## Installation

The following packages have been installed:

```bash
npm install swagger-jsdoc swagger-ui-express --save
```

### Dependencies

- **swagger-jsdoc**: Generates Swagger/OpenAPI specification from JSDoc comments
- **swagger-ui-express**: Serves auto-generated Swagger UI

## File Structure

```
plant-back-end/
├── config/
│   └── swagger.js          # Swagger configuration and OpenAPI spec
├── routes/
│   ├── authRoutes.js       # Auth endpoints with Swagger annotations
│   └── userRoutes.js       # User endpoints with Swagger annotations
└── server.js               # Swagger UI integration
```

## Configuration

### 1. Swagger Config (`config/swagger.js`)

This file contains:

- OpenAPI 3.0 specification
- API metadata (title, version, description)
- Server configurations (development & production)
- Security schemes (Bearer JWT & Cookie authentication)
- Reusable schemas for request/response models
- Common response templates
- Tags for grouping endpoints

**Key Features:**

- Auto-scans `./routes/*.js`, `./controllers/*.js`, and `./models/*.js` for JSDoc annotations
- Defines reusable components for DRY documentation
- Includes security schemes for JWT authentication

### 2. Server Integration (`server.js`)

Swagger UI is served at `/api-docs`:

```javascript
const { swaggerUi, swaggerSpec } = require("./config/swagger");

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Plant Backend API Documentation",
  })
);
```

## Accessing Swagger UI

Once the server is running:

1. Start your server:

   ```bash
   npm start
   # or
   npm run dev
   ```

2. Open your browser and navigate to:

   ```
   http://localhost:3500/api-docs
   ```

3. You'll see the interactive Swagger UI with all documented endpoints

## API Documentation

### Authentication Endpoints

#### POST /auth

- **Summary**: User login
- **Request Body**: `{ username, password }`
- **Response**: Access token (JSON) + Refresh token (cookie)
- **Rate Limited**: Yes (via loginLimiter)

#### GET /auth/refresh

- **Summary**: Refresh access token
- **Security**: Requires refresh token in cookie
- **Response**: New access token

#### POST /auth/logout

- **Summary**: User logout
- **Response**: Clears JWT cookie

### User Management Endpoints

#### GET /users

- **Summary**: Get all users
- **Security**: Bearer JWT (Admin only)
- **Response**: Array of user objects

#### POST /users

- **Summary**: Create new user
- **Request Body**: `{ username, password, roles? }`
- **Response**: Access token (JSON) + Refresh token (cookie)

#### DELETE /users

- **Summary**: Delete user
- **Security**: Bearer JWT (Admin or self)
- **Request Body**: `{ id }`

#### GET /users/:id

- **Summary**: Get user by ID
- **Parameters**: User ID in path
- **Response**: User object

#### PATCH /users/:id

- **Summary**: Update user
- **Parameters**: User ID in path
- **Request Body**: `{ username, password?, roles?, active? }`
- **Response**: Success message

## Swagger Annotations

### JSDoc Comment Structure

Swagger documentation is written using JSDoc comments in route files:

```javascript
/**
 * @swagger
 * /endpoint-path:
 *   httpMethod:
 *     summary: Brief description
 *     description: Detailed description
 *     tags: [TagName]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path/query/header
 *         name: paramName
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SchemaName'
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseSchema'
 */
```

### Reusable Components

Defined in `config/swagger.js`:

**Schemas:**

- `User`: Full user model
- `UserResponse`: User without password
- `LoginRequest`: Login credentials
- `LoginResponse`: Access token + roles
- `CreateUserRequest`: User registration
- `UpdateUserRequest`: User update data
- `DeleteUserRequest`: User ID for deletion
- `Error`: Standard error response
- `SuccessMessage`: Success message response

**Security Schemes:**

- `bearerAuth`: JWT token in Authorization header
- `cookieAuth`: JWT token in cookie

**Common Responses:**

- `UnauthorizedError`: 401 responses
- `ForbiddenError`: 403 responses
- `NotFoundError`: 404 responses
- `BadRequestError`: 400 responses

## Testing the API

### Using Swagger UI

1. Navigate to `http://localhost:3500/api-docs`
2. Click on any endpoint to expand it
3. Click "Try it out"
4. Fill in the required parameters
5. Click "Execute"

### Authentication Flow

1. **Register/Login**:

   - Use `POST /users` to create account OR
   - Use `POST /auth` to login
   - Copy the `accessToken` from response

2. **Authorize**:

   - Click the green "Authorize" button at top right
   - Enter: `Bearer <your-access-token>`
   - Click "Authorize"

3. **Make Authenticated Requests**:
   - All endpoints with 🔒 icon require authentication
   - Your token is automatically included in requests

## Customization

### Adding New Endpoints

1. Add route in your routes file
2. Add JSDoc comment above the route:

```javascript
/**
 * @swagger
 * /your-endpoint:
 *   get:
 *     summary: Your endpoint description
 *     tags: [YourTag]
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/your-endpoint", controller.handler);
```

3. Swagger UI auto-updates (restart server if needed)

### Adding New Schemas

Edit `config/swagger.js` and add to `components.schemas`:

```javascript
YourSchema: {
  type: 'object',
  required: ['field1', 'field2'],
  properties: {
    field1: {
      type: 'string',
      example: 'value1',
    },
    field2: {
      type: 'number',
      example: 123,
    },
  },
}
```

### Updating Server URLs

Edit the `servers` array in `config/swagger.js`:

```javascript
servers: [
  {
    url: 'http://localhost:3500',
    description: 'Development server',
  },
  {
    url: 'https://your-production-url.com',
    description: 'Production server',
  },
],
```

## Best Practices

1. **Keep Annotations Updated**: Always update JSDoc comments when modifying endpoints
2. **Use $ref for Schemas**: Reference reusable schemas instead of duplicating
3. **Provide Examples**: Include example values for better UX
4. **Document All Responses**: Include all possible status codes
5. **Tag Logically**: Group related endpoints with tags
6. **Security Documentation**: Always specify required authentication

## Troubleshooting

### Swagger UI Not Loading

- Check server is running on correct port
- Verify `/api-docs` route is accessible
- Check browser console for errors

### Endpoints Not Appearing

- Ensure JSDoc comments have `@swagger` tag
- Verify file paths in `swagger.js` apis array
- Restart server after adding new annotations

### Authentication Not Working

- Ensure you're using `Bearer <token>` format
- Check token hasn't expired (30min default)
- Verify token in browser cookies (for refresh token)

## Example Usage

### Complete Example: Create and Get User

```javascript
// 1. Create User
POST http://localhost:3500/users
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123!",
  "roles": ["user"]
}

// Response:
{
  "accessToken": "eyJhbGc..."
}

// 2. Get User (requires auth)
GET http://localhost:3500/users/507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGc...

// Response:
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "roles": ["user"],
    "active": true
  }
}
```

## Additional Resources

- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger JSDoc Documentation](https://github.com/Surnet/swagger-jsdoc)
- [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express)

## Summary

✅ Swagger fully configured
✅ All existing endpoints documented
✅ Interactive UI at `/api-docs`
✅ Auto-scanning routes for annotations
✅ JWT authentication support
✅ Reusable schemas defined
✅ Ready for production use
