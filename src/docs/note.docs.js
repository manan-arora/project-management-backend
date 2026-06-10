/**
 * @swagger
 * tags:
 *   - name: Notes
 *     description: Project notes management APIs
 */

/**
 * @swagger
 * /api/v1/notes/{projectId}:
 *   get:
 *     tags:
 *       - Notes
 *     summary: Get all notes of a project
 *     description: Accessible to all project members.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: Project ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notes fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * /api/v1/notes/{projectId}:
 *   post:
 *     tags:
 *       - Notes
 *     summary: Create a note
 *     description: Accessible only to ADMIN.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: Project ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Team meeting scheduled for Friday at 5 PM.
 *     responses:
 *       201:
 *         description: Note created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only ADMIN can create notes
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * /api/v1/notes/{projectId}/n/{noteId}:
 *   get:
 *     tags:
 *       - Notes
 *     summary: Get a note by ID
 *     description: Accessible to all project members.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: Project ID
 *         schema:
 *           type: string
 *       - in: path
 *         name: noteId
 *         required: true
 *         description: Note ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project or note not found
 */

/**
 * @swagger
 * /api/v1/notes/{projectId}/n/{noteId}:
 *   put:
 *     tags:
 *       - Notes
 *     summary: Update a note
 *     description: Accessible only to ADMIN.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: Project ID
 *         schema:
 *           type: string
 *       - in: path
 *         name: noteId
 *         required: true
 *         description: Note ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Updated note content.
 *     responses:
 *       200:
 *         description: Note updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only ADMIN can update notes
 *       404:
 *         description: Project or note not found
 */

/**
 * @swagger
 * /api/v1/notes/{projectId}/n/{noteId}:
 *   delete:
 *     tags:
 *       - Notes
 *     summary: Delete a note
 *     description: Accessible only to ADMIN.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: Project ID
 *         schema:
 *           type: string
 *       - in: path
 *         name: noteId
 *         required: true
 *         description: Note ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only ADMIN can delete notes
 *       404:
 *         description: Project or note not found
 */