const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const loginLimiter = require("../middleware/loginLimiter")

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: User login
 *     description: Authenticate user and return access token and refresh token (stored in cookie)
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: jwt=abcde12345; Path=/; HttpOnly; Secure; SameSite=None
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       429:
 *         description: Too many login attempts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route('/')
.post(loginLimiter, authController.login)

/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     summary: Refresh access token
 *     description: Generate a new access token using the refresh token stored in cookie
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.route('/refresh')
.get(authController.refresh)

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     description: Clear the refresh token cookie and log out the user
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *             example:
 *               message: "Cookie Cleared"
 *       204:
 *         description: No content - cookie already cleared
 */
router.route('/logout')
.post(authController.logout)

module.exports=router