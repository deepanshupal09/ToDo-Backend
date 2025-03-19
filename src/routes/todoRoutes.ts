/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: API for managing to-do tasks
 * securityDefinitions:
 *    BearerAuth:
 *    type: apiKey
 *    name: Authorization
 *    in: header
 */
import { Router } from "express";
import { addTask, deleteTask, editTaskByTaskId, fetchAllTodoByUser } from "../controllers/todoController";

const router = Router();

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Fetch all to-do tasks of a user
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Returns a list of to-do tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   heading:
 *                     type: string
 *                     example: "Buy groceries"
 *                   content:
 *                     type: string
 *                     example: "Milk, Eggs, Bread"
 *                   priority:
 *                     type: string
 *                     example: "high"
 *                   completed:
 *                     type: boolean
 *                     example: false
 *                   deadline:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-08-10T14:30:00.000Z"
 *       401:
 *         description: Unauthorized (Missing or Invalid Bearer Token)
 *       500:
 *         description: Internal Server Error
 */
router.get("/", fetchAllTodoByUser)

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Edit an existing to-do task by task ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the task to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               priority:
 *                 type: string
 *                 example: "medium"
 *               heading:
 *                 type: string
 *                 example: "Finish report"
 *               content:
 *                 type: string
 *                 example: "Complete the project report and submit it by EOD."
 *               completed:
 *                 type: boolean
 *                 example: true
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-08-15T18:00:00.000Z"
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Bad request (Invalid data format)
 *       401:
 *         description: Unauthorized (Missing or Invalid Bearer Token)
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal Server Error
 */
router.put("/:id", editTaskByTaskId)

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Add a new to-do task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - heading
 *               - content
 *               - priority
 *               - deadline
 *             properties:
 *               heading:
 *                 type: string
 *                 example: "Prepare for meeting"
 *               content:
 *                 type: string
 *                 example: "Review agenda and gather necessary documents."
 *               priority:
 *                 type: string
 *                 example: "high"
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-08-12T10:00:00.000Z"
 *               completed:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Task added successfully
 *       400:
 *         description: Bad request (Missing required fields)
 *       401:
 *         description: Unauthorized (Missing or Invalid Bearer Token)
 *       500:
 *         description: Internal Server Error
 */
router.post("/", addTask)

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a to-do task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the task to delete
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Unauthorized (Missing or Invalid Bearer Token)
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id", deleteTask)

export default router;