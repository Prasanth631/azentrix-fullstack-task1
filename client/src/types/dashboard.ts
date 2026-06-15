export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  remainingBalance: number;
  currentMonthSavings: number;
  currentMonthIncome: number;
  currentMonthExpenses: number;
}

export interface ExpenseBreakdown {
  category: string;
  categoryId: string;
  amount: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expense: number;
}
