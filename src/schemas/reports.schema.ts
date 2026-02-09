import z from "zod";

export const reportQuerySchema = z.object({
    from: z.coerce.date(),
    to: z.coerce.date()
})