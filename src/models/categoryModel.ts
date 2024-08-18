import mongoose, { Document, Schema } from 'mongoose';

interface ICategory extends Document {
  name: string;
  slug?: string;
  image?: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category required'],
      unique: true,
      minlength: [3, 'Too short category name'],
      maxlength: [32, 'Too long category name'],
    },

    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageURL = (doc: ICategory) => {
  if (doc.image) {
    const imageUrl = `${process.env.FRONTEND_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

categorySchema.post('init', (doc) => {
  setImageURL(doc as ICategory);
});

categorySchema.post('save', (doc) => {
  setImageURL(doc as ICategory);
});

const CategoryModel = mongoose.model<ICategory>('Category', categorySchema);

export default CategoryModel;
