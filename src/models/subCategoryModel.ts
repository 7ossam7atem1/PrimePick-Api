import { Schema, model, Document, Types } from 'mongoose';

interface ISubCategory extends Document {
  name: string;
  slug: string;
  category: Types.ObjectId;
}

const subCategorySchema = new Schema<ISubCategory>(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, 'SubCategory must be unique'] as unknown as boolean,
      minlength: [2, 'Too short SubCategory name'],
      maxlength: [32, 'Too long SubCategory name'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'SubCategory must belong to a parent category'],
    },
  },
  { timestamps: true }
);

export default model<ISubCategory>('SubCategory', subCategorySchema);
