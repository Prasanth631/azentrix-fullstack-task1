export interface Category {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  isDefault: boolean;
  userId: string | null;
  createdAt: string;
}

export interface CreateCategoryInput {
  name: string;
  type: "INCOME" | "EXPENSE";
}
