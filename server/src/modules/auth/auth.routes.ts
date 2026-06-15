import { Router } from "express";
import { authController } from "./auth.controller";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { registerSchema, loginSchema } from "./auth.schema";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  authController.register.bind(authController)
);

router.post(
  "/login",
  validate(loginSchema),
  authController.login.bind(authController)
);

router.post("/logout", authController.logout.bind(authController));

router.get(
  "/me",
  authenticate,
  authController.getProfile.bind(authController)
);

export default router;
