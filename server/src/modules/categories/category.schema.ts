import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Category name must be at least 2 characters")
      .max(30, "Category name must be less than 30 characters")
      .trim(),
    type: z.enum(["INCOME", "EXPENSE"], {
      errorMap: () => ({ message: "Type must be either INCOME or EXPENSE" }),
    }),
  }),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>["body"];
