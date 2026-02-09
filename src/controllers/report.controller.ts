import { RequestHandler } from "express";
import * as summaryReportService from "../services/report.summary.service.js";
import * as ridesReportService from "../services/report.rides.service.js";
import * as expensesReportService from "../services/report.expenses.service.js";
export const getSummary: RequestHandler = async (req, res) => {
  const { from, to } = res.locals.query;

  const summaryReport = await summaryReportService.getReportSummary(
    req.userId,
    from,
    to,
  );
  res.json({ message: "Reporte obtenido exitosamente", data: summaryReport });
};

export const getRidesReport: RequestHandler = async (req, res) => {
  const { from, to } = res.locals.query;
  const expensesReport = await ridesReportService.getRidesReport(
    req.userId,
    from,
    to,
  );
  res.json({ message: "Reporte obtenido exitosamente", data: expensesReport });
};

export const getExpensesReport: RequestHandler = async (req, res) => {
  const { from, to } = res.locals.query;
  const ridesReport = await expensesReportService.getExpensesReport(
    req.userId,
    from,
    to,
  );
  res.json({ message: "Reporte obtenido exitosamente", data: ridesReport });
};
