import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.SECRET_KEY || "secret_key";

export const loginService = async (email: string, password: string): Promise<string | null> => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  return jwt.sign({ email: user.email, id: user.id, name: user.name }, JWT_SECRET, { expiresIn: "7d" });
};

export const signupService = async (userData: { email: string; password: string; name: string }): Promise<string | null> => {
  const existingUser = await prisma.user.findUnique({ where: { email: userData.email } });
  if (existingUser) return null;

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: userData.email,
      password: hashedPassword,
      name: userData.name
    }
  });

  return jwt.sign({ email: newUser.email, id: newUser.id, name: newUser.name }, JWT_SECRET, { expiresIn: "1h" });
};