import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export const authenticate: RequestHandler = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    throw new AppError("Token no proporcionado", 401);
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    throw new AppError("Token inválido", 401);
  }
};