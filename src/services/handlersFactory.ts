import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { Model, Document, PopulateOptions } from 'mongoose';
import ApiError from '../utils/apiError';
import ApiFeatures from '../utils/apiFeatures';

interface CustomRequest extends Request {
  filterObj?: Record<string, any>;
}

export const deleteOne = <T extends Document>(Model: Model<T>) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No document found with this id ${id}`, 404));
    }

    res.status(204).send();
  });

export const updateOne = <T extends Document>(Model: Model<T>) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      return next(
        new ApiError(`No document found with this id ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ data: document });
  });

export const createOne = <T extends Document>(Model: Model<T>) =>
  asyncHandler(async (req: Request, res: Response) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({ data: newDoc });
  });

export const getOne = <T extends Document>(
  Model: Model<T>,
  populationOpt?: string | PopulateOptions | (string | PopulateOptions)[]
) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    let query = Model.findById(id);
    if (populationOpt) {
      if (typeof populationOpt === 'string') {
        query = query.populate([populationOpt]);
      } else {
        query = query.populate(populationOpt);
      }
    }

    const document = await query;

    if (!document) {
      return next(new ApiError(`No document found with this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

export const getAll = <T extends Document>(
  Model: Model<T>,
  modelName: string = ''
) =>
  asyncHandler(async (req: CustomRequest, res: Response) => {
    let filter: Record<string, any> = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }

    const documentsCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCounts)
      .filter()
      .search(modelName)
      .limitFields()
      .sort();

    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res.status(200).json({
      results: documents.length,
      paginationResult,
      data: documents,
    });
  });
