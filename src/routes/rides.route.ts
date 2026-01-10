import { Router } from "express";
import * as ridesController from "../controllers/rides.controller.js";

import {
  createRideSchema,
  rideIdParamSchema,
  updateRideSchema,
} from "../schemas/rides.schema.js";
import { validateBody, validateParams } from "../middlewares/validate.js";
import { authenticate } from "../middlewares/auth.js";

export const ridesRouter = Router();

ridesRouter.post(
  "/",
  authenticate,
  validateBody(createRideSchema),
  ridesController.createRide
);
ridesRouter.get("/", authenticate, ridesController.getAllRides);
ridesRouter.get(
  "/:id",
  authenticate,
  validateParams(rideIdParamSchema),
  ridesController.getRideById
);
ridesRouter.delete(
  "/:id",
  authenticate,
  validateParams(rideIdParamSchema),
  ridesController.deleteRide
);
ridesRouter.patch(
  "/:id",
  authenticate,
  validateParams(rideIdParamSchema),
  validateBody(updateRideSchema),
  ridesController.updateRide
);
