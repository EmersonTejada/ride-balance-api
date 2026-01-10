import { RequestHandler } from "express";
import * as ridesModel from "../models/rides.model.js";
import { NewRide, RideFilters } from "../types/rides";
import { AppError } from "../errors/AppError.js";

export const createRide: RequestHandler<{}, {}, NewRide, {}> = async (
  req,
  res
) => {
  const newRide = await ridesModel.createRide(req.body, req.userId);
  res.json({ message: "Viaje creado exitosamente", data: newRide });
};

export const getAllRides: RequestHandler = async (req, res) => {
  const filters = {
      platform: req.query.platform as string | undefined,
      from: req.query.from as string | undefined,
      to: req.query.to as string | undefined,
    };
    const allRides = await ridesModel.getAllRides(req.userId, filters);
    res.json({ message: "Viajes obtenidos exitosamente", data: allRides });
};

export const getRideById: RequestHandler = async (req, res) => {
  const id = req.params.id;
  const ride = await ridesModel.getRideById(id, req.userId);
  if (!ride) {
    throw new AppError(`No existe un viaje con el id ${id}`, 404)
  }
  res.json({ message: "Viaje obtenido exitosamente", data: ride });
};

export const deleteRide: RequestHandler = async (req, res) => {
  const id = req.params.id;
    const deletedRide = await ridesModel.deleteRide(id, req.userId);
    if (deletedRide.count === 0) {
      throw new AppError(`No existe un viaje con el id ${id}`, 404)
    }
    res.json({ message: "Viaje eliminado exitosamente", data: null });
};

export const updateRide: RequestHandler = async (req, res) => {
  const id = req.params.id;
    const ride = req.body;
    const updatedRide = await ridesModel.updatedRide(id, req.userId, ride);
    if (updatedRide.length === 0) {
      throw new AppError(`No existe un viaje con el id ${id}`, 404)
    }
    res.json({
      message: "Viaje actualizado exitosamente",
      data: updatedRide[0],
    });
};
