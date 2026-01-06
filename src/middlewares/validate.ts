import { RequestHandler } from "express";
import { z } from "zod";
import { AppError } from "../errors/AppError.js";

export const validate =
  <T>(schema: z.ZodType<T>): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return next(new AppError("Error de validación", 400, errors));
    }

    req.body = result.data;
    next();
  };
