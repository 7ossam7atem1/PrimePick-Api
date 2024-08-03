import app from './app';
import connectDB from './dbconfig/database';
import dotenv from 'dotenv';

dotenv.config();

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down..');
  console.log(err.name, err.message);
  process.exit(1);
});

connectDB();

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Application Running on port : ${port}`);
});

process.on('unhandledRejection', (err: any) => {
  console.log('UNHANDLED REJECTION! Shutting down..');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
