import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export async function verify(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.token as string;
  if (!token) {
    console.log("no token");
    res.status(401).send({ message: "Access Denied" });
    return;
  }
  try {
    const decoded: any = jwt.verify(token, process.env.SECRET_KEY as string);
    next();
  } catch (error) {
    console.error("Invalid Token:", error);
    res.status(400).send({ message: "Invalid Token" });
  }
}
