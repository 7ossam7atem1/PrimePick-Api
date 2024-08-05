import { Request } from 'express';

export interface loginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export interface ForgotPasswordRequest extends Request {
  body: {
    email: string;
  };
}

export interface EmailOptions {
  email: string;
  subject: string;
  message?: string;
  template?: string;
  firstName?: string;
  url?: string;
}
