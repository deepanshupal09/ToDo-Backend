import { Request, Response } from "express";
import {
  addTaskService,
  deleteTaskService,
  editTaskByTaskIdService,
  fetchAllTodoByUserService,
} from "../services/todoService";
import { parseJwt } from "../utils/utlis";

export const extractUserIdFromToken = (req: Request): number => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: No Bearer token provided");
  }
  const token = authHeader.split(" ")[1];
  const userId = parseJwt(token)?.id;
  if (!userId) throw new Error("Invalid Token: Unable to extract user ID");
  return Number(userId);
};

export const fetchAllTodoByUser = async (req: Request, res: Response) => {
  try {
    const userId = extractUserIdFromToken(req);
    const result = await fetchAllTodoByUserService(userId);
    res.status(200).send(result);
  } catch (error:any) {
    console.error("Error fetching todo by user:", error);
    res.status(401).send({ message: error.message });
  }
};

export const editTaskByTaskId = async (req: Request, res: Response) => {
  try {
    const userId = extractUserIdFromToken(req);
    const taskId = parseInt(req.params.id);
    const updatedData = req.body;

    const result = await editTaskByTaskIdService(taskId, updatedData);
    res.status(200).send(result);
  } catch (error:any) {
    console.error("Error editing task:", error);
    
    if (error.name === "NotFoundError") {
      res.status(404).send({ message: error.message });
      return;
    }
    
    res.status(401).send({ message: error.message });
  }
};

export const addTask = async (req: Request, res: Response) => {
  try {
    const userId = extractUserIdFromToken(req);
    const newTask = req.body;

    const result = await addTaskService(userId, newTask);
    res.status(201).send(result);
  } catch (error:any) {
    console.error("Error adding task:", error);
    res.status(401).send({ message: error.message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = parseInt(req.params.id);
    await deleteTaskService(taskId);
    res.status(200).send({ message: "Task deleted successfully" });
  } catch (error:any) {
    console.error("Error deleting task:", error);
    
    if (error.name === "NotFoundError") {
      res.status(404).send({ message: error.message });
      return;
    }
    
    res.status(500).send({ message: "Internal Server Error" });
  }
};