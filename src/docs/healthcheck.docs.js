/**
 * @swagger
 * tags:
 *   - name: Health Check
 *     description: API health monitoring endpoint
 */

/**
 * @swagger
 * /api/v1/healthcheck:
 *   get:
 *     tags:
 *       - Health Check
 *     summary: Check API health status
 *     description: Returns the current health status of the backend server.
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   example: {}
 *                 message:
 *                   type: string
 *                   example: Health check passed
 *                 success:
 *                   type: boolean
 *                   example: true
 */