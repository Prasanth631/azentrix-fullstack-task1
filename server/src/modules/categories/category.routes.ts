import { Router } from "express";
import { categoryController } from "./category.controller";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { createCategorySchema } from "./category.schema";

const router = Router();

router.use(authenticate);

router.get("/", categoryController.getAll.bind(categoryController));

router.post(
  "/",
  validate(createCategorySchema),
  categoryController.create.bind(categoryController)
);

export default router;
