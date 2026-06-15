import prisma from "../../config/database";
import { TransactionType } from "@prisma/client";

export class CategoryRepository {
  async findAllForUser(userId: string) {
    return prisma.category.findMany({
      where: {
        OR: [{ isDefault: true }, { userId }],
      },
      orderBy: [{ isDefault: "desc" }, { name: "asc" }],
    });
  }

  async findByNameAndType(name: string, type: TransactionType, userId: string) {
    return prisma.category.findFirst({
      where: {
        name,
        type,
        userId,
      },
    });
  }

  async create(data: { name: string; type: TransactionType; userId: string }) {
    return prisma.category.create({
      data: {
        name: data.name,
        type: data.type,
        userId: data.userId,
        isDefault: false,
      },
    });
  }
}

export const categoryRepository = new CategoryRepository();
