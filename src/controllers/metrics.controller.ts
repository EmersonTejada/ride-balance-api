import { RequestHandler } from "express";
import * as metricsModel from "../models/metrics.model.js";

export const getMetrics: RequestHandler = (_req, res) => {
  const metrics = metricsModel.getSystemMetrics();
  const cpuUsage = process.cpuUsage();

  res.set("Content-Type", "text/plain; version=0.0.4; charset=utf-8");
  res.send(`# HELP nodejs_app_uptime_seconds Application uptime in seconds
# TYPE nodejs_app_uptime_seconds gauge
nodejs_app_uptime_seconds ${metrics.uptime_seconds}

# HELP nodejs_app_memory_rss_bytes Resident Set Memory usage
# TYPE nodejs_app_memory_rss_bytes gauge
nodejs_app_memory_rss_bytes ${metrics.memory_rss_bytes}

# HELP nodejs_app_memory_heap_used_bytes Heap memory used
# TYPE nodejs_app_memory_heap_used_bytes gauge
nodejs_app_memory_heap_used_bytes ${metrics.memory_heap_used_bytes}

# HELP nodejs_app_memory_heap_total_bytes Heap memory total
# TYPE nodejs_app_memory_heap_total_bytes gauge
nodejs_app_memory_heap_total_bytes ${metrics.memory_heap_total_bytes}

# HELP nodejs_app_cpu_user_seconds_total CPU user time
# TYPE nodejs_app_cpu_user_seconds_total counter
nodejs_app_cpu_user_seconds_total ${cpuUsage.user / 1000000}

# HELP nodejs_app_cpu_system_seconds_total CPU system time
# TYPE nodejs_app_cpu_system_seconds_total counter
nodejs_app_cpu_system_seconds_total ${cpuUsage.system / 1000000}

# HELP nodejs_app_info Application info
# TYPE nodejs_app_info gauge
nodejs_app_info{version="1.0.0"} 1
`);
};