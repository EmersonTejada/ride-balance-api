import { RequestHandler } from "express";
import * as reportService from "../services/report.service.js";

export const getSummary: RequestHandler = async (req, res) => {
  const { from, to } = res.locals.query;

  const summary = await reportService.getReportSummary(req.userId, from, to);
  res.json({ message: "Reporte obtenido exitosamente", data: summary });
};
