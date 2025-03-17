import { Request, Response } from "express";
import { loginService, signupService } from "../services/userService";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const result = await signupService({ email, password, name });
    
    if (!result) {
      res.status(409).send({ message: "User already exists" });
      return;
    }
    
    res.status(201).send({ token: result });
  } catch (error) {
    console.log("Error signing up user: ", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const email = req.body.email as string;
    const password = req.body.password as string;

    if (!email || !password) {
      res.status(400).send({ message: "Email and password are required" });
      return;
    }

    const token = await loginService(email, password);

    if (!token) {
      res.status(401).send({ message: "Invalid email or password" });
      return;
    }

    res.status(200).send({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};