import slugify from 'slugify';
import { check, body, CustomValidator } from 'express-validator';
import { Request } from 'express';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

interface CustomRequest extends Request {
  body: {
    slug?: string;
    [key: string]: any;
  };
}

const setSlug: CustomValidator = (val, { req }) => {
  const customReq = req as CustomRequest;
  customReq.body.slug = slugify(val);
  return true;
};

export const getCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id format'),
  validatorMiddleware,
];

export const createCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('Category required')
    .isLength({ min: 3 })
    .withMessage('Too short category name')
    .isLength({ max: 32 })
    .withMessage('Too long category name')
    .custom(setSlug),
  validatorMiddleware,
];

export const updateCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id format'),
  body('name').optional().custom(setSlug),
  validatorMiddleware,
];

export const deleteCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id format'),
  validatorMiddleware,
];
