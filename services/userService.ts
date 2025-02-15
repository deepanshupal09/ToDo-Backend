import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/Todo";
import { SignupData } from "../types/todoTypes";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.SECRET_KEY || "secret_key"; // Use environment variables for security

export const loginService = async (email: string, password: string): Promise<string | null> => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }

    const token = jwt.sign({ email: user.email, id: user._id, name: user.name }, JWT_SECRET, { expiresIn: "7d" });

    return token;
  } catch (error) {
    console.error("Error logging in: ", error);
    throw error;
  }
};

export const signupService = async (userData: SignupData): Promise<string | null> => {
  try {
    const { email, password, name } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return null;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
    });

    await newUser.save();
    const token = jwt.sign({ email: newUser.email, id: newUser._id, name: name }, JWT_SECRET, { expiresIn: "1h" });
    return token;
  } catch (error) {
    console.error("Error signing up user: ", error);
    throw error;
  }
};
