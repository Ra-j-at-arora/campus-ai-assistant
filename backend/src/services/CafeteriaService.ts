import Menu, { IMenu } from '../models/Menu';
import { AppError } from '../core/errors/AppError';

export class CafeteriaService {
  /**
   * Normalizes a date to YYYY-MM-DD format strictly for midnight UTC
   */
  private static normalizeDate(date: Date | string): Date {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  static async getDailyMenu(dateInput: Date | string): Promise<IMenu[]> {
    const date = this.normalizeDate(dateInput);
    return Menu.find({ date });
  }

  static async createMenu(data: Partial<IMenu>): Promise<IMenu> {
    if (data.date) {
      data.date = this.normalizeDate(data.date);
    }
    return Menu.create(data);
  }

  static async updateMenu(id: string, data: Partial<IMenu>): Promise<IMenu> {
    if (data.date) {
      data.date = this.normalizeDate(data.date);
    }
    const menu = await Menu.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!menu) throw new AppError('Menu not found', 404, 'MENU_NOT_FOUND');
    return menu;
  }

  static async deleteMenu(id: string): Promise<void> {
    const result = await Menu.findByIdAndDelete(id);
    if (!result) throw new AppError('Menu not found', 404, 'MENU_NOT_FOUND');
  }
}
