import { ServiceRegistry } from '../../registry/ServiceRegistry';

export class ToolExecutor {
  /**
   * Executes a tool request from Gemini by routing it to the appropriate ServiceRegistry method.
   */
  static async execute(name: string, args: Record<string, any>): Promise<any> {
    try {
      switch (name) {
        case 'searchBooks':
          return await ServiceRegistry.library.searchBooks(args.query, args.category);
        
        case 'listEvents':
          if (args.upcomingOnly) {
            return await ServiceRegistry.events.getUpcomingEvents();
          }
          const start = args.startDate ? new Date(args.startDate) : undefined;
          const end = args.endDate ? new Date(args.endDate) : undefined;
          return await ServiceRegistry.events.listEvents(start, end, args.category);

        case 'getDailyMenu':
          const date = args.date === 'today' ? new Date() : new Date(args.date);
          return await ServiceRegistry.cafeteria.getDailyMenu(date);

        case 'listAcademicResources':
          if (args.upcomingOnly) {
            return await ServiceRegistry.academics.getUpcomingResources();
          }
          return await ServiceRegistry.academics.listResources(args.type, args.term);

        default:
          return { error: `Unknown tool: ${name}` };
      }
    } catch (error: any) {
      console.error(`Error executing tool ${name}:`, error);
      return { error: error.message || 'Service unavailable' };
    }
  }

  /**
   * Executes multiple tools in parallel (if Gemini returns multiple function calls).
   */
  static async executeAll(toolCalls: { name: string; args: Record<string, any> }[]): Promise<any[]> {
    const promises = toolCalls.map(tc => this.execute(tc.name, tc.args));
    return Promise.all(promises);
  }
}
