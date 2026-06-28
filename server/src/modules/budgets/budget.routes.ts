import { Router } from "express";
import { budgetController } from "./budget.controller";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { createBudgetSchema, updateBudgetSchema } from "./budget.schema";

const router = Router();

router.use(authenticate);

router.get("/progress", budgetController.getProgress.bind(budgetController));
router.get("/", budgetController.getAll.bind(budgetController));
router.get("/:id", budgetController.getById.bind(budgetController));

router.post(
  "/",
  validate(createBudgetSchema),
  budgetController.create.bind(budgetController)
);

router.put(
  "/:id",
  validate(updateBudgetSchema),
  budgetController.update.bind(budgetController)
);

router.delete("/:id", budgetController.delete.bind(budgetController));

export default router;
