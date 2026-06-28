import { transactionRepository } from "./transaction.repository";
import { NotFoundError } from "../../utils/errors";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
  GetTransactionsQuery,
} from "./transaction.schema";
import { TransactionType } from "@prisma/client";
import prisma from "../../config/database";

export class TransactionService {
  private async processRecurringTransactions(userId: string) {
    const pendingRecurring = await prisma.transaction.findMany({
      where: {
        userId,
        isRecurring: true,
        nextRecurringDate: {
          lte: new Date(),
        },
      },
      include: {
        tags: true,
      },
    });

    for (const tx of pendingRecurring) {
      if (!tx.recurringInterval || !tx.nextRecurringDate) continue;

      let currentDate = new Date(tx.nextRecurringDate);
      const now = new Date();
      let iterations = 0; // prevent infinite loops

      while (currentDate <= now && iterations < 100) {
        // create new transaction
        await prisma.transaction.create({
          data: {
            title: tx.title,
            amount: tx.amount,
            type: tx.type,
            date: new Date(currentDate),
            notes: tx.notes,
            categoryId: tx.categoryId,
            userId: tx.userId,
            isRecurring: true,
            recurringInterval: tx.recurringInterval,
            nextRecurringDate: null, // children shouldn't spawn their own children
            tags: tx.tags.length > 0 ? {
              connect: tx.tags.map(t => ({ id: t.id }))
            } : undefined,
          }
        });

        // advance date
        if (tx.recurringInterval === "DAILY") currentDate.setDate(currentDate.getDate() + 1);
        else if (tx.recurringInterval === "WEEKLY") currentDate.setDate(currentDate.getDate() + 7);
        else if (tx.recurringInterval === "MONTHLY") currentDate.setMonth(currentDate.getMonth() + 1);
        else if (tx.recurringInterval === "YEARLY") currentDate.setFullYear(currentDate.getFullYear() + 1);
        
        iterations++;
      }

      // update original transaction's next date
      await prisma.transaction.update({
        where: { id: tx.id },
        data: {
          nextRecurringDate: currentDate,
        }
      });
    }
  }

  async getAll(userId: string, query: GetTransactionsQuery) {
    // Process any pending recurring transactions before returning data
    await this.processRecurringTransactions(userId);

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

  private calculateNextRecurringDate(date: Date, interval: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY") {
    const nextDate = new Date(date);
    if (interval === "DAILY") nextDate.setDate(nextDate.getDate() + 1);
    else if (interval === "WEEKLY") nextDate.setDate(nextDate.getDate() + 7);
    else if (interval === "MONTHLY") nextDate.setMonth(nextDate.getMonth() + 1);
    else if (interval === "YEARLY") nextDate.setFullYear(nextDate.getFullYear() + 1);
    return nextDate;
  }

  async create(userId: string, data: CreateTransactionInput) {
    let nextRecurringDate = null;
    if (data.isRecurring && data.recurringInterval) {
      nextRecurringDate = this.calculateNextRecurringDate(new Date(data.date), data.recurringInterval);
    }

    return transactionRepository.create({
      title: data.title,
      amount: data.amount,
      type: data.type,
      date: new Date(data.date),
      notes: data.notes,
      categoryId: data.categoryId,
      userId,
      isRecurring: data.isRecurring,
      recurringInterval: data.recurringInterval,
      nextRecurringDate,
      tagIds: data.tagIds,
    } as any); // using any here to bypass exact match of undefined fields
  }

  async update(id: string, userId: string, data: UpdateTransactionInput) {
    const updateData: Record<string, any> = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.date !== undefined) updateData.date = new Date(data.date);
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.tagIds !== undefined) updateData.tagIds = data.tagIds;
    if (data.isRecurring !== undefined) updateData.isRecurring = data.isRecurring;
    if (data.recurringInterval !== undefined) updateData.recurringInterval = data.recurringInterval;

    if (updateData.isRecurring && updateData.recurringInterval) {
      const baseDate = updateData.date || new Date();
      updateData.nextRecurringDate = this.calculateNextRecurringDate(baseDate, updateData.recurringInterval);
    } else if (updateData.isRecurring === false) {
      updateData.nextRecurringDate = null;
      updateData.recurringInterval = null;
    }

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
