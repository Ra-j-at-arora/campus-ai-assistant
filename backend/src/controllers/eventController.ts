import { Request, Response } from 'express';
import { EventService } from '../services/EventService';
import { asyncHandler } from '../utils/asyncHandler';
import { z } from 'zod';

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  organizer: z.string().min(1),
  location: z.string().min(1),
  startTime: z.string().transform(str => new Date(str)),
  endTime: z.string().transform(str => new Date(str)),
  category: z.string().min(1),
  capacity: z.number().optional(),
});

export const listEvents = asyncHandler(async (req: Request, res: Response) => {
  const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
  const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
  const category = req.query.category as string;
  
  const events = await EventService.listEvents(startDate, endDate, category);
  res.status(200).json({ success: true, data: events });
});

export const getUpcomingEvents = asyncHandler(async (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
  const events = await EventService.getUpcomingEvents(limit);
  res.status(200).json({ success: true, data: events });
});

export const getEventById = asyncHandler(async (req: Request, res: Response) => {
  const event = await EventService.getEventById(req.params.id as string);
  res.status(200).json({ success: true, data: event });
});

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = eventSchema.parse(req.body);
  const event = await EventService.createEvent(validatedData);
  res.status(201).json({ success: true, data: event });
});

export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = eventSchema.partial().parse(req.body);
  const event = await EventService.updateEvent(req.params.id as string, validatedData);
  res.status(200).json({ success: true, data: event });
});

export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  await EventService.deleteEvent(req.params.id as string);
  res.status(200).json({ success: true, message: 'Event deleted successfully' });
});
