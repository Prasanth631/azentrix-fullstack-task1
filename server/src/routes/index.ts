import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import categoryRoutes from "../modules/categories/category.routes";
import transactionRoutes from "../modules/transactions/transaction.routes";
import dashboardRoutes from "../modules/dashboard/dashboard.routes";
import tagRoutes from "../modules/tags/tag.routes";
import budgetRoutes from "../modules/budgets/budget.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/transactions", transactionRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/tags", tagRoutes);
router.use("/budgets", budgetRoutes);

export default router;
