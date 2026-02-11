import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller.js";
import { authenticate } from "../middlewares/auth.js";

export const dashboardRouter = Router();

dashboardRouter.get(
  "/weekly",
  authenticate,
  dashboardController.getWeeklyDasboard,
);
