//the router file for the users api
const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const verifyjwt = require("../middleware/verifyJwt");
const loginLimiter = require("../middleware/loginLimiter");
router.use(loginLimiter);
// router.use(verifyjwt)
router.route('/')
    .get(users.getallUsers)
    .post(users.createNewUser)
    .delete(verifyjwt,users.deleteUser)
    // .patch(users.updateuser)//update method
router.route('/:id').patch(users.updateuser).get(users.getUser)

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   post:
 *     summary: Create a new user
 *     description: Register a new user account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: jwt=abcde12345; Path=/; HttpOnly; Secure; SameSite=None
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       409:
 *         description: Duplicate username
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user by ID (Admin or user themselves)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteUserRequest'
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router
  .route("/")
  .get(verifyjwt, users.getallUsers)
  .post(users.createNewUser)
  .delete(verifyjwt, users.deleteUser);
// .patch(users.updateuser)//update method

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a specific user by their ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/UserResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   patch:
 *     summary: Update user
 *     description: Update user information by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *             example:
 *               message: "john_updated updated"
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       409:
 *         description: Duplicate username
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route("/:id").patch(users.updateuser).get(users.getUser);

module.exports = router;
