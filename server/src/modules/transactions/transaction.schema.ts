import { z } from "zod";

export const createTransactionSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(100, "Title must be less than 100 characters")
      .trim(),
    amount: z.number().positive("Amount must be greater than zero"),
    type: z.enum(["INCOME", "EXPENSE"], {
      errorMap: () => ({ message: "Type must be either INCOME or EXPENSE" }),
    }),
    categoryId: z.string().min(1, "Category is required"),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
    notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
  }),
});

export const updateTransactionSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(100, "Title must be less than 100 characters")
      .trim()
      .optional(),
    amount: z.number().positive("Amount must be greater than zero").optional(),
    type: z
      .enum(["INCOME", "EXPENSE"], {
        errorMap: () => ({ message: "Type must be either INCOME or EXPENSE" }),
      })
      .optional(),
    categoryId: z.string().min(1).optional(),
    date: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      })
      .optional(),
    notes: z.string().max(500).optional(),
  }),
});

export const getTransactionsSchema = z.object({
  query: z.object({
    page: z.string().optional().default("1"),
    limit: z.string().optional().default("10"),
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    categoryId: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    search: z.string().optional(),
    sortBy: z.enum(["date", "amount", "createdAt"]).optional().default("date"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  }),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>["body"];
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>["body"];
export type GetTransactionsQuery = z.infer<typeof getTransactionsSchema>["query"];
