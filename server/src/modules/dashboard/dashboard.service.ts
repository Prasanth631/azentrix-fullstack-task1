import prisma from "../../config/database";
import { TransactionType } from "@prisma/client";

export class DashboardService {
  async getSummary(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Get totals
    const [totalIncome, totalExpense, monthlyIncome, monthlyExpense] =
      await Promise.all([
        prisma.transaction.aggregate({
          where: { userId, type: TransactionType.INCOME },
          _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
          where: { userId, type: TransactionType.EXPENSE },
          _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
          where: {
            userId,
            type: TransactionType.INCOME,
            date: { gte: startOfMonth, lte: endOfMonth },
          },
          _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
          where: {
            userId,
            type: TransactionType.EXPENSE,
            date: { gte: startOfMonth, lte: endOfMonth },
          },
          _sum: { amount: true },
        }),
      ]);

    const income = totalIncome._sum.amount || 0;
    const expense = totalExpense._sum.amount || 0;
    const monthIncome = monthlyIncome._sum.amount || 0;
    const monthExpense = monthlyExpense._sum.amount || 0;

    return {
      totalIncome: income,
      totalExpenses: expense,
      remainingBalance: income - expense,
      currentMonthSavings: monthIncome - monthExpense,
      currentMonthIncome: monthIncome,
      currentMonthExpenses: monthExpense,
    };
  }

  async getExpenseBreakdown(userId: string) {
    const breakdown = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: { userId, type: TransactionType.EXPENSE },
      _sum: { amount: true },
      orderBy: { _sum: { amount: "desc" } },
    });

    // Fetch category names
    const categoryIds = breakdown.map((b) => b.categoryId);
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true },
    });

    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

    return breakdown.map((item) => ({
      category: categoryMap.get(item.categoryId) || "Unknown",
      categoryId: item.categoryId,
      amount: item._sum.amount || 0,
    }));
  }

  async getMonthlyTrend(userId: string) {
    // Get data for the last 6 months
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: sixMonthsAgo },
      },
      select: {
        amount: true,
        type: true,
        date: true,
      },
      orderBy: { date: "asc" },
    });

    // Group by month
    const monthlyData = new Map<
      string,
      { income: number; expense: number }
    >();

    // Initialize all 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthlyData.set(key, { income: 0, expense: 0 });
    }

    // Fill with actual data
    for (const tx of transactions) {
      const date = new Date(tx.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      const entry = monthlyData.get(key);
      if (entry) {
        if (tx.type === TransactionType.INCOME) {
          entry.income += tx.amount;
        } else {
          entry.expense += tx.amount;
        }
      }
    }

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    return Array.from(monthlyData.entries()).map(([key, data]) => {
      const [year, month] = key.split("-");
      return {
        month: `${months[parseInt(month) - 1]} ${year}`,
        income: Math.round(data.income * 100) / 100,
        expense: Math.round(data.expense * 100) / 100,
      };
    });
  }
}

export const dashboardService = new DashboardService();
