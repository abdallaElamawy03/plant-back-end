# Swagger Quick Reference & Code Examples

## Quick Start Commands

```bash
# Install dependencies (already done)
npm install swagger-jsdoc swagger-ui-express --save

# Start server
npm start

# Access Swagger UI
# Open browser: http://localhost:3500/api-docs
```

---

## Code Examples

### 1. Basic Swagger Configuration (config/swagger.js)

```javascript
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Name',
      version: '1.0.0',
      description: 'API Description',
    },
    servers: [
      {
        url: 'http://localhost:3500',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to API docs
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = { swaggerUi, swaggerSpec };
```

### 2. Server Integration (server.js)

```javascript
const { swaggerUi, swaggerSpec } = require("./config/swagger");

// Add this BEFORE your routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

### 3. Route Documentation Examples

#### GET Endpoint (No Auth)
```javascript
/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Get all items
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/items', controller.getItems);
```

#### POST Endpoint (With Request Body)
```javascript
/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Create new item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Product Name"
 *               price:
 *                 type: number
 *                 example: 19.99
 *               description:
 *                 type: string
 *                 example: "Product description"
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 */
router.post('/items', controller.createItem);
```

#### GET with Path Parameters
```javascript
/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Get item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ID
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not Found
 */
router.get('/items/:id', controller.getItemById);
```

#### Protected Endpoint (JWT Auth)
```javascript
/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/admin/users', verifyAdmin, controller.getUsers);
```

#### PATCH/PUT with Multiple Responses
```javascript
/**
 * @swagger
 * /api/items/{id}:
 *   patch:
 *     summary: Update item
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Item not found
 *       409:
 *         description: Conflict
 */
router.patch('/items/:id', controller.updateItem);
```

#### DELETE Endpoint
```javascript
/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     summary: Delete item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: Not found
 */
router.delete('/items/:id', verifyJwt, controller.deleteItem);
```

### 4. Defining Reusable Schemas

```javascript
// In config/swagger.js, add to components.schemas:

components: {
  schemas: {
    Item: {
      type: 'object',
      required: ['name', 'price'],
      properties: {
        _id: {
          type: 'string',
          description: 'Auto-generated ID',
        },
        name: {
          type: 'string',
          example: 'Product Name',
        },
        price: {
          type: 'number',
          example: 29.99,
        },
        category: {
          type: 'string',
          enum: ['electronics', 'clothing', 'food'],
          example: 'electronics',
        },
        inStock: {
          type: 'boolean',
          default: true,
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
        },
      },
    },
  },
}

// Then use with $ref:
/**
 * @swagger
 * /api/items:
 *   post:
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 */
```

### 5. Security Schemes

```javascript
// In config/swagger.js:

components: {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
    apiKey: {
      type: 'apiKey',
      in: 'header',
      name: 'X-API-Key',
    },
    cookieAuth: {
      type: 'apiKey',
      in: 'cookie',
      name: 'jwt',
    },
  },
}

// Use in routes:
/**
 * @swagger
 * /protected:
 *   get:
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 */
```

### 6. Query Parameters

```javascript
/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Search items
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/items', controller.searchItems);
```

### 7. File Upload Endpoint

```javascript
/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload file
 *     tags: [Files]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: File uploaded
 */
router.post('/upload', upload.single('file'), controller.uploadFile);
```

### 8. Array Response

```javascript
/**
 * @swagger
 * /api/items:
 *   get:
 *     responses:
 *       200:
 *         description: List of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
```

### 9. Nested Objects

```javascript
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         address:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *             city:
 *               type: string
 *             zipCode:
 *               type: string
 *         orders:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *               total:
 *                 type: number
 */
```

### 10. Multiple Content Types

```javascript
/**
 * @swagger
 * /api/export:
 *   get:
 *     responses:
 *       200:
 *         description: Export data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *           text/csv:
 *             schema:
 *               type: string
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
```

---

## Common Patterns for Your Project

### Pattern 1: Protected Admin Endpoint
```javascript
/**
 * @swagger
 * /users/admin/stats:
 *   get:
 *     summary: Get user statistics (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: number
 *                 activeUsers:
 *                   type: number
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/admin/stats', verifyjwt, checkAdmin, controller.getStats);
```

### Pattern 2: Login with Cookie Response
```javascript
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: jwt=abc123; Path=/; HttpOnly
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 */
```

### Pattern 3: Pagination Response
```javascript
/**
 * @swagger
 * components:
 *   schemas:
 *     PaginatedUsers:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserResponse'
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *             limit:
 *               type: integer
 *             total:
 *               type: integer
 *             pages:
 *               type: integer
 */
```

---

## Testing with Swagger UI

### Step 1: Authentication
```
1. Go to /api-docs
2. Click POST /auth (login)
3. Click "Try it out"
4. Enter credentials:
   {
     "username": "testuser",
     "password": "password123"
   }
5. Click Execute
6. Copy the accessToken from response
```

### Step 2: Authorize
```
1. Click the green "Authorize" button (top right)
2. Enter: Bearer <your-access-token>
3. Click Authorize
4. Close dialog
```

### Step 3: Test Protected Endpoint
```
1. Click GET /users
2. Click "Try it out"
3. Click Execute
4. See authenticated response
```

---

## Troubleshooting

### Issue: Endpoints not showing
**Solution**: Ensure JSDoc has `@swagger` tag and file is in apis array

### Issue: Schema not found
**Solution**: Check $ref path: `#/components/schemas/SchemaName`

### Issue: Authentication not working
**Solution**: Use format `Bearer <token>` (with space)

### Issue: Changes not appearing
**Solution**: Restart server after modifying swagger.js

---

## Advanced Features

### Custom Swagger UI Options
```javascript
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "My API Docs",
  customfavIcon: "/favicon.ico",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
  },
}));
```

### Export Swagger JSON
```javascript
// Add this route to export raw spec
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
```

### Multiple API Versions
```javascript
const v1Spec = swaggerJsdoc({
  definition: { /* v1 config */ },
  apis: ['./routes/v1/*.js'],
});

const v2Spec = swaggerJsdoc({
  definition: { /* v2 config */ },
  apis: ['./routes/v2/*.js'],
});

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(v1Spec));
app.use('/api/v2/docs', swaggerUi.serve, swaggerUi.setup(v2Spec));
```

---

## Your Project Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /auth | Login | No |
| GET | /auth/refresh | Refresh token | Cookie |
| POST | /auth/logout | Logout | Cookie |
| GET | /users | Get all users | Yes (Admin) |
| POST | /users | Create user | No |
| DELETE | /users | Delete user | Yes |
| GET | /users/:id | Get user by ID | No |
| PATCH | /users/:id | Update user | No |

All documented at: **http://localhost:3500/api-docs**

---

## Next Steps

1. ✅ Add more route files? Add them to `apis` array in swagger.js
2. ✅ Need more schemas? Add to `components.schemas` 
3. ✅ Custom responses? Add to `components.responses`
4. ✅ Deploy? Update server URLs in swagger.js
5. ✅ Export docs? Access `/api-docs.json` for raw OpenAPI spec

**Happy Documenting! 🚀**
