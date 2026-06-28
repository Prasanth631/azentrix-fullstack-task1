import api from "@/services/api";
import { Budget, BudgetProgress } from "@/types/transaction";

export const budgetService = {
  async getAll(month?: number, year?: number): Promise<Budget[]> {
    const params = new URLSearchParams();
    if (month) params.append("month", month.toString());
    if (year) params.append("year", year.toString());
    
    const { data } = await api.get(`/budgets?${params.toString()}`);
    return data.data;
  },

  async getProgress(month?: number, year?: number): Promise<BudgetProgress[]> {
    const params = new URLSearchParams();
    if (month) params.append("month", month.toString());
    if (year) params.append("year", year.toString());
    
    const { data } = await api.get(`/budgets/progress?${params.toString()}`);
    return data.data;
  },

  async create(payload: { amount: number; categoryId: string; month: number; year: number }): Promise<Budget> {
    const { data } = await api.post("/budgets", payload);
    return data.data;
  },

  async update(id: string, payload: Partial<{ amount: number; month: number; year: number }>): Promise<Budget> {
    const { data } = await api.put(`/budgets/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/budgets/${id}`);
  },
};
