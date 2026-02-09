import { Router } from "express";
import * as reportsController from "../controllers/report.controller.js"
import { authenticate } from "../middlewares/auth.js";
import { validateQuery } from "../middlewares/validate.js";
import { reportQuerySchema } from "../schemas/reports.schema.js";

export const reportsRouter = Router()

reportsRouter.get("/", authenticate, validateQuery(reportQuerySchema), reportsController.getSummary)

