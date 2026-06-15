import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  organizer: string;
  location: string;
  startTime: Date;
  endTime: Date;
  category: string;
  capacity?: number;
}

const EventSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  organizer: { type: String, required: true },
  location: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  category: { type: String, required: true },
  capacity: { type: Number },
});

// Custom validator to ensure endTime is after startTime
EventSchema.pre('validate', function() {
  if (this.startTime && this.endTime && this.endTime <= this.startTime) {
    throw new Error('endTime must be greater than startTime');
  }
});

EventSchema.index({ startTime: 1, category: 1 });

export default mongoose.model<IEvent>('Event', EventSchema);
