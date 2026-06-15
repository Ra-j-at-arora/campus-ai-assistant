import { Request, Response } from 'express';
import { LibraryService } from '../services/LibraryService';
import { asyncHandler } from '../utils/asyncHandler';
import { z } from 'zod';

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  isbn: z.string().min(10).max(13),
  status: z.enum(['AVAILABLE', 'RESERVED', 'CHECKED_OUT']).optional(),
  locationCode: z.string().optional(),
  category: z.string().optional(),
});

export const searchBooks = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query.q as string;
  const category = req.query.category as string;
  const books = await LibraryService.searchBooks(query, category);
  res.status(200).json({ success: true, data: books });
});

export const getBookById = asyncHandler(async (req: Request, res: Response) => {
  const book = await LibraryService.getBookById(req.params.id as string);
  res.status(200).json({ success: true, data: book });
});

export const addBook = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = bookSchema.parse(req.body);
  const book = await LibraryService.addBook(validatedData);
  res.status(201).json({ success: true, data: book });
});

export const updateBook = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = bookSchema.partial().parse(req.body);
  const book = await LibraryService.updateBook(req.params.id as string, validatedData);
  res.status(200).json({ success: true, data: book });
});

export const deleteBook = asyncHandler(async (req: Request, res: Response) => {
  await LibraryService.deleteBook(req.params.id as string);
  res.status(200).json({ success: true, message: 'Book deleted successfully' });
});
