import { Router } from "express";
import { addTask, deleteTask, editTaskByTaskId, fetchAllTodoByUser } from "../controllers/todoController";

const router =  Router();

router.get("/fetchAllTasks", fetchAllTodoByUser)
router.put("/editTask", editTaskByTaskId)
router.post("/addTask", addTask)
router.delete("/deleteTask", deleteTask)

export default router;