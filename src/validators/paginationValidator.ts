import { z } from "zod";

export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform(val => Number(val || 1))
    .refine(val => val > 0, "Page must be > 0"),

  limit: z
    .string()
    .optional()
    .transform(val => Number(val || 10))
    .refine(val => val > 0 && val <= 100, "Limit must be 1–100"),

  status: z.string().optional(),
  assignedTo: z.string().optional()
});
