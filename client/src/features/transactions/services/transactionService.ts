import api from "@/services/api";
import { Transaction, CreateTransactionInput, UpdateTransactionInput, TransactionFilters } from "@/types/transaction";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const transactionService = {
  async getAll(filters: TransactionFilters = {}): Promise<ApiResponse<Transaction[]>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.set(key, String(value));
      }
    });
    const { data } = await api.get<ApiResponse<Transaction[]>>(`/transactions?${params}`);
    return data;
  },

  async getById(id: string): Promise<Transaction> {
    const { data } = await api.get<ApiResponse<Transaction>>(`/transactions/${id}`);
    return data.data;
  },

  async create(input: CreateTransactionInput): Promise<Transaction> {
    const { data } = await api.post<ApiResponse<Transaction>>("/transactions", input);
    return data.data;
  },

  async update(id: string, input: UpdateTransactionInput): Promise<Transaction> {
    const { data } = await api.put<ApiResponse<Transaction>>(`/transactions/${id}`, input);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/transactions/${id}`);
  },
};
