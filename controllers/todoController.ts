import { Request, Response } from "express";
import {
  addTaskService,
  deleteTaskService,
  editTaskByTaskIdService,
  fetchAllTodoByUserService,
} from "../services/todoService";
import { parseJwt } from "../utlis";

export const fetchAllTodoByUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.token as string;
    const email = parseJwt(token).email;
    const result = await fetchAllTodoByUserService(email);
    if (!result) {
      res.status(404).send({ message: "User not found" });
      return;
    }
    res.status(200).send(result);
  } catch (error) {
    console.log("Error fetching todo by user: ", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// Edit Task
export const editTaskByTaskId = async (req: Request, res: Response) => {
  try {
    
    const token = req.headers.token as string;
    const email = parseJwt(token).email;
    const taskId = req.headers.taskid as string;
    const updatedData = req.body;

    const result = await editTaskByTaskIdService(email, taskId, updatedData);
    if (!result) {
      res.status(404).send({ message: "Task not found" });
      return;
    }

    res.status(200).send(result);
  } catch (error) {
    console.error("Error editing task: ", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// Add Task
export const addTask = async (req: Request, res: Response) => {
  try {
    const token = req.headers.token as string;
    const email = parseJwt(token).email;
    const newTask = req.body;
    const result = await addTaskService(email, newTask);
    if (!result) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    res.status(201).send({ message: "Task added successfully" });
  } catch (error) {
    console.error("Error adding task: ", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// Delete Task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const token = req.headers.token as string;
    const email = parseJwt(token).email;
    const taskId = req.headers.taskid as string;

    const result = await deleteTaskService(email, taskId);
    if (!result) {
      res.status(404).send({ message: "Task not found" });
      return;
    }

    res.status(200).send({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task: ", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
