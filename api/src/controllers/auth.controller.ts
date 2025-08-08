import { Request, Response } from "express";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

const createToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
};

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) return res.status(400).json({ message: "Email already in use" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashedPassword });

  const token = createToken(user.id);
  res.status(201).json({ token, user: { id: user.id, email: user.email } });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = createToken(user.id);
  res.json({ token, user: { id: user.id, email: user.email } });
};

export const getProfile = async (req: Request, res: Response) => {
  // Use req.user.id as set by authMiddleware
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ message: "No user id in request" });
  const user = await User.findById(userId).select("id email");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
};
