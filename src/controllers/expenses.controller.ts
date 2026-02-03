import { RequestHandler } from "express";
import { NewExpense, UpdateExpense } from "../types/expense";
import * as expensesModel from "../models/expenses.model.js";

export const createExpense: RequestHandler<{}, {}, NewExpense, {}> = async (
  req,
  res,
) => {
  const newExpense = await expensesModel.createExpense(req.body, req.userId);
  res.json({ message: "Gasto creado exitosamente", data: newExpense });
};

export const getAllExpenses: RequestHandler = async (
  req,
  res,
) => {
  const filters = {
    category: req.query.category as string | undefined,
    subcategory: req.query.subcategory as string | undefined,
    from: req.query.from as string | undefined,
    to: req.query.to as string | undefined, 
  };
  const expenses = await expensesModel.getAllExpenses(req.userId, filters);
  res.json({ message: "Gastos obtenidos exitosamente", data: expenses });
};

export const getExpenseById: RequestHandler = async (req, res) => {
    const id = req.params.id
    const expense = await expensesModel.getExpenseById(id, req.userId)
    res.json({message: "Gasto obtenido exitosamente", data: expense})
}

export const deleteExpense: RequestHandler = async (req, res) => {
  const id = req.params.id;
  const deletedExpense = await expensesModel.deleteExpense(id, req.userId);
  res.json({ message: "Gasto eliminado exitosamente", data: deletedExpense });
}

export const updateExpense: RequestHandler = async (req, res) => {
    const id = req.params.id
    const updatedExpense = await expensesModel.updateExpense(id, req.userId, req.body)
    res.json({message: "Gasto actualizado correctamente", data: updatedExpense[0]})
}
