import mongoose, { Document, Model, Schema } from 'mongoose';
import Product from './productModel';

export interface IReview extends Document {
  title?: string;
  ratings: number;
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
}

interface IReviewModel extends Model<IReview> {
  calcAverageRatingsAndQuantity(
    productId: mongoose.Types.ObjectId
  ): Promise<void>;
}

const reviewSchema = new Schema<IReview>(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, 'Min ratings value is 1.0'],
      max: [5, 'Max ratings value is 5.0'],
      required: [true, 'Review ratings required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to user'],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to product'],
    },
  },
  { timestamps: true }
);

reviewSchema.pre<IReview>('find', function (next) {
  this.populate({ path: 'user', select: 'name' });
  next();
});

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId: mongoose.Types.ObjectId
) {
  const result = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: 'product',
        avgRatings: { $avg: '$ratings' },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post('save', async function (this: IReview) {
  await (this.constructor as IReviewModel).calcAverageRatingsAndQuantity(
    this.product
  );
});

reviewSchema.post(
  'deleteOne',
  { document: true, query: false },
  async function (this: IReview) {
    await (this.constructor as IReviewModel).calcAverageRatingsAndQuantity(
      this.product
    );
  }
);
export default mongoose.model<IReview, IReviewModel>('Review', reviewSchema);
