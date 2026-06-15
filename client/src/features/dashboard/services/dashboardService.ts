import api from "@/services/api";
import { DashboardSummary, ExpenseBreakdown, MonthlyTrend } from "@/types/dashboard";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const { data } = await api.get<ApiResponse<DashboardSummary>>("/dashboard/summary");
    return data.data;
  },

  async getExpenseBreakdown(): Promise<ExpenseBreakdown[]> {
    const { data } = await api.get<ApiResponse<ExpenseBreakdown[]>>("/dashboard/expense-breakdown");
    return data.data;
  },

  async getMonthlyTrend(): Promise<MonthlyTrend[]> {
    const { data } = await api.get<ApiResponse<MonthlyTrend[]>>("/dashboard/monthly-trend");
    return data.data;
  },
};
