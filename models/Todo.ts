import mongoose, { Schema, Document } from 'mongoose';

export interface ITask {
  priority: string;
  heading: string;
  content: string;
  completed: boolean;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  tasks: ITask[];
  createdAt: Date;
  updatedAt: Date;
}

// Embedded Task Schema
const TaskSchema: Schema = new Schema<ITask>(
  {
    priority: { type: String, required: true },
    heading: { type: String, required: true },
    content: { type: String, required: true },
    completed: { type: Boolean, default: false },
    deadline: { type: Date, required: true },
  },
  {
    timestamps: true, //
  }
);

const UserSchema: Schema<IUser> = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    tasks: { type: [TaskSchema], default: [] },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model<IUser>('User', UserSchema);
