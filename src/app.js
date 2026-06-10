import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//basic express configurations
app.use(express.json({ limit: "16kb" })); //Parses incoming JSON data from requests.
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //Parses form data sent from HTML forms.
app.use(express.static("public")); //Serves static files like images, CSS, and JavaScript from the public folder.

app.use(cookieParser());

//cors configs
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

//import the routes

import healthCheckRouter from "./routes/healthcheck.routes.js"; //can name it anything because we exported default router

import authRouter from "./routes/auth.routes.js";

import projectRouter from "./routes/project.routes.js";

import taskRouter from "./routes/task.routes.js";

import noteRouter from "./routes/note.routes.js";

app.use("/api/v1/healthcheck", healthCheckRouter); //calls router
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects/", projectRouter);
app.use("/api/v1/tasks/", taskRouter);
app.use("/api/v1/notes/", noteRouter);

//Swagger
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";

app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
