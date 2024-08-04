import { IUser } from '../types/user.interface';
import { Request } from 'express';
export interface JwtPayload {
  userId: string;
  iat: number;
}

export interface CustomRequest extends Request {
  user?: IUser;
  headers: {
    authorization?: string;
  };
}
