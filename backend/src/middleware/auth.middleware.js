import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  console.log("AUTH HEADER:", req.headers.authorization);
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Token missing" });
  }

  try {
    const token = header.split(" ")[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};
