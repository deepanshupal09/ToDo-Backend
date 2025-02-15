import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import todoRoutes from "./routes/todoRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use("/api/todo/", todoRoutes);
app.use("/api/user/", userRoutes);



app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://deepanshupal:XUAuYWdhid6PwoTA@cluster0.w8p4m.mongodb.net/todo';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

export default app;
