import { budgetRepository } from "./budget.repository";
import { NotFoundError, BadRequestError } from "../../utils/errors";
import { CreateBudgetInput, UpdateBudgetInput } from "./budget.schema";
import prisma from "../../config/database";

export class BudgetService {
  async getAll(userId: string, month?: string, year?: string) {
    return budgetRepository.findAll(
      userId, 
      month ? parseInt(month) : undefined, 
      year ? parseInt(year) : undefined
    );
  }

  async getById(id: string, userId: string) {
    const budget = await budgetRepository.findById(id, userId);
    if (!budget) {
      throw new NotFoundError("Budget not found");
    }
    return budget;
  }

  async getProgress(userId: string, month: number, year: number) {
    const budgets = await budgetRepository.findAll(userId, month, year);
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    
    const expenses = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        userId,
        type: "EXPENSE",
        date: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    });

    const progress = budgets.map((budget) => {
      const spent = expenses.find((e) => e.categoryId === budget.categoryId)?._sum.amount || 0;
      return {
        ...budget,
        spent,
        remaining: budget.amount - spent,
        percentage: Math.min((spent / budget.amount) * 100, 100),
      };
    });

    return progress;
  }

  async create(userId: string, data: CreateBudgetInput) {
    const existing = await budgetRepository.findByCategoryMonthYear(
      data.categoryId, data.month, data.year, userId
    );
    if (existing) {
      throw new BadRequestError("Budget already exists for this category in the specified month/year");
    }
    return budgetRepository.create({ ...data, userId });
  }

  async update(id: string, userId: string, data: UpdateBudgetInput) {
    if (data.month || data.year) {
      const budget = await this.getById(id, userId);
      const newMonth = data.month || budget.month;
      const newYear = data.year || budget.year;
      
      const existing = await budgetRepository.findByCategoryMonthYear(
        budget.categoryId, newMonth, newYear, userId
      );
      if (existing && existing.id !== id) {
        throw new BadRequestError("Another budget exists for this category in the new month/year");
      }
    }
    
    const budget = await budgetRepository.update(id, userId, data);
    if (!budget) {
      throw new NotFoundError("Budget not found");
    }
    return budget;
  }

  async delete(id: string, userId: string) {
    const deleted = await budgetRepository.delete(id, userId);
    if (!deleted) {
      throw new NotFoundError("Budget not found");
    }
    return true;
  }
}

export const budgetService = new BudgetService();
