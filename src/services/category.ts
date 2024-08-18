import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';

import * as factory from './handlersFactory';
import { uploadSingleImage } from '../middlewares/uploadImageMiddleware';
import Category from '../models/categoryModel';

export const uploadCategoryImage = uploadSingleImage('image');

export const resizeImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

    if (req.file) {
      await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 95 })
        .toFile(`uploads/categories/${filename}`);

      req.body.image = filename;
    }

    next();
  }
);

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
export const getCategories = factory.getAll(Category);

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
export const getCategory = factory.getOne(Category);

// @desc    Create category
// @route   POST  /api/v1/categories
// @access  Private/Admin-Manager
export const createCategory = factory.createOne(Category);

// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin-Manager
export const updateCategory = factory.updateOne(Category);

// @desc    Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
export const deleteCategory = factory.deleteOne(Category);
