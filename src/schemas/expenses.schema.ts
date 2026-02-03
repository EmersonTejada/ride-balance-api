import { z } from "zod";

export const createExpenseSchema = z.strictObject({
  amount: z.coerce.number("Debe ingresar un numero").positive("Debe ingresar un numero mayor a 0"),

  description: z.string().max(255).optional(),

  category: z.enum([
    "fuel",
    "maintenance",
    "food",
    "insurance",
    "parking",
    "phone",
    "tolls",
    "other",
  ]),

  subcategory: z
    .enum([
      "fuel_refill",
      "oil_change",
      "oil_refill",
      "repair",
      "spare_part",
      "tire",
      "brake",
      "battery",
      "cleaning",
      "accessory",
      "unknown",
    ])
    .optional(),

  date: z.coerce.date().optional(),
});

export const expenseIdParamSchema = z.object({
  id: z.uuid(),
});

export const updatedExpenseSchema = createExpenseSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe enviar al menos un campo para actualizar",
  });
