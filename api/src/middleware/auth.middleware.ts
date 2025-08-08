import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Extend the Express Request type to include `user`
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    req.user = { id: decoded.id }; // Attach to `req.user`
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
