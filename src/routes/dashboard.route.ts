import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { validateParams, validateQuery } from "../middlewares/validate.js";
import { reportQuerySchema } from "../schemas/reports.schema.js";

export const dashboardRouter = Router();

dashboardRouter.get(
  "/weekly",
  authenticate,
  dashboardController.getWeeklyDashboard,
);
