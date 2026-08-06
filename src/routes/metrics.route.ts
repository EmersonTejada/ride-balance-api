import { Router } from "express";
import * as metricsController from "../controllers/metrics.controller.js";

export const metricsRouter = Router();

metricsRouter.get("/", metricsController.getMetrics);