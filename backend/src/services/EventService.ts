import Event, { IEvent } from '../models/Event';
import { AppError } from '../core/errors/AppError';

export class EventService {
  static async listEvents(startDate?: Date, endDate?: Date, category?: string): Promise<IEvent[]> {
    const filter: any = {};
    if (startDate || endDate) {
      filter.startTime = {};
      if (startDate) filter.startTime.$gte = startDate;
      if (endDate) filter.startTime.$lte = endDate;
    }
    if (category) filter.category = category;

    return Event.find(filter).sort({ startTime: 1 });
  }

  static async getUpcomingEvents(limit: number = 5): Promise<IEvent[]> {
    return Event.find({ startTime: { $gte: new Date() } })
      .sort({ startTime: 1 })
      .limit(limit);
  }

  static async getEventById(id: string): Promise<IEvent> {
    const event = await Event.findById(id);
    if (!event) throw new AppError('Event not found', 404, 'EVENT_NOT_FOUND');
    return event;
  }

  static async createEvent(data: Partial<IEvent>): Promise<IEvent> {
    return Event.create(data);
  }

  static async updateEvent(id: string, data: Partial<IEvent>): Promise<IEvent> {
    const event = await Event.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!event) throw new AppError('Event not found', 404, 'EVENT_NOT_FOUND');
    return event;
  }

  static async deleteEvent(id: string): Promise<void> {
    const result = await Event.findByIdAndDelete(id);
    if (!result) throw new AppError('Event not found', 404, 'EVENT_NOT_FOUND');
  }
}
