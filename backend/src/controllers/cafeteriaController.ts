import { Request, Response } from 'express';
import { CafeteriaService } from '../services/CafeteriaService';
import { asyncHandler } from '../utils/asyncHandler';
import { z } from 'zod';

const menuItemSchema = z.object({
  name: z.string().min(1),
  isVeg: z.boolean(),
  allergens: z.array(z.string()),
});

const menuSchema = z.object({
  date: z.string().transform(str => new Date(str)),
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER']),
  items: z.array(menuItemSchema).min(1),
});

export const getDailyMenu = asyncHandler(async (req: Request, res: Response) => {
  const date = new Date();
  const menu = await CafeteriaService.getDailyMenu(date);
  res.status(200).json({ success: true, data: menu });
});

export const getMenuByDate = asyncHandler(async (req: Request, res: Response) => {
  const date = new Date(req.query.date as string);
  const menu = await CafeteriaService.getDailyMenu(date);
  res.status(200).json({ success: true, data: menu });
});

export const createMenu = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = menuSchema.parse(req.body);
  const menu = await CafeteriaService.createMenu(validatedData);
  res.status(201).json({ success: true, data: menu });
});

export const updateMenu = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = menuSchema.partial().parse(req.body);
  const menu = await CafeteriaService.updateMenu(req.params.id as string, validatedData);
  res.status(200).json({ success: true, data: menu });
});

export const deleteMenu = asyncHandler(async (req: Request, res: Response) => {
  await CafeteriaService.deleteMenu(req.params.id as string);
  res.status(200).json({ success: true, message: 'Menu deleted successfully' });
});
