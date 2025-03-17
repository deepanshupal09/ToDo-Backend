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
    const userId = parseJwt(token).id; // Changed to use user ID
    const result = await fetchAllTodoByUserService(Number(userId));
    res.status(200).send(result);
  } catch (error) {
    console.log("Error fetching todo by user: ", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const editTaskByTaskId = async (req: Request, res: Response) => {
  try {
    const token = req.headers.token as string;
    const userId = parseJwt(token).id;
    const taskId = parseInt(req.params.id as string);
    const updatedData = req.body;

    const result = await editTaskByTaskIdService(taskId, updatedData);
    res.status(200).send(result);
  } catch (error) {
    console.error("Error editing task: ", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const addTask = async (req: Request, res: Response) => {
  try {
    const token = req.headers.token as string;
    const userId = parseJwt(token).id;
    const newTask = req.body;
    // console.log("body: ", newTask)
    const result = await addTaskService(Number(userId), newTask);
    res.status(201).send(result);
  } catch (error) {
    console.error("Error adding task: ", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = parseInt(req.params.id as string);
    await deleteTaskService(taskId);
    res.status(200).send({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task: ", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};