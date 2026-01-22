import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  projectId: z.string(),
  assignedTo: z.string().optional()
});
