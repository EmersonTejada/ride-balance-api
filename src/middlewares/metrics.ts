import { Request, Response, NextFunction } from "express";
import { httpRequestsTotal, httpRequestDuration, activeConnections } from "../metrics/index.js";

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  activeConnections.inc();
  
  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;
    
    httpRequestsTotal.inc({
      method: req.method,
      route,
      status_code: res.statusCode,
    });
    
    httpRequestDuration.observe({
      method: req.method,
      route,
      status_code: res.statusCode,
    }, duration);
    
    activeConnections.dec();
  });
  
  next();
};