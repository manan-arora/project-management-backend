import { Router } from "express";
import { healthCheck }  from "../controllers/healthcheck.controller.js";

const router = Router();

router.route("/").get(healthCheck);//calls controller

export default router;
