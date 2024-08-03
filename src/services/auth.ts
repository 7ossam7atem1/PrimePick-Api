import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import ApiError from '../utils/apiError';
import createToken from '../utils/createToken';
import User from '../models/usersModel';
import { SignupRequest } from '../types/signup.interface';
import { Response, NextFunction } from 'express';
import { IUser } from '../types/user.interface';
import mongoose from 'mongoose';
export const signup = asyncHandler(
  async (req: SignupRequest, res: Response, next: NextFunction) => {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    if (!user || !user._id) {
      return next(new ApiError('User creation failed', 500));
    }

    const token = createToken({ userId: user._id.toString() });

    res.status(201).json({
      data: user,
      token,
    });
  }
);
