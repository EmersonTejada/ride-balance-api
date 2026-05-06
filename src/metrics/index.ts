import { Registry, Counter, Histogram, Gauge } from "prom-client";

export const register = new Registry();

export const httpRequestsTotal = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

export const httpRequestDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register],
});

export const activeConnections = new Gauge({
  name: "http_active_connections",
  help: "Number of active HTTP connections",
  registers: [register],
});

export const ridesCreatedTotal = new Counter({
  name: "rides_created_total",
  help: "Total number of rides created",
  registers: [register],
});

export const expensesCreatedTotal = new Counter({
  name: "expenses_created_total",
  help: "Total number of expenses created",
  registers: [register],
});

export const authAttemptsTotal = new Counter({
  name: "auth_attempts_total",
  help: "Total number of authentication attempts",
  labelNames: ["success"],
  registers: [register],
});

export const databaseQueryDuration = new Histogram({
  name: "database_query_duration_seconds",
  help: "Duration of database queries in seconds",
  labelNames: ["operation"],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register],
});