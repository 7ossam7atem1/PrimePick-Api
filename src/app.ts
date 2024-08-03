import express, { Application, Request, Response, NextFunction } from 'express';
import authRoutes from './routes/authRoutes';
const app: Application = express();

app.use(express.json());
app.use('/api/v1/auth', authRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send('Something went wrong!');
});

export default app;
