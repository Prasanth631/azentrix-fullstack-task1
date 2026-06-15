import api from "@/services/api";
import { Category, CreateCategoryInput } from "@/types/category";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const { data } = await api.get<ApiResponse<Category[]>>("/categories");
    return data.data;
  },

  async create(input: CreateCategoryInput): Promise<Category> {
    const { data } = await api.post<ApiResponse<Category>>("/categories", input);
    return data.data;
  },
};
