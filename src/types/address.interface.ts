import mongoose from 'mongoose';

export interface Address {
  id: mongoose.Types.ObjectId;
  alias: string;
  details: string;
  phone: string;
  city: string;
  postalCode: string;
}
