import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import * as expensesController from "../controllers/expenses.controller.js";
import { validateBody, validateParams } from "../middlewares/validate.js";
import {
  createExpenseSchema,
  expenseIdParamSchema,
  updatedExpenseSchema,
} from "../schemas/expenses.schema.js";
import { updateExpense } from "../models/expenses.model.js";

export const expensesRouter = Router();

expensesRouter.post(
  "/",
  authenticate,
  validateBody(createExpenseSchema),
  expensesController.createExpense,
);
expensesRouter.get("/", authenticate, expensesController.getAllExpenses);
expensesRouter.get(
  "/:id",
  authenticate,
  validateParams(expenseIdParamSchema),
  expensesController.getExpenseById,
);
expensesRouter.delete(
  "/:id",
  authenticate,
  validateParams(expenseIdParamSchema),
  expensesController.deleteExpense,
);
expensesRouter.patch(
  "/:id",
  authenticate,
  validateParams(expenseIdParamSchema),
  validateBody(updatedExpenseSchema),
  expensesController.updateExpense,
);
