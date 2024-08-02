import express, { Application, Request, Response, NextFunction } from 'express';

const app: Application = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Helloooooooooo from the other side');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send('Something went wrong!');
});

export default app;
