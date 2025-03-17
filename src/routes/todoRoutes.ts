import { Router } from "express";
import { addTask, deleteTask, editTaskByTaskId, fetchAllTodoByUser } from "../controllers/todoController";

const router =  Router();

router.get("/", fetchAllTodoByUser)
router.put("/:id", editTaskByTaskId)
router.post("/", addTask)
router.delete("/:id", deleteTask)

export default router;