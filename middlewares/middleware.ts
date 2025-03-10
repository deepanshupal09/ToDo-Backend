import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export async function verifyAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.token as string;
  if (!token) {
    console.log("no token");
    return res.status(401).send({ message: "Access Denied" });
  }
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    next();
  } catch (error) {
    console.error("Invalid Token:", error);
    res.status(400).send({ message: "Invalid Token" });
  }
}
