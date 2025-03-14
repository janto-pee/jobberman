import express from "express";
import {
  createUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyUserSchema,
} from "../schema/user.schema";

import {
  CreateUserHandler,
  forgotPasswordHandler,
  getCurrentUserHandler,
  passwordResetHandler,
  verifyUserHandler,
} from "../controller/user.controller";

import validateResource from "../middleware/validate";

const router = express.Router();

router.post(
  "/api/users",
  validateResource(createUserSchema),
  CreateUserHandler,
);
router.get(
  "/api/users/verify/:id/:verificationcode",
  validateResource(verifyUserSchema),
  verifyUserHandler,
);
router.post(
  "/api/users/forgot-password",
  validateResource(forgotPasswordSchema),
  forgotPasswordHandler,
);
router.put(
  "/api/users/passwordreset/:id/:passwordresetcode",
  validateResource(resetPasswordSchema),
  passwordResetHandler,
);
router.get("/api/user/me", getCurrentUserHandler);

export default router;
