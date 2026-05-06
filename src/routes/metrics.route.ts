import { Router, Request, Response } from "express";
import { register } from "../metrics/index.js";

const router = Router();

router.get("/metrics", async (_req: Request, res: Response) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).end(error);
  }
});

router.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export { router as metricsRouter };