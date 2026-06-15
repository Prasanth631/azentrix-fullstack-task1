import { transactionRepository } from "./transaction.repository";
import { NotFoundError } from "../../utils/errors";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
  GetTransactionsQuery,
} from "./transaction.schema";
import { TransactionType } from "@prisma/client";

export class TransactionService {
  async getAll(userId: string, query: GetTransactionsQuery) {
    const filters = {
      userId,
      type: query.type as TransactionType | undefined,
      categoryId: query.categoryId,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      search: query.search,
    };

    const pagination = {
      page: parseInt(query.page || "1", 10),
      limit: parseInt(query.limit || "10", 10),
      sortBy: query.sortBy || "date",
      sortOrder: (query.sortOrder || "desc") as "asc" | "desc",
    };

    return transactionRepository.findAll(filters, pagination);
  }

  async getById(id: string, userId: string) {
    const transaction = await transactionRepository.findById(id, userId);

    if (!transaction) {
      throw new NotFoundError("Transaction not found");
    }

    return transaction;
  }

  async create(userId: string, data: CreateTransactionInput) {
    return transactionRepository.create({
      title: data.title,
      amount: data.amount,
      type: data.type,
      date: new Date(data.date),
      notes: data.notes,
      categoryId: data.categoryId,
      userId,
    });
  }

  async update(id: string, userId: string, data: UpdateTransactionInput) {
    const updateData: Record<string, unknown> = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.date !== undefined) updateData.date = new Date(data.date);
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;

    const transaction = await transactionRepository.update(
      id,
      userId,
      updateData
    );

    if (!transaction) {
      throw new NotFoundError("Transaction not found");
    }

    return transaction;
  }

  async delete(id: string, userId: string) {
    const deleted = await transactionRepository.delete(id, userId);

    if (!deleted) {
      throw new NotFoundError("Transaction not found");
    }

    return true;
  }
}

export const transactionService = new TransactionService();
