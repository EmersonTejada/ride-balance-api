import { z } from "zod"

export const ridePlatformSchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") return value;
    return value.trim().toLowerCase();
  },
  z.enum(["yummy", "ridery", "particular"])
);

export const createRideSchema = z.object({
    amount: z.coerce.number().positive(),
    platform: ridePlatformSchema
}).strict()

export const updateRideSchema = createRideSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "Debe enviar al menos un campo para actualizar" }
);

export const rideIdParamSchema = z.object({
  id: z.uuid(),
});