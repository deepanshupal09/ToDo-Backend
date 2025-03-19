import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import todoRoutes from "./routes/todoRoutes";
import userRoutes from "./routes/userRoutes";
import dotenv from 'dotenv';
import { verify } from './middlewares/middleware';
import swaggerDocs from './utils/swagger';

dotenv.config();

const app = express();
const port: number = Number(process.env.PORT) || 8000;
const prisma = new PrismaClient();

app.use(express.json());
app.use("/api/tasks/", verify, todoRoutes);
app.use("/api/auth/", userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Database connection check
const checkDatabaseConnection = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`; 
    console.log('Connected to PostgreSQL');
    return true;
  } catch (error:any) {
    console.error('Failed to connect to PostgreSQL', error);
    return false;
  }
};

// Start server
const startServer = async () => {
  const dbConnected = await checkDatabaseConnection();
  if (!dbConnected) {
    console.error('Cannot start server without database connection');
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

startServer();

swaggerDocs(app, port);

// Handle shutdown gracefully
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});

export { app, prisma };