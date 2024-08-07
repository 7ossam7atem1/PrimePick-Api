import mongoose, { Document } from 'mongoose';
import { Address } from './address.interface';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  email: string;
  phone?: string;
  profileImg?: string;
  password: string;
  passwordChangedAt?: Date;
  passwordResetCode?: string;
  passwordResetExpires?: Date;
  passwordResetVerified?: boolean;
  role: 'user' | 'manager' | 'admin';
  active: boolean;
  wishlist?: mongoose.Types.ObjectId[];
  addresses?: Address[];
}
