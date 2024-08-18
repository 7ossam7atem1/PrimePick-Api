import asyncHandler from 'express-async-handler';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { Response, NextFunction } from 'express';
import { uploadMixOfImages } from '../middlewares/uploadImageMiddleware';
import { CustomRequest } from '../types/protection.interface';
import * as factory from './handlersFactory';
import Product from '../models/productModel';

export const uploadProductImages = uploadMixOfImages([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 5,
  },
]);

export const resizeProductImages = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.files && !Array.isArray(req.files)) {
      if (req.files.imageCover && req.files.imageCover[0]) {
        const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

        await sharp(req.files.imageCover[0].buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageCoverFileName}`);

        req.body.imageCover = imageCoverFileName;
      }

      if (req.files.images) {
        req.body.images = [];
        await Promise.all(
          req.files.images.map(async (img, index) => {
            const imageName = `product-${uuidv4()}-${Date.now()}-${
              index + 1
            }.jpeg`;

            await sharp(img.buffer)
              .resize(2000, 1333)
              .toFormat('jpeg')
              .jpeg({ quality: 95 })
              .toFile(`uploads/products/${imageName}`);

            req.body.images.push(imageName);
          })
        );
      }
    }

    next();
  }
);

export const getProducts = factory.getAll(Product, 'Products');

// @desc    Get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
export const getProduct = factory.getOne(Product, 'reviews');

// @desc    Create product
// @route   POST  /api/v1/products
// @access  Private
export const createProduct = factory.createOne(Product);

// @desc    Update specific product
// @route   PUT /api/v1/products/:id
// @access  Private
export const updateProduct = factory.updateOne(Product);

// @desc    Delete specific product
// @route   DELETE /api/v1/products/:id
// @access  Private
export const deleteProduct = factory.deleteOne(Product);
