import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth";
import { dashboardService } from "./dashboard.service";
import { sendResponse } from "../../utils/apiResponse";

export class DashboardController {
  async getSummary(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const summary = await dashboardService.getSummary(req.userId!);
      sendResponse({
        res,
        message: "Dashboard summary retrieved successfully",
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }

  async getExpenseBreakdown(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const breakdown = await dashboardService.getExpenseBreakdown(
        req.userId!
      );
      sendResponse({
        res,
        message: "Expense breakdown retrieved successfully",
        data: breakdown,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMonthlyTrend(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const trend = await dashboardService.getMonthlyTrend(req.userId!);
      sendResponse({
        res,
        message: "Monthly trend retrieved successfully",
        data: trend,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
