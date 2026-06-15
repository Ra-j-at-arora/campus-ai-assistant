import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalyticsLog extends Document {
  userId: string;
  queryText: string;
  toolsCalled: string[];
  serviceCategory: string; // e.g., 'Library', 'Events', 'Cafeteria', 'Academic', 'General'
  responseTime: number; // in milliseconds
  success: boolean;
  intent: string;
  timestamp: Date;
}

const AnalyticsLogSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  queryText: {
    type: String,
    required: true,
  },
  toolsCalled: [{
    type: String,
  }],
  serviceCategory: {
    type: String,
    required: true,
    index: true,
  },
  responseTime: {
    type: Number,
    required: true,
  },
  success: {
    type: Boolean,
    required: true,
    index: true,
  },
  intent: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// 90-day TTL index on timestamp
// 90 days * 24 hours * 60 minutes * 60 seconds = 7776000 seconds
AnalyticsLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

export default mongoose.model<IAnalyticsLog>('AnalyticsLog', AnalyticsLogSchema);
