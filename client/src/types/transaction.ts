import { Category } from "./category";

export type TransactionType = "INCOME" | "EXPENSE";
export type RecurringInterval = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export interface Tag {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  amount: number;
  month: number;
  year: number;
  categoryId: string;
  category?: Pick<Category, "id" | "name" | "type">;
  userId: string;
  createdAt: string;
}

export interface BudgetProgress extends Budget {
  spent: number;
  remaining: number;
  percentage: number;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  date: string;
  notes: string | null;
  categoryId: string;
  category: Pick<Category, "id" | "name" | "type">;
  userId: string;
  isRecurring: boolean;
  recurringInterval: RecurringInterval | null;
  nextRecurringDate: string | null;
  tags: Pick<Tag, "id" | "name">[];
  createdAt: string;
}

export interface CreateTransactionInput {
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string;
  notes?: string;
  isRecurring?: boolean;
  recurringInterval?: RecurringInterval;
  tagIds?: string[];
}

export interface UpdateTransactionInput extends Partial<CreateTransactionInput> {}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: TransactionType;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: "date" | "amount" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
