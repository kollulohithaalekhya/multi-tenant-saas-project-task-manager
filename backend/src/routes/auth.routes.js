import express from "express";
import {
  registerTenant,
  login,
  getCurrentUser,
  logout
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register-tenant", registerTenant);
router.post("/login", login);
router.get("/me", authenticate, getCurrentUser);
router.post("/logout", authenticate, logout);

export default router;
