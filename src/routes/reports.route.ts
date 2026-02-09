import { Router } from "express";
import * as reportsController from "../controllers/report.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { validateQuery } from "../middlewares/validate.js";
import { reportQuerySchema } from "../schemas/reports.schema.js";

export const reportsRouter = Router();

reportsRouter.get(
  "/summary",
  authenticate,
  validateQuery(reportQuerySchema),
  reportsController.getSummary,
);

reportsRouter.get("/rides", 
    authenticate,
    validateQuery(reportQuerySchema),
    reportsController.getRidesReport
);

reportsRouter.get("/expenses", 
    authenticate,
    validateQuery(reportQuerySchema),
    reportsController.getExpensesReport
);
