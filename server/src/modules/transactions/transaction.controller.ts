import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth";
import { transactionService } from "./transaction.service";
import { sendResponse } from "../../utils/apiResponse";

export class TransactionController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await transactionService.getAll(req.userId!, req.query as any);
      sendResponse({
        res,
        message: "Transactions retrieved successfully",
        data: result.transactions,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const transaction = await transactionService.getById(
        req.params.id as string,
        req.userId!
      );
      sendResponse({
        res,
        message: "Transaction retrieved successfully",
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const transaction = await transactionService.create(
        req.userId!,
        req.body
      );
      sendResponse({
        res,
        statusCode: 201,
        message: "Transaction created successfully",
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const transaction = await transactionService.update(
        req.params.id as string,
        req.userId!,
        req.body
      );
      sendResponse({
        res,
        message: "Transaction updated successfully",
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await transactionService.delete(req.params.id as string, req.userId!);
      sendResponse({
        res,
        message: "Transaction deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const transactionController = new TransactionController();
