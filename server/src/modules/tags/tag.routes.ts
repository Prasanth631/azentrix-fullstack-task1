import { Router } from "express";
import { tagController } from "./tag.controller";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { createTagSchema, updateTagSchema } from "./tag.schema";

const router = Router();

router.use(authenticate);

router.get("/", tagController.getAll.bind(tagController));
router.get("/:id", tagController.getById.bind(tagController));

router.post(
  "/",
  validate(createTagSchema),
  tagController.create.bind(tagController)
);

router.put(
  "/:id",
  validate(updateTagSchema),
  tagController.update.bind(tagController)
);

router.delete("/:id", tagController.delete.bind(tagController));

export default router;
