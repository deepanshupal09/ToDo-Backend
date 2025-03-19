import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export async function verify(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  console.log(req.cookies)
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No Bearer token provided");
    res.status(401).json({ message: "Access Denied" });
    return;
  }

  const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY as string);
    (req as any).user = decoded; // Attach user info to request
    next();
  } catch (error:any) {
    console.error("Invalid Token:", error);
    res.status(401).json({ message: "Invalid Token" });
  }
}
