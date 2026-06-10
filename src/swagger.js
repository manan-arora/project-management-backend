import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WorkStream",
      version: "1.0.0",
      description: `
A collaborative project management backend API.

### Key Features

- JWT Authentication
- Email Verification & Password Reset
- Role-Based Access Control (RBAC)
- Project & Team Management
- Task & Subtask Workflows
- File Attachments
- Project Notes

🔷Cold start notice: First request after inactivity may take ~30s. 
The API is hosted on Render's on-demand infrastructure.
`,
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8000}`,
      },
    ],
    tags: [
      {
        name: "Authentication",
        description: "User authentication and account management",
      },
      {
        name: "Projects",
        description: "Project management APIs",
      },
      {
        name: "Tasks",
        description: "Task management APIs",
      },
      {
        name: "Notes",
        description: "Project notes APIs",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.js", "./src/docs/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
