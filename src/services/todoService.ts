import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const fetchAllTodoByUserService = async (userId: number) => {
  try {
    return await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    throw new Error("Failed to fetch tasks");
  }
};

export const editTaskByTaskIdService = async (taskId: number, updatedData: {
  priority?: string;
  heading?: string;
  content?: string;
  completed?: boolean;
  deadline?: Date;
}) => {
  try {
    
    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });
    
    if (!task) {
      const error = new Error("Task not found");
      error.name = "NotFoundError";
      throw error;
    }
    
    return await prisma.task.update({
      where: { id: taskId },
      data: updatedData
    });
  } catch (error: any) {
    console.error("Error updating task:", error);
    
    if (error.name === "NotFoundError") {
      throw error; 
    }
    
    if (error.code === "P2025") {
      const notFoundError = new Error("Task not found");
      notFoundError.name = "NotFoundError";
      throw notFoundError;
    }
    
    throw new Error("Failed to update task");
  }
};

export const addTaskService = async (userId: number, newTask: {
  priority: string;
  heading: string;
  content: string;
  deadline: Date;
  completed?: boolean;
}) => {
  try {
    return await prisma.task.create({   
      data: {
        ...newTask,
        userId,
        completed: newTask.completed || false
      }
    });
  } catch (error: any) {
    console.error("Error adding task:", error);
    
    if (error.code === "P2002") {
      throw new Error("Task with this information already exists");
    }
    
    throw new Error("Failed to add task");
  }
};

export const deleteTaskService = async (taskId: number) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });
    
    if (!task) {
      const error = new Error("Task not found");
      error.name = "NotFoundError";
      throw error;
    }
    
    await prisma.task.delete({ where: { id: taskId } });
    return true;
  } catch (error: any) {
    console.error("Error deleting task:", error);
    
    if (error.name === "NotFoundError") {
      throw error; 
    }
    
    if (error.code === "P2025") {
      const notFoundError = new Error("Task not found");
      notFoundError.name = "NotFoundError";
      throw notFoundError;
    }
    
    throw new Error("Failed to delete task");
  }
};