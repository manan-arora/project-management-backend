import express from "express";
import cors from "cors";

const app = express();

//basic express configurations
app.use(express.json({ limit : "16kb"})); //Parses incoming JSON data from requests.
app.use(express.urlencoded({extended: true, limit: "16kb"})); //Parses form data sent from HTML forms.
app.use(express.static("public")); //Serves static files like images, CSS, and JavaScript from the public folder.

//cors configs
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",") || "https://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

export default app;