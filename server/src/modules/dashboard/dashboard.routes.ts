import { Router } from "express";
import { dashboardController } from "./dashboard.controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.use(authenticate);

router.get(
  "/summary",
  dashboardController.getSummary.bind(dashboardController)
);

router.get(
  "/expense-breakdown",
  dashboardController.getExpenseBreakdown.bind(dashboardController)
);

router.get(
  "/monthly-trend",
  dashboardController.getMonthlyTrend.bind(dashboardController)
);

export default router;
