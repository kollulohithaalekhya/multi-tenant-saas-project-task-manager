import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    req.user = decoded; // { userId, tenantId, role }
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}
