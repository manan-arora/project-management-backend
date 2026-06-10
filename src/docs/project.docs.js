/**
 * @swagger
 * tags:
 *   - name: Projects
 *     description: Project management APIs
 */

/**
 * @swagger
 * /api/v1/projects:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Get all projects of the current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Projects fetched successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/projects:
 *   post:
 *     tags:
 *       - Projects
 *     summary: Create a new project
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Workstream Backend
 *               description:
 *                 type: string
 *                 example: Backend API for project management application
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/projects/{projectId}:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Get project by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB Project ID
 *     responses:
 *       200:
 *         description: Project fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * /api/v1/projects/{projectId}:
 *   put:
 *     tags:
 *       - Projects
 *     summary: Update project
 *     description: Only admins can update a project.
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
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Workstream Backend v2
 *               description:
 *                 type: string
 *                 example: Updated project description
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only admins can update the project
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * /api/v1/projects/{projectId}:
 *   delete:
 *     tags:
 *       - Projects
 *     summary: Delete project
 *     description: Only admins can delete a project.
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
 *         description: Project deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only admins can delete the project
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * /api/v1/projects/{projectId}/members:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Get all project members
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
 *         description: Project members fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * /api/v1/projects/{projectId}/members:
 *   post:
 *     tags:
 *       - Projects
 *     summary: Add a member to a project
 *     description: Only admins can add members.
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
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: member@example.com
 *               role:
 *                 type: string
 *                 enum:
 *                   - admin
 *                   - project_admin
 *                   - member
 *                 example: member
 *     responses:
 *       200:
 *         description: Member added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only admins can add members
 *       404:
 *         description: User or project not found
 */

/**
 * @swagger
 * /api/v1/projects/{projectId}/members/{userId}:
 *   put:
 *     tags:
 *       - Projects
 *     summary: Update member role
 *     description: Only admins can update member roles.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
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
 *               - newRole
 *             properties:
 *               role:
 *                 type: string
 *                 enum:
 *                   - admin
 *                   - project_admin
 *                   - member
 *                 example: project_admin
 *     responses:
 *       200:
 *         description: Member role updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only admins can update member roles
 *       404:
 *         description: Member not found
 */

/**
 * @swagger
 * /api/v1/projects/{projectId}/members/{userId}:
 *   delete:
 *     tags:
 *       - Projects
 *     summary: Remove a member from a project
 *     description: Only project admins can remove members.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member removed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only admins can remove members
 *       404:
 *         description: Member not found
 */