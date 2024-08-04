import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import ApiError from '../utils/apiError';
import createToken from '../utils/createToken';
import User from '../models/usersModel';
import { SignupRequest } from '../types/signup.interface';
import { loginRequest } from '../types/login.interface';
import { Response, NextFunction } from 'express';

export const signup = asyncHandler(
  async (req: SignupRequest, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError('Email already in use!', 400));
    }
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

export const login = asyncHandler(
  async (req: loginRequest, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email }).select(
      '+password'
    );

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return next(new ApiError('Incorrect email or password', 401));
    }
    if (!user || !user._id) {
      return next(new ApiError(`User doesn't exist`, 500));
    }
    // 3) Generate token
    const token = createToken({ userId: user._id.toString() });

    res.status(200).json({ data: user, token });
  }
);
