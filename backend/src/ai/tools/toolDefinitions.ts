import { Type, FunctionDeclaration } from '@google/genai';

export const toolDefinitions: FunctionDeclaration[] = [
  {
    name: 'searchBooks',
    description: 'Search the campus library for books by title, author, or category.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: {
          type: Type.STRING,
          description: 'Search query for book title or author',
        },
        category: {
          type: Type.STRING,
          description: 'Book category (e.g., Computer Science, Mathematics)',
        },
      },
    },
  },
  {
    name: 'listEvents',
    description: 'List or search for campus events. Can filter by date, category, or just get upcoming events.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        startDate: {
          type: Type.STRING,
          description: 'ISO 8601 string for start date filter',
        },
        endDate: {
          type: Type.STRING,
          description: 'ISO 8601 string for end date filter',
        },
        category: {
          type: Type.STRING,
          description: 'Event category (e.g., WORKSHOP, SPORTS)',
        },
        upcomingOnly: {
          type: Type.BOOLEAN,
          description: 'Set to true to only get upcoming events',
        },
      },
    },
  },
  {
    name: 'getDailyMenu',
    description: 'Get the cafeteria menu for a specific date.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        date: {
          type: Type.STRING,
          description: 'ISO 8601 string or "today" for the menu date',
        },
      },
      required: ['date'],
    },
  },
  {
    name: 'listAcademicResources',
    description: 'Get academic resources like exams, holidays, deadlines, or notices.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        type: {
          type: Type.STRING,
          description: 'Type of resource (EXAM, HOLIDAY, DEADLINE, NOTICE)',
        },
        term: {
          type: Type.STRING,
          description: 'Academic term (e.g., Fall 2026)',
        },
        upcomingOnly: {
          type: Type.BOOLEAN,
          description: 'Set to true to only get upcoming academic resources',
        },
      },
    },
  }
];
