import User, { ITask } from "../models/Todo";

export const fetchAllTodoByUserService = async (email: string) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return null;
    }
    return user.tasks;
  } catch (error) {
    console.error("Error fetching todo by user: ", error);
  }
};

export const editTaskByTaskIdService = async (email: string, taskId: string, updatedData: Partial<ITask>) => {
  try {
    const updateFields: Record<string, any> = {};
    // Explicitly assert key as a valid key of ITask
    Object.keys(updatedData).forEach((key) => {
      updateFields[`tasks.$.${key as keyof ITask}`] = updatedData[key as keyof ITask];
    });

    const result = await User.updateOne({ email, "tasks._id": taskId }, { $set: updateFields });

    return result.modifiedCount > 0 ? updatedData : null;
  } catch (error) {
    console.error("Error editing task by task id: ", error);
    throw error;
  }
};

export const addTaskService = async (email: string, newTask: Partial<ITask>): Promise<boolean | null> => {
  try {
    // Validate that all required fields are provided.
    if (!newTask.priority || !newTask.heading || !newTask.content || !newTask.deadline) {
      throw new Error("Missing required fields for task.");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return null;
    }

    const taskToAdd = {
      priority: newTask.priority,
      heading: newTask.heading,
      content: newTask.content,
      deadline: newTask.deadline,
      completed: newTask.completed ?? false,
    };

    user.tasks.push(taskToAdd as ITask);
    await user.save();

    return true;
  } catch (error) {
    console.error("Error adding task: ", error);
    throw error;
  }
};

export const deleteTaskService = async (email: string, taskId: string): Promise<boolean | null> => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return null; // User not found
    }

    const result = await User.updateOne({ email }, { $pull: { tasks: { _id: taskId } } });

    // Check if any document was modified
    if (result.modifiedCount === 0) {
      return false; // Task was not found or not deleted
    }

    return true;

    return true;
  } catch (error) {
    console.error("Error deleting task: ", error);
    throw error;
  }
};
