import { Router } from "express";
import * as ridesController from "../controllers/rides.controller.js";

import {
  createRideSchema,
  rideIdParamSchema,
  updateRideSchema,
} from "../schemas/rides.schema.js";
import { validateBody, validateParams } from "../middlewares/validate.js";

export const ridesRouter = Router();

ridesRouter.post(
  "/",
  validateBody(createRideSchema),
  ridesController.createRide
);
ridesRouter.get("/", ridesController.getAllRides);
ridesRouter.get(
  "/:id",
  validateParams(rideIdParamSchema),
  ridesController.getRideById
);
ridesRouter.delete(
  "/:id",
  validateParams(rideIdParamSchema),
  ridesController.deleteRide
);
ridesRouter.patch(
  "/:id",
  validateParams(rideIdParamSchema),
  validateBody(updateRideSchema),
  ridesController.updateRide
);
