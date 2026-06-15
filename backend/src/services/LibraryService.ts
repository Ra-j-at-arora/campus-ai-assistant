import Book, { IBook } from '../models/Book';
import { AppError } from '../core/errors/AppError';

export class LibraryService {
  static async searchBooks(query?: string, category?: string): Promise<IBook[]> {
    const filter: any = {};
    if (query) {
      filter.$text = { $search: query };
    }
    if (category) {
      filter.category = category;
    }
    return Book.find(filter);
  }

  static async getBookById(id: string): Promise<IBook> {
    const book = await Book.findById(id);
    if (!book) throw new AppError('Book not found', 404, 'BOOK_NOT_FOUND');
    return book;
  }

  static async addBook(data: Partial<IBook>): Promise<IBook> {
    return Book.create(data);
  }

  static async updateBook(id: string, data: Partial<IBook>): Promise<IBook> {
    const book = await Book.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!book) throw new AppError('Book not found', 404, 'BOOK_NOT_FOUND');
    return book;
  }

  static async deleteBook(id: string): Promise<void> {
    const result = await Book.findByIdAndDelete(id);
    if (!result) throw new AppError('Book not found', 404, 'BOOK_NOT_FOUND');
  }
}
