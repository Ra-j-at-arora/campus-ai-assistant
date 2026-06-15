import mongoose from 'mongoose';
import dotenv from 'dotenv';

import Book from '../models/Book';
import Event from '../models/Event';
import Menu from '../models/Menu';
import AcademicResource from '../models/AcademicResource';
import connectDB from '../config/db';

dotenv.config({ override: true });

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Connected to DB. Dropping existing collections...');
    
    await Book.deleteMany({});
    await Event.deleteMany({});
    await Menu.deleteMany({});
    await AcademicResource.deleteMany({});

    console.log('Seeding Highly Realistic Demo Books...');
    const books = [
      { title: 'Operating System Concepts', author: 'Abraham Silberschatz', category: 'Computer Science', status: 'AVAILABLE', locationCode: 'A1-B2', isbn: '9781118063330' },
      { title: 'Clean Code', author: 'Robert C. Martin', category: 'Computer Science', status: 'AVAILABLE', locationCode: 'A1-B3', isbn: '9780132350884' },
      { title: 'Computer Networks', author: 'Andrew S. Tanenbaum', category: 'Computer Science', status: 'CHECKED_OUT', locationCode: 'A2-B1', isbn: '9780132126953' },
      { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Computer Science', status: 'AVAILABLE', locationCode: 'A2-B2', isbn: '9780262033848' },
      { title: 'Design Patterns', author: 'Erich Gamma', category: 'Computer Science', status: 'RESERVED', locationCode: 'A3-B1', isbn: '9780201633610' },
      { title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell', category: 'Computer Science', status: 'AVAILABLE', locationCode: 'A3-B2', isbn: '9780134610993' },
      { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'Computer Science', status: 'AVAILABLE', locationCode: 'A4-B1', isbn: '9780201616224' },
      { title: 'Calculus, 9th Edition', author: 'James Stewart', category: 'Mathematics', status: 'AVAILABLE', locationCode: 'B1-C1', isbn: '9781337624183' },
      { title: 'Linear Algebra Done Right', author: 'Sheldon Axler', category: 'Mathematics', status: 'CHECKED_OUT', locationCode: 'B1-C2', isbn: '9783319110790' },
      { title: 'University Physics', author: 'Hugh D. Young', category: 'Physics', status: 'AVAILABLE', locationCode: 'C1-D1', isbn: '9780321973610' },
    ];
    await Book.insertMany(books);

    console.log('Seeding Highly Realistic Demo Events...');
    const today = new Date();
    
    // Helper to generate a date relative to today
    const getDateRelative = (daysOffset: number, hours: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() + daysOffset);
      d.setHours(hours, 0, 0, 0);
      return d;
    };

    const events = [
      { title: 'Coding Club Workshop: Intro to Next.js', description: 'Learn how to build full-stack React applications with Next.js 14 and Tailwind CSS.', organizer: 'Google Developer Student Club', location: 'Lab 3, Tech Building', startTime: getDateRelative(2, 14), endTime: getDateRelative(2, 16), category: 'WORKSHOP', capacity: 60 },
      { title: 'Campus Hackathon 2026', description: 'A 24-hour hackathon focused on AI and web development. Food and drinks provided!', organizer: 'Tech Council', location: 'Main Auditorium', startTime: getDateRelative(5, 10), endTime: getDateRelative(6, 10), category: 'SOCIAL', capacity: 200 },
      { title: 'Placement Talk: Microsoft', description: 'Pre-placement talk for final year students. Learn about the interview process and company culture.', organizer: 'Career Cell', location: 'Seminar Hall A', startTime: getDateRelative(3, 11), endTime: getDateRelative(3, 13), category: 'SEMINAR', capacity: 150 },
      { title: 'Annual Cultural Festival (Aura)', description: 'Music, dance, and art! Join us for the biggest cultural night of the semester.', organizer: 'Cultural Committee', location: 'Open Air Theatre', startTime: getDateRelative(10, 18), endTime: getDateRelative(10, 23), category: 'SOCIAL', capacity: 500 },
      { title: 'Inter-College Basketball Tournament', description: 'Cheer for our university team as they face off against regional rivals.', organizer: 'Sports Council', location: 'Indoor Stadium', startTime: getDateRelative(7, 9), endTime: getDateRelative(7, 18), category: 'SPORTS', capacity: 300 },
    ];
    await Event.insertMany(events);

    console.log('Seeding Highly Realistic Demo Menus...');
    const menus = [];
    // Just seed today, tomorrow, and day after tomorrow for the demo
    const menuDays = [0, 1, 2]; 

    const realisticMeals = {
      BREAKFAST: [
        { name: 'Masala Dosa & Sambar', isVeg: true, allergens: ['Dairy'] },
        { name: 'Aloo Paratha', isVeg: true, allergens: ['Gluten'] },
        { name: 'Omelette & Toast', isVeg: false, allergens: ['Eggs', 'Gluten'] }
      ],
      LUNCH: [
        { name: 'Paneer Butter Masala & Naan', isVeg: true, allergens: ['Dairy', 'Gluten'] },
        { name: 'Chicken Biryani', isVeg: false, allergens: [] },
        { name: 'Dal Makhani & Jeera Rice', isVeg: true, allergens: ['Dairy'] }
      ],
      DINNER: [
        { name: 'Mutton Curry & Tandoori Roti', isVeg: false, allergens: ['Gluten'] },
        { name: 'Veg Pulao & Raita', isVeg: true, allergens: ['Dairy'] },
        { name: 'Chana Masala', isVeg: true, allergens: [] }
      ]
    };

    for (const offset of menuDays) {
      const menuDate = new Date(today);
      menuDate.setDate(menuDate.getDate() + offset);
      menuDate.setUTCHours(0, 0, 0, 0);

      menus.push({ date: menuDate, mealType: 'BREAKFAST', items: realisticMeals.BREAKFAST });
      menus.push({ date: menuDate, mealType: 'LUNCH', items: realisticMeals.LUNCH });
      menus.push({ date: menuDate, mealType: 'DINNER', items: realisticMeals.DINNER });
    }
    await Menu.insertMany(menus);

    console.log('Seeding Highly Realistic Academic Resources...');
    const academicResources = [
      { title: 'Mid-Semester Examinations', type: 'EXAM', date: getDateRelative(15, 9), description: 'Mid-term exams for all undergraduate courses.', term: 'Fall 2026' },
      { title: 'End-Semester Examinations', type: 'EXAM', date: getDateRelative(60, 9), description: 'Final examinations for Fall 2026.', term: 'Fall 2026' },
      { title: 'Course Registration Deadline', type: 'DEADLINE', date: getDateRelative(5, 23), description: 'Last day to add or drop courses without penalty.', term: 'Fall 2026' },
      { title: 'Diwali Holiday', type: 'HOLIDAY', date: getDateRelative(20, 0), description: 'Campus closed for Diwali.', term: 'Fall 2026' },
      { title: 'Library Maintenance Notice', type: 'NOTICE', date: getDateRelative(1, 0), description: 'The central library will be closed from 10 AM to 2 PM for server maintenance.', term: 'Fall 2026' },
    ];
    await AcademicResource.insertMany(academicResources);

    console.log('Demo Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding demo database:', error);
    process.exit(1);
  }
};

seedDatabase();
