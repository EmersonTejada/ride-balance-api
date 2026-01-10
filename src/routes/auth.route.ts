import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import {
  registerSchema,
  loginSchema,
  updateUserSchema,
} from "../schemas/auth.schema.js";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), authController.createUser);
authRouter.post("/login", validateBody(loginSchema), authController.login);
authRouter.post("/logout", authenticate, authController.logout);
authRouter.get("/me", authenticate, authController.getUserProfile);
authRouter.patch("/me", authenticate, validateBody(updateUserSchema), authController.updateUser);
authRouter.delete("/me", authenticate, authController.deleteUser);