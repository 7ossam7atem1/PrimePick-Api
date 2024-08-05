import express, { Application, Request, Response, NextFunction } from 'express';
import authRoutes from './routes/authRoutes';
import globalError from './middlewares/errorHandlingMiddleware';
const app: Application = express();

app.use(express.json());
app.use('/api/v1/auth', authRoutes);
app.use(globalError);

export default app;
