import { RequestHandler } from "express";
import * as ridesModel from "../models/rides.model.js";
import { NewRide, RideFilters } from "../types/rides";

export const createRide: RequestHandler<{}, {}, NewRide, {}> = (req, res) => {
  const ride = req.body;
  const newRide = ridesModel.createRide(ride);
  res.json({ message: "Viaje creado exitosamente", data: newRide });
};

export const getAllRides: RequestHandler = (req, res) => {
  try {
    const filters = {
        platform: req.query.platform as string ,
        from: req.query.from as string,
        to: req.query.to as string
    }
    const allRides = ridesModel.getAllRides(filters);
    res.json({ message: "Viajes obtenidos exitosamente", data: allRides });
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Ha ocurrido un error", error: err.message });
  }
};

export const getRideById: RequestHandler = (req, res) => {
  try {
    const id = req.params.id;
    const ride = ridesModel.getRideById(id);
    res.json({ message: "Viaje obtenido exitosamente", data: ride });
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Ha ocurrido un error", error: err.message });
  }
};

export const deleteRide: RequestHandler = (req, res) => {
  try {
    const id = req.params.id;
    const deletedRide = ridesModel.deleteRide(id);
    res.json({ message: "Viaje eliminado exitosamente", data: deletedRide });
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Ha ocurrido un error", error: err.message });
  }
};

export const updateRide: RequestHandler = (req, res) => {
  try {
    const id = req.params.id
    const ride = req.body
    const updatedRide = ridesModel.updatedRide(id, ride)
    res.json({message: "Viaje actualizado exitosamente", data: updatedRide})
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Ha ocurrido un error", error: err.message });
  }
};


