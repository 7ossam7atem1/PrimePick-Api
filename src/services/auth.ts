import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import ApiError from '../utils/apiError';
import createToken from '../utils/createToken';
import User from '../models/usersModel';
import { IUser } from '../types/user.interface';
import { SignupRequest } from '../types/signup.interface';
import { loginRequest } from '../types/login.interface';
import { Response, NextFunction } from 'express';
import { JwtPayload } from '../types/protection.interface';
import { CustomRequest } from '../types/protection.interface';
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
    const token = createToken({ userId: user._id.toString() });
    const userResponse: Partial<IUser & { password?: string }> =
      user.toObject();
    if (userResponse.password) {
      delete userResponse.password;
    }
    res.status(200).json({ data: userResponse, token });
  }
);

export const protect = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return next(
        new ApiError(
          'You are not logged in, please log in to get access to this route',
          401
        )
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as JwtPayload;

    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return next(
        new ApiError(
          'The user that belongs to this token no longer exists',
          401
        )
      );
    }

    if (currentUser.passwordChangedAt) {
      const passChangedTimestamp = parseInt(
        (currentUser.passwordChangedAt.getTime() / 1000).toString(),
        10
      );

      if (passChangedTimestamp > decoded.iat) {
        return next(
          new ApiError(
            'User recently changed his password. please log in again.',
            401
          )
        );
      }
    }

    req.user = currentUser;
    next();
  }
);

export const allowedTo = (...roles: string[]) =>
  asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return next(
          new ApiError('You are not allowed to access this route', 403)
        );
      }
      next();
    }
  );
