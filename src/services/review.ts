import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import Review from '../models/reviewModel';
import { IReview } from '../models/reviewModel'; 
import * as factory from './handlersFactory';

interface CustomRequest extends Request {
  filterObj?: Record<string, unknown>;
  user?: {
    _id: Types.ObjectId;
  };
}

// Nested route
// GET /api/v1/products/:productId/reviews
export const createFilterObj = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  let filterObject: Record<string, unknown> = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

// @desc    Get list of reviews
// @route   GET /api/v1/reviews
// @access  Public
export const getReviews = factory.getAll<IReview>(Review);

// @desc    Get specific review by id
// @route   GET /api/v1/reviews/:id
// @access  Public
export const getReview = factory.getOne<IReview>(Review);

// Nested route (Create)
export const setProductIdAndUserIdToBody = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user?._id;
  next();
};

// @desc    Create review
// @route   POST  /api/v1/reviews
// @access  Private/Protect/User
export const createReview = factory.createOne<IReview>(Review);

// @desc    Update specific review
// @route   PUT /api/v1/reviews/:id
// @access  Private/Protect/User
export const updateReview = factory.updateOne<IReview>(Review);

// @desc    Delete specific review
// @route   DELETE /api/v1/reviews/:id
// @access  Private/Protect/User-Admin-Manager
export const deleteReview = factory.deleteOne<IReview>(Review);
