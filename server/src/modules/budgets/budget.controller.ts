import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth";
import { budgetService } from "./budget.service";
import { sendResponse } from "../../utils/apiResponse";

export class BudgetController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { month, year } = req.query;
      const budgets = await budgetService.getAll(req.userId!, month as string, year as string);
      sendResponse({
        res,
        message: "Budgets retrieved successfully",
        data: budgets,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const budget = await budgetService.getById(req.params.id as string, req.userId!);
      sendResponse({
        res,
        message: "Budget retrieved successfully",
        data: budget,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProgress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { month, year } = req.query;
      
      const currentMonth = month ? parseInt(month as string) : new Date().getMonth() + 1;
      const currentYear = year ? parseInt(year as string) : new Date().getFullYear();
      
      const progress = await budgetService.getProgress(req.userId!, currentMonth, currentYear);
      sendResponse({
        res,
        message: "Budget progress retrieved successfully",
        data: progress,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const budget = await budgetService.create(req.userId!, req.body);
      sendResponse({
        res,
        statusCode: 201,
        message: "Budget created successfully",
        data: budget,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const budget = await budgetService.update(req.params.id as string, req.userId!, req.body);
      sendResponse({
        res,
        message: "Budget updated successfully",
        data: budget,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await budgetService.delete(req.params.id as string, req.userId!);
      sendResponse({
        res,
        message: "Budget deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const budgetController = new BudgetController();
