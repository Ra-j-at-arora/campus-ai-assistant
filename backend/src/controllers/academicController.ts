import { Request, Response } from 'express';
import { AcademicService } from '../services/AcademicService';
import { asyncHandler } from '../utils/asyncHandler';
import { z } from 'zod';

const academicResourceSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['EXAM', 'HOLIDAY', 'DEADLINE', 'NOTICE']),
  date: z.string().transform(str => new Date(str)),
  description: z.string().min(1),
  term: z.string().optional(),
});

export const listResources = asyncHandler(async (req: Request, res: Response) => {
  const type = req.query.type as string;
  const term = req.query.term as string;
  const resources = await AcademicService.listResources(type, term);
  res.status(200).json({ success: true, data: resources });
});

export const getUpcomingResources = asyncHandler(async (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
  const resources = await AcademicService.getUpcomingResources(limit);
  res.status(200).json({ success: true, data: resources });
});

export const createResource = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = academicResourceSchema.parse(req.body);
  const resource = await AcademicService.createResource(validatedData);
  res.status(201).json({ success: true, data: resource });
});

export const updateResource = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = academicResourceSchema.partial().parse(req.body);
  const resource = await AcademicService.updateResource(req.params.id as string, validatedData);
  res.status(200).json({ success: true, data: resource });
});

export const deleteResource = asyncHandler(async (req: Request, res: Response) => {
  await AcademicService.deleteResource(req.params.id as string);
  res.status(200).json({ success: true, message: 'Academic resource deleted successfully' });
});
