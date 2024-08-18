import { Request, Response, NextFunction } from 'express';
import * as factory from './handlersFactory';
import SubCategory from '../models/subCategoryModel';


interface CustomRequest extends Request {
  filterObj?: Record<string, any>;
}

// Set category ID in the request body for nested routes
export const setCategoryIdToBody = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// Create a filter object for nested routes
// GET /api/v1/categories/:categoryId/subcategories
export const createFilterObj = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const filterObject = req.params.categoryId
    ? { category: req.params.categoryId }
    : {};
  req.filterObj = filterObject;
  next();
};

// Get list of subcategories
// GET /api/v1/subcategories
// Public access
export const getSubCategories = factory.getAll(SubCategory);

// Get specific subcategory by id
// GET /api/v1/subcategories/:id
// Public access
export const getSubCategory = factory.getOne(SubCategory);

// Create subcategory
// POST /api/v1/subcategories
// Private access
export const createSubCategory = factory.createOne(SubCategory);

// Update specific subcategory
// PUT /api/v1/subcategories/:id
// Private access
export const updateSubCategory = factory.updateOne(SubCategory);

// Delete specific subcategory
// DELETE /api/v1/subcategories/:id
// Private access
export const deleteSubCategory = factory.deleteOne(SubCategory);
