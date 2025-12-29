import { Router } from "express";
import * as ridesController from "../controllers/rides.controller.js"

export const ridesRouter = Router()

ridesRouter.post("/", ridesController.createRide)
ridesRouter.get("/", ridesController.getAllRides)
ridesRouter.get("/:id", ridesController.getRideById)
ridesRouter.delete("/:id", ridesController.deleteRide)
ridesRouter.patch("/:id", ridesController.updateRide)