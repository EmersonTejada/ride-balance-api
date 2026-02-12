import { RequestHandler } from "express";
import * as dashboardService from "../services/dashboard.service.js";

export const getWeeklyDashboard: RequestHandler = async (req, res) => {
    const timezone = req.headers["x-timezone"] as string
  const weeklyDashboard = await dashboardService.getWeeklyDashboard(req.userId, timezone);
  res.json({ message: "Dashboard semanal", data: weeklyDashboard });
};
