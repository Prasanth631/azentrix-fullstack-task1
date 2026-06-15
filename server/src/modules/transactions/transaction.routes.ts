import { Router } from "express";
import { transactionController } from "./transaction.controller";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "./transaction.schema";

const router = Router();

router.use(authenticate);

router.get("/", transactionController.getAll.bind(transactionController));

router.get("/:id", transactionController.getById.bind(transactionController));

router.post(
  "/",
  validate(createTransactionSchema),
  transactionController.create.bind(transactionController)
);

router.put(
  "/:id",
  validate(updateTransactionSchema),
  transactionController.update.bind(transactionController)
);

router.delete(
  "/:id",
  transactionController.delete.bind(transactionController)
);

export default router;
