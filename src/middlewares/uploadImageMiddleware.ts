import multer, { Multer, FileFilterCallback } from 'multer';
import { Request } from 'express';
import ApiError from '../utils/apiError';

const multerOptions = (): Multer => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ): void => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new ApiError('Only Images allowed', 400) as any, false);
    }
  };

  return multer({ storage: multerStorage, fileFilter: multerFilter });
};

export const uploadSingleImage = (fieldName: string) =>
  multerOptions().single(fieldName);

export const uploadMixOfImages = (arrayOfFields: multer.Field[]) =>
  multerOptions().fields(arrayOfFields);
