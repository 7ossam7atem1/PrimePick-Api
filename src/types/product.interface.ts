import mongoose, { Document } from 'mongoose';
import { Request } from 'express';

export interface IProduct extends Document {
  title: string;
  slug: string;
  description: string;
  quantity: number;
  sold: number;
  price: number;
  priceAfterDiscount?: number;
  colors?: string[];
  imageCover: string;
  images?: string[];
  category: mongoose.Schema.Types.ObjectId;
  subcategories?: mongoose.Schema.Types.ObjectId[];
  brand?: mongoose.Schema.Types.ObjectId;
  ratingsAverage?: number;
  ratingsQuantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MulterFile {
  buffer: Buffer;
}


interface CustomFiles {
  [fieldname: string]: Express.Multer.File[]; 
}


interface CustomRequest extends Request {
  files: CustomFiles;
  body: {
    imageCover?: string;
    images?: string[];
  };
}
