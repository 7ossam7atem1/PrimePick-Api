import slugify from 'slugify';
import { check, body, Meta } from 'express-validator';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import Category from '../../models/categoryModel';
import SubCategory from '../../models/subCategoryModel';
import mongoose from 'mongoose';

export const createProductValidator = [
  check('title')
    .isLength({ min: 3 })
    .withMessage('must be at least 3 chars')
    .notEmpty()
    .withMessage('Product required')
    .custom((val: string, { req }: Meta) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('description')
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ max: 2000 })
    .withMessage('Too long description'),
  check('quantity')
    .notEmpty()
    .withMessage('Product quantity is required')
    .isNumeric()
    .withMessage('Product quantity must be a number'),
  check('sold')
    .optional()
    .isNumeric()
    .withMessage('Product quantity must be a number'),
  check('price')
    .notEmpty()
    .withMessage('Product price is required')
    .isNumeric()
    .withMessage('Product price must be a number')
    .isLength({ max: 32 })
    .withMessage('Too long price'),
  check('priceAfterDiscount')
    .optional()
    .isNumeric()
    .withMessage('Product priceAfterDiscount must be a number')
    .toFloat()
    .custom((value: number, { req }: Meta) => {
      if (req.body.price <= value) {
        throw new Error('priceAfterDiscount must be lower than price');
      }
      return true;
    }),
  check('colors')
    .optional()
    .isArray()
    .withMessage('availableColors should be array of string'),
  check('imageCover').notEmpty().withMessage('Product imageCover is required'),
  check('images')
    .optional()
    .isArray()
    .withMessage('images should be array of string'),
  check('category')
    .notEmpty()
    .withMessage('Product must belong to a category')
    .isMongoId()
    .withMessage('Invalid ID format')
    .custom(async (categoryId: string) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        return Promise.reject(
          new Error(`No category found for this id: ${categoryId}`)
        );
      }
    }),
  check('subcategories')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Subcategories must be an array of MongoDB IDs')
    .custom(async (subcategoriesIds: string[]) => {
      const result = await SubCategory.find({
        _id: { $exists: true, $in: subcategoriesIds },
      });
      if (result.length < 1 || result.length !== subcategoriesIds.length) {
        return Promise.reject(new Error('Invalid subcategories IDs'));
      }
    })
    .custom(async (val: string[], { req }: Meta) => {
      const subcategories = await SubCategory.find({
        category: req.body.category,
      });
      const subCategoriesIdsInDB = subcategories.map((subCategory) =>
        (subCategory._id as mongoose.Types.ObjectId).toString()
      );
      const checker = (target: string[], arr: string[]) =>
        target.every((v) => arr.includes(v));
      if (!checker(val, subCategoriesIdsInDB)) {
        return Promise.reject(
          new Error('Subcategories do not belong to the category')
        );
      }
    }),
  check('brand').optional().isMongoId().withMessage('Invalid ID format'),
  check('ratingsAverage')
    .optional()
    .isNumeric()
    .withMessage('ratingsAverage must be a number')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be between 1.0 and 5.0'),
  check('ratingsQuantity')
    .optional()
    .isNumeric()
    .withMessage('ratingsQuantity must be a number'),
  validatorMiddleware,
];

export const getProductValidator = [
  check('id').isMongoId().withMessage('Invalid ID format'),
  validatorMiddleware,
];

export const updateProductValidator = [
  check('id').isMongoId().withMessage('Invalid ID format'),
  body('title')
    .optional()
    .custom((val: string, { req }: Meta) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

export const deleteProductValidator = [
  check('id').isMongoId().withMessage('Invalid ID format'),
  validatorMiddleware,
];
