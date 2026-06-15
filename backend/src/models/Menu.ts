import mongoose, { Document, Schema } from 'mongoose';

export interface IMenuItem {
  name: string;
  isVeg: boolean;
  allergens: string[];
}

export interface IMenu extends Document {
  date: Date;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  items: IMenuItem[];
}

const MenuItemSchema = new Schema({
  name: { type: String, required: true },
  isVeg: { type: Boolean, required: true },
  allergens: [{ type: String }],
});

const MenuSchema: Schema = new Schema({
  date: { type: Date, required: true },
  mealType: { 
    type: String, 
    enum: ['BREAKFAST', 'LUNCH', 'DINNER'], 
    required: true 
  },
  items: {
    type: [MenuItemSchema],
    validate: {
      validator: function(v: IMenuItem[]) {
        return v.length > 0;
      },
      message: 'A menu must contain at least one item.'
    }
  }
});

MenuSchema.index({ date: 1, mealType: 1 }, { unique: true });

export default mongoose.model<IMenu>('Menu', MenuSchema);
