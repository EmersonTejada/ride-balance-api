import express from "express";
import cors from "cors";
import "dotenv/config";
import { ridesRouter } from "./routes/rides.route.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { metricsMiddleware } from "./middlewares/metrics.js";
import { authRouter } from "./routes/auth.route.js";
import { expensesRouter } from "./routes/expenses.route.js";
import { reportsRouter } from "./routes/reports.route.js";
import { dashboardRouter } from "./routes/dashboard.route.js";
import { healthRouter } from "./routes/health.route.js";
import { metricsRouter } from "./routes/metrics.route.js";

const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(metricsMiddleware);

app.use("/api/rides", ridesRouter);
app.use("/api/auth", authRouter);
app.use("/api/expenses", expensesRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/health", healthRouter);
app.use("/api/metrics", metricsRouter);
app.use(errorHandler);

export { app };
