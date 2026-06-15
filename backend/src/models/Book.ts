import mongoose, { Document, Schema } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  isbn: string;
  status: 'AVAILABLE' | 'RESERVED' | 'CHECKED_OUT';
  locationCode?: string;
  category?: string;
}

const BookSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 13,
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'RESERVED', 'CHECKED_OUT'],
    default: 'AVAILABLE',
  },
  locationCode: {
    type: String,
  },
  category: {
    type: String,
  },
});

BookSchema.index({ title: 'text', author: 'text' });
BookSchema.index({ isbn: 1 }, { unique: true });

export default mongoose.model<IBook>('Book', BookSchema);
