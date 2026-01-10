import { z } from "zod";

export const registerSchema = z.object({
  email: z.email("Email invalido"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(50, "El nombre no puede exceder 50 caracteres"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
}).strict();

export const loginSchema = z.object({
  email: z.email("Email invalido"),
  password: z.string().min(1, "La contraseña es requerida"),
}).strict();

export const updateUserSchema = z.object({
  email: z.email("Email invalido").optional(),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(50, "El nombre no puede exceder 50 caracteres").optional(),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional(),
}).strict().refine(
  (data) => Object.keys(data).length > 0,
  { message: "Debe enviar al menos un campo para actualizar" }
);