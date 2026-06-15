import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

import Book from '../models/Book';
import Event from '../models/Event';
import Menu from '../models/Menu';
import AcademicResource from '../models/AcademicResource';
import connectDB from '../config/db';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Connected to DB. Dropping existing collections...');
    
    await Book.deleteMany({});
    await Event.deleteMany({});
    await Menu.deleteMany({});
    await AcademicResource.deleteMany({});

    console.log('Seeding Books...');
    const books = [];
    const categories = ['Computer Science', 'Mathematics', 'Fiction', 'Physics', 'History'];
    const statuses = ['AVAILABLE', 'RESERVED', 'CHECKED_OUT'];
    for (let i = 0; i < 20; i++) {
      books.push({
        title: faker.commerce.productName(),
        author: faker.person.fullName(),
        isbn: faker.string.numeric(13),
        status: faker.helpers.arrayElement(statuses),
        locationCode: `A${faker.number.int({ min: 1, max: 9 })}-B${faker.number.int({ min: 1, max: 9 })}`,
        category: faker.helpers.arrayElement(categories),
      });
    }
    await Book.insertMany(books);

    console.log('Seeding Events...');
    const events = [];
    const eventCategories = ['WORKSHOP', 'SOCIAL', 'SPORTS', 'SEMINAR'];
    for (let i = 0; i < 15; i++) {
      const startTime = faker.date.soon({ days: 90 });
      const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
      events.push({
        title: faker.company.catchPhrase(),
        description: faker.lorem.paragraph(),
        organizer: faker.company.name() + ' Club',
        location: `Room ${faker.number.int({ min: 100, max: 500 })}`,
        startTime,
        endTime,
        category: faker.helpers.arrayElement(eventCategories),
        capacity: faker.number.int({ min: 20, max: 200 }),
      });
    }
    await Event.insertMany(events);

    console.log('Seeding Menus (30 days)...');
    const menus = [];
    const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER'];
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(currentDate.getDate() + i);

      for (const mealType of mealTypes) {
        menus.push({
          date: currentDate,
          mealType: mealType,
          items: [
            { name: faker.food.dish(), isVeg: faker.datatype.boolean(), allergens: ['Dairy'] },
            { name: faker.food.dish(), isVeg: true, allergens: [] },
            { name: faker.food.dish(), isVeg: faker.datatype.boolean(), allergens: ['Nuts', 'Gluten'] },
          ],
        });
      }
    }
    await Menu.insertMany(menus);

    console.log('Seeding Academic Resources...');
    const academicResources = [];
    const resourceTypes = ['EXAM', 'HOLIDAY', 'DEADLINE', 'NOTICE'];
    for (let i = 0; i < 20; i++) {
      academicResources.push({
        title: faker.lorem.words(3),
        type: faker.helpers.arrayElement(resourceTypes),
        date: faker.date.soon({ days: 120 }),
        description: faker.lorem.sentence(),
        term: 'Fall 2026',
      });
    }
    await AcademicResource.insertMany(academicResources);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
