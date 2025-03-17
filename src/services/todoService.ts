import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const fetchAllTodoByUserService = async (userId: number) => {
  return await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
};

export const editTaskByTaskIdService = async (taskId: number, updatedData: {
  priority?: string;
  heading?: string;
  content?: string;
  completed?: boolean;
  deadline?: Date;
}) => {
  return await prisma.task.update({
    where: { id: taskId },
    data: updatedData
  });
};

export const addTaskService = async (userId: number, newTask: {
  priority: string;
  heading: string;
  content: string;
  deadline: Date;
  completed?: boolean;
}) => {
  // console.log("data       ")
  return await prisma.task.create({   
    data: {
      ...newTask,
      userId,
      completed: newTask.completed || false
    }
  });
};

export const deleteTaskService = async (taskId: number) => {
  await prisma.task.delete({ where: { id: taskId } });
  return true;
};  