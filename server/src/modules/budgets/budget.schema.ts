import { z } from "zod";

export const createBudgetSchema = z.object({
  body: z.object({
    amount: z.number().positive("Amount must be greater than zero"),
    categoryId: z.string().min(1, "Category is required"),
    month: z.number().min(1).max(12),
    year: z.number().min(2000).max(2100),
  }),
});

export const updateBudgetSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    amount: z.number().positive("Amount must be greater than zero").optional(),
    month: z.number().min(1).max(12).optional(),
    year: z.number().min(2000).max(2100).optional(),
  }),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>["body"];
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>["body"];
