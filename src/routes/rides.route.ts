import { Router } from "express";
import * as ridesController from "../controllers/rides.controller.js"
import { validate } from "../middlewares/validate.js";
import { createRideSchema } from "../schemas/rides.schema.js";

export const ridesRouter = Router()

ridesRouter.post("/", validate(createRideSchema), ridesController.createRide)
ridesRouter.get("/", ridesController.getAllRides)
ridesRouter.get("/:id", ridesController.getRideById)
ridesRouter.delete("/:id", ridesController.deleteRide)
ridesRouter.patch("/:id", ridesController.updateRide)