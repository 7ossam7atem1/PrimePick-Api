import { check, Meta } from 'express-validator';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import Review from '../../models/reviewModel';
import { IUser } from '../../types/user.interface';
import { Request } from 'express';

interface CustomRequest extends Request {
  user?: IUser;
  filterObj?: any;
}

export const createReviewValidator = [
  check('title').optional(),
  check('ratings')
    .notEmpty()
    .withMessage('Ratings value required')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Ratings value must be between 1 to 5'),
  check('user').isMongoId().withMessage('Invalid Review id format'),
  check('product')
    .isMongoId()
    .withMessage('Invalid Review id format')
    .custom(async (val: string, { req }: Meta) => {
      const customReq = req as CustomRequest;

      const review = await Review.findOne({
        user: customReq.user!._id,
        product: customReq.body.product,
      });
      if (review) {
        return Promise.reject(new Error('You already created a review before'));
      }
      return true;
    }),
  validatorMiddleware,
];

export const getReviewValidator = [
  check('id').isMongoId().withMessage('Invalid Review id format'),
  validatorMiddleware,
];

export const updateReviewValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid Review id format')
    .custom(async (val: string, { req }: Meta) => {
      const customReq = req as CustomRequest;

      const review = await Review.findById(val);
      if (!review) {
        return Promise.reject(new Error(`There is no review with id ${val}`));
      }
      if (review.user._id.toString() !== customReq.user!._id.toString()) {
        return Promise.reject(
          new Error(`You are not allowed to perform this action`)
        );
      }
      return true;
    }),
  validatorMiddleware,
];

export const deleteReviewValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid Review id format')
    .custom(async (val: string, { req }: Meta) => {
      const customReq = req as CustomRequest;

      if (customReq.user!.role === 'user') {
        const review = await Review.findById(val);
        if (!review) {
          return Promise.reject(new Error(`There is no review with id ${val}`));
        }
        if (review.user._id.toString() !== customReq.user!._id.toString()) {
          return Promise.reject(
            new Error(`You are not allowed to perform this action`)
          );
        }
      }
      return true;
    }),
  validatorMiddleware,
];
