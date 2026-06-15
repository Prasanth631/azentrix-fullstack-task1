import prisma from "../../config/database";
import { Prisma, TransactionType } from "@prisma/client";

export interface TransactionFilters {
  userId: string;
  type?: TransactionType;
  categoryId?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export class TransactionRepository {
  async findAll(filters: TransactionFilters, pagination: PaginationOptions) {
    const where: Prisma.TransactionWhereInput = {
      userId: filters.userId,
    };

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.date.lte = filters.endDate;
      }
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { notes: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const skip = (pagination.page - 1) * pagination.limit;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, type: true },
          },
        },
        orderBy: { [pagination.sortBy]: pagination.sortOrder },
        skip,
        take: pagination.limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    return {
      transactions,
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    };
  }

  async findById(id: string, userId: string) {
    return prisma.transaction.findFirst({
      where: { id, userId },
      include: {
        category: {
          select: { id: true, name: true, type: true },
        },
      },
    });
  }

  async create(data: {
    title: string;
    amount: number;
    type: TransactionType;
    date: Date;
    notes?: string;
    categoryId: string;
    userId: string;
  }) {
    return prisma.transaction.create({
      data,
      include: {
        category: {
          select: { id: true, name: true, type: true },
        },
      },
    });
  }

  async update(
    id: string,
    userId: string,
    data: Partial<{
      title: string;
      amount: number;
      type: TransactionType;
      date: Date;
      notes: string;
      categoryId: string;
    }>
  ) {
    return prisma.transaction.updateMany({
      where: { id, userId },
      data,
    }).then(async (result) => {
      if (result.count === 0) return null;
      return prisma.transaction.findFirst({
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
    const result = await prisma.transaction.deleteMany({
      where: { id, userId },
    });
    return result.count > 0;
  }
}

export const transactionRepository = new TransactionRepository();
