import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.js";

export const authRouter = Router();

authRouter.post("/register", authController.createUser);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authenticate, authController.logout);
authRouter.get("/me", authenticate, authController.getUserProfile);
authRouter.patch("/me", authenticate, authController.updateUser);
authRouter.delete("/me", authenticate, authController.deleteUser);