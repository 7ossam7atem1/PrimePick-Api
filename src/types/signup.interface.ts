import { Request } from 'express';

export interface SignupRequest extends Request {
  body: {
    name: string;
    email: string;
    password: string;
  };
}
