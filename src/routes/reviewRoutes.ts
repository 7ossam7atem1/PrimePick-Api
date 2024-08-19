import express from 'express';
import {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
} from '../utils/validators/reviewValidator';
import {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  createFilterObj,
  setProductIdAndUserIdToBody,
} from '../services/review';
import { protect, allowedTo } from '../services/auth';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(createFilterObj, getReviews)
  .post(
    protect,
    allowedTo('user'),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview
  );

router
  .route('/:id')
  .get(getReviewValidator, getReview)
  .put(protect, allowedTo('user'), updateReviewValidator, updateReview)
  .delete(
    protect,
    allowedTo('user', 'manager', 'admin'),
    deleteReviewValidator,
    deleteReview
  );

export default router;
