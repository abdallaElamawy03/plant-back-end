const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Plant Backend API',
      version: '1.0.0',
      description: 'API documentation for Plant Backend application with authentication and user management',
      contact: {
        name: 'API Support',
        email: 'support@plantbackend.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3500',
        description: 'Development server',
      },
      {
        url: 'https://api.production.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'jwt',
          description: 'JWT token stored in cookie',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated user ID',
              example: '507f1f77bcf86cd799439011',
            },
            username: {
              type: 'string',
              description: 'Unique username',
              example: 'john_doe',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Hashed password',
              example: 'SecurePass123!',
            },
            roles: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['user', 'admin', 'manager'],
              },
              default: ['user'],
              description: 'User roles',
              example: ['user'],
            },
            active: {
              type: 'boolean',
              default: true,
              description: 'User account status',
              example: true,
            },
          },
        },
        UserResponse: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            username: {
              type: 'string',
              example: 'john_doe',
            },
            roles: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['user'],
            },
            active: {
              type: 'boolean',
              example: true,
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              example: 'john_doe',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'SecurePass123!',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              description: 'JWT access token',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            roles: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['user'],
            },
          },
        },
        CreateUserRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              example: 'jane_doe',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'SecurePass123!',
            },
            roles: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['user', 'admin', 'manager'],
              },
              example: ['user'],
            },
          },
        },
        UpdateUserRequest: {
          type: 'object',
          required: ['username'],
          properties: {
            username: {
              type: 'string',
              example: 'john_updated',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Optional - only if changing password',
              example: 'NewSecurePass123!',
            },
            roles: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['user', 'admin'],
            },
            active: {
              type: 'boolean',
              example: true,
            },
          },
        },
        DeleteUserRequest: {
          type: 'object',
          required: ['id'],
          properties: {
            id: {
              type: 'string',
              description: 'User ID to delete',
              example: '507f1f77bcf86cd799439011',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
              example: 'An error occurred',
            },
          },
        },
        SuccessMessage: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Operation successful',
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                message: 'Unauthorized',
              },
            },
          },
        },
        ForbiddenError: {
          description: 'Access forbidden - insufficient permissions',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                message: 'Forbidden',
              },
            },
          },
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                message: 'Not found',
              },
            },
          },
        },
        BadRequestError: {
          description: 'Bad request - invalid input',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                message: 'All fields are required',
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'Authentication and authorization endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
    ],
  },
  apis: [
    './routes/*.js',
    './controllers/*.js',
    './models/*.js',
  ], // Auto-scan all route files for JSDoc annotations
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
