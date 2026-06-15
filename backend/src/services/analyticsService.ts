import AnalyticsLog from '../models/AnalyticsLog';

export class AnalyticsService {
  /**
   * Logs an AI interaction to the database asynchronously.
   * This is designed to be fire-and-forget so it doesn't block the API response.
   */
  static logInteraction(data: {
    userId: string;
    queryText: string;
    toolsCalled: string[];
    responseTime: number;
    success: boolean;
  }) {
    // Determine primary service category based on tools called
    let serviceCategory = 'General';
    let intent = 'conversation';

    if (data.toolsCalled.length > 0) {
      const toolNames = data.toolsCalled.join(',').toLowerCase();
      
      if (toolNames.includes('book') || toolNames.includes('library')) {
        serviceCategory = 'Library';
        intent = 'library_search';
      } else if (toolNames.includes('event')) {
        serviceCategory = 'Events';
        intent = 'event_search';
      } else if (toolNames.includes('menu') || toolNames.includes('cafeteria')) {
        serviceCategory = 'Cafeteria';
        intent = 'menu_lookup';
      } else if (toolNames.includes('academic') || toolNames.includes('resource') || toolNames.includes('deadline')) {
        serviceCategory = 'Academic';
        intent = 'academic_query';
      } else {
        serviceCategory = 'General';
        intent = 'general_tool_usage';
      }
    }

    // Fire and forget promise
    AnalyticsLog.create({
      ...data,
      serviceCategory,
      intent,
    }).catch(err => {
      console.error('Failed to save analytics log:', err);
    });
  }
}
