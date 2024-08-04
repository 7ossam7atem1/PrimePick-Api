import { Request } from 'express';

export interface loginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}
