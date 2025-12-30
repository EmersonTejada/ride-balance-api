import { RequestHandler } from "express";
import * as ridesModel from "../models/rides.model.js";
import { NewRide, RideFilters } from "../types/rides";

export const createRide: RequestHandler<{}, {}, NewRide, {}> = async (
  req,
  res
) => {
  const ride = req.body;
  const newRide = await ridesModel.createRide(ride);
  res.json({ message: "Viaje creado exitosamente", data: newRide });
};

export const getAllRides: RequestHandler = async (req, res) => {
  try {
    const filters = {
      platform: req.query.platform as string | undefined,
      from: req.query.from as string | undefined,
      to: req.query.to as string | undefined,
    };
    const allRides = await ridesModel.getAllRides(filters);
    res.json({ message: "Viajes obtenidos exitosamente", data: allRides });
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Ha ocurrido un error", error: err.message });
  }
};

export const getRideById: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const ride = await ridesModel.getRideById(id);
    if (!ride) {
      return res.status(404).json({
        message: `No se encontró un viaje con el id ${req.params.id}`,
      });
    }
    res.json({ message: "Viaje obtenido exitosamente", data: ride });
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Ha ocurrido un error", error: err.message });
  }
};

export const deleteRide: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedRide = await ridesModel.deleteRide(id);
    if (deletedRide.count === 0) {
      return res.status(404).json({
        message: `No se encontró un viaje con el id ${req.params.id}`,
      });
    }
    res.json({ message: "Viaje eliminado exitosamente" });
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Ha ocurrido un error", error: err.message });
  }
};

export const updateRide: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const ride = req.body;
    const updatedRide = await ridesModel.updatedRide(id, ride);
    if (updatedRide.length === 0) {
      return res.status(404).json({
        message: `No se encontró un viaje con el id ${req.params.id}`,
      });
    }
    res.json({
      message: "Viaje actualizado exitosamente",
      data: updatedRide[0],
    });
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Ha ocurrido un error", error: err.message });
  }
};
