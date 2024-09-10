import express, { Application, Request, Response, NextFunction } from 'express';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import productRoutes from './routes/productRoutes';
import reviewRoutes from './routes/reviewRoutes';
import subCategoryRoutes from './routes/subCategoryRoutes';

import globalError from './middlewares/errorHandlingMiddleware';
const app: Application = express();

app.use(express.json());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/sub-categories', subCategoryRoutes);
app.use('/api/v1/review', reviewRoutes);
app.use(globalError);

export default app;
