import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  bookId: string;
  user: mongoose.Types.ObjectId;
  rating: number;
  text: string;
  upVotes: number;
  downVotes: number;
  createdAt: Date;
}

const ReviewSchema: Schema<IReview> = new Schema({
  bookId: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  upVotes: { type: Number, default: 0 },
  downVotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
