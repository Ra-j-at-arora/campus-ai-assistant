import mongoose, { Document, Schema } from 'mongoose';

export interface IAcademicResource extends Document {
  title: string;
  type: 'EXAM' | 'HOLIDAY' | 'DEADLINE' | 'NOTICE';
  date: Date;
  description: string;
  term?: string;
}

const AcademicResourceSchema: Schema = new Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['EXAM', 'HOLIDAY', 'DEADLINE', 'NOTICE'], 
    required: true 
  },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  term: { type: String },
});

AcademicResourceSchema.index({ date: 1, type: 1 });

export default mongoose.model<IAcademicResource>('AcademicResource', AcademicResourceSchema);
