import { z } from "zod";

export const createTagSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(50, "Name must be less than 50 characters")
      .trim()
      .transform(val => val.toLowerCase()),
  }),
});

export const updateTagSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(50, "Name must be less than 50 characters")
      .trim()
      .transform(val => val.toLowerCase()),
  }),
});

export type CreateTagInput = z.infer<typeof createTagSchema>["body"];
export type UpdateTagInput = z.infer<typeof updateTagSchema>["body"];
