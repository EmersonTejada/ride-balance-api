import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err.statusCode) {
    return res
      .status(err.statusCode)
      .json({ message: err.message, errors: err.details });
  }
  console.error(err);
  res.status(500).json({ message: "Error interno del servidor" });
};
