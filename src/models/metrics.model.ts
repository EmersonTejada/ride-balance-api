export const getSystemMetrics = () => {
  const memUsage = process.memoryUsage();
  const uptime = process.uptime();

  return {
    uptime_seconds: Math.floor(uptime),
    memory_rss_bytes: memUsage.rss,
    memory_heap_used_bytes: memUsage.heapUsed,
    memory_heap_total_bytes: memUsage.heapTotal,
    memory_external_bytes: memUsage.external,
    pid: process.pid,
  };
};