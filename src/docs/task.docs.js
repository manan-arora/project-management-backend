/**
 * @swagger
 * tags:
 *   - name: Tasks
 *     description: Task and Subtask management APIs
 */

/**
 * @swagger
 * /api/v1/tasks/{projectId}:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Get all tasks of a project
 *     description: Accessible to all project members.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tasks fetched successfully
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * /api/v1/tasks/{projectId}:
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Create a task
 *     description: Accessible only to ADMIN and PROJECT_ADMIN.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - assignedTo
 *             properties:
 *               title:
 *                 type: string
 *                 example: Build Swagger Docs
 *               description:
 *                 type: string
 *                 example: Complete API documentation
 *               assignedTo:
 *                 type: string
 *                 example: 68483d2f4a7a7f0e5c123456
 *               status:
 *                 type: string
 *                 example: todo
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Task created successfully
 */

/**
 * @swagger
 * /api/v1/tasks/{projectId}/t/{taskId}:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Get task details
 *     description: Accessible to all project members.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task details fetched successfully
 */

/**
 * @swagger
 * /api/v1/tasks/{projectId}/t/{taskId}:
 *   put:
 *     tags:
 *       - Tasks
 *     summary: Update task
 *     description: Accessible only to ADMIN and PROJECT_ADMIN.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               assignedTo:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 */

/**
 * @swagger
 * /api/v1/tasks/{projectId}/t/{taskId}:
 *   delete:
 *     tags:
 *       - Tasks
 *     summary: Delete task
 *     description: Accessible only to ADMIN and PROJECT_ADMIN.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 */

/**
 * @swagger
 * /api/v1/tasks/{projectId}/t/{taskId}/attachments:
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Add task attachments
 *     description: Accessible only to ADMIN and PROJECT_ADMIN.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Attachments added successfully
 */

/**
 * @swagger
 * /api/v1/tasks/{projectId}/t/{taskId}/attachments/{attachmentId}:
 *   delete:
 *     tags:
 *       - Tasks
 *     summary: Delete task attachment
 *     description: Accessible only to ADMIN and PROJECT_ADMIN.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: attachmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attachment deleted successfully
 */

/**
 * @swagger
 * /api/v1/tasks/{projectId}/t/{taskId}/subtasks:
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Create subtask
 *     description: Accessible only to ADMIN and PROJECT_ADMIN.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Write Swagger docs
 *               isCompleted:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Subtask created successfully
 */

/**
 * @swagger
 * /api/v1/tasks/{projectId}/st/{subTaskId}:
 *   put:
 *     tags:
 *       - Tasks
 *     summary: Update subtask
 *     description: Accessible to all project members.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: subTaskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               isCompleted:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Subtask updated successfully
 */

/**
 * @swagger
 * /api/v1/tasks/{projectId}/st/{subTaskId}:
 *   delete:
 *     tags:
 *       - Tasks
 *     summary: Delete subtask
 *     description: Accessible only to ADMIN and PROJECT_ADMIN.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: subTaskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subtask deleted successfully
 */