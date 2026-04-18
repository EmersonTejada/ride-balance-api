import { RequestHandler } from "express";
import * as healthModel from "../models/health.model.js";

export const getHealthStatus: RequestHandler = async (_req, res) => {
  await healthModel.healthQuery();
  res.status(200).json({
    status: "healthy",
    database: "connected",
    timestamp: new Date().toISOString(),
  });
};
