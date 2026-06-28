import prisma from "../../config/database";

export class BudgetRepository {
  async findAll(userId: string, month?: number, year?: number) {
    const where: any = { userId };
    if (month !== undefined) where.month = month;
    if (year !== undefined) where.year = year;

    return prisma.budget.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true, type: true },
        },
      },
      orderBy: { amount: "desc" },
    });
  }

  async findById(id: string, userId: string) {
    return prisma.budget.findFirst({
      where: { id, userId },
      include: {
        category: {
          select: { id: true, name: true, type: true },
        },
      },
    });
  }

  async findByCategoryMonthYear(categoryId: string, month: number, year: number, userId: string) {
    return prisma.budget.findUnique({
      where: {
        categoryId_month_year_userId: {
          categoryId,
          month,
          year,
          userId,
        },
      },
    });
  }

  async create(data: { amount: number; categoryId: string; month: number; year: number; userId: string }) {
    return prisma.budget.create({
      data,
      include: {
        category: {
          select: { id: true, name: true, type: true },
        },
      },
    });
  }

  async update(id: string, userId: string, data: Partial<{ amount: number; month: number; year: number }>) {
    return prisma.budget.updateMany({
      where: { id, userId },
      data,
    }).then(async (result) => {
      if (result.count === 0) return null;
      return prisma.budget.findFirst({
        where: { id, userId },
        include: {
          category: {
            select: { id: true, name: true, type: true },
          },
        },
      });
    });
  }

  async delete(id: string, userId: string) {
    const result = await prisma.budget.deleteMany({
      where: { id, userId },
    });
    return result.count > 0;
  }
}

export const budgetRepository = new BudgetRepository();
