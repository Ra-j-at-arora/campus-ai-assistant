import { Request, Response } from 'express';
import AnalyticsLog from '../models/AnalyticsLog';
import User from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * GET /api/v1/analytics/overview
 * Returns KPI numbers: Total Queries, Active Users, Success Rate, Avg Response Time, Most Used Service, etc.
 */
export const getOverview = asyncHandler(async (req: Request, res: Response) => {
  const totalQueries = await AnalyticsLog.countDocuments();
  
  const activeUsersData = await AnalyticsLog.distinct('userId');
  const activeUsers = activeUsersData.length;

  const successCount = await AnalyticsLog.countDocuments({ success: true });
  const successRate = totalQueries > 0 ? (successCount / totalQueries) * 100 : 100;

  const avgTimeResult = await AnalyticsLog.aggregate([
    { $group: { _id: null, avgTime: { $avg: '$responseTime' } } }
  ]);
  const avgResponseTime = avgTimeResult.length > 0 ? Math.round(avgTimeResult[0].avgTime) : 0;

  const topServiceResult = await AnalyticsLog.aggregate([
    { $group: { _id: '$serviceCategory', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]);
  const mostUsedService = topServiceResult.length > 0 ? topServiceResult[0]._id : 'None';

  // AI Specific metrics
  const toolFailureCount = await AnalyticsLog.countDocuments({ success: false });
  const toolFailureRate = totalQueries > 0 ? (toolFailureCount / totalQueries) * 100 : 0;

  const multiToolQueries = await AnalyticsLog.countDocuments({ 'toolsCalled.1': { $exists: true } });
  
  const topQuestions = await AnalyticsLog.aggregate([
    { $group: { _id: '$queryText', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalQueries,
      activeUsers,
      successRate: Math.round(successRate * 10) / 10,
      avgResponseTime,
      mostUsedService,
      toolFailureRate: Math.round(toolFailureRate * 10) / 10,
      multiToolQueries,
      topQuestions: topQuestions.map(q => ({ query: q._id, count: q.count })),
    }
  });
});

/**
 * GET /api/v1/analytics/charts/trends
 * Returns query counts per day
 */
export const getQueryTrends = asyncHandler(async (req: Request, res: Response) => {
  const trends = await AnalyticsLog.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
        queries: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const formattedTrends = trends.map(t => ({
    date: t._id,
    queries: t.queries
  }));

  res.status(200).json({ success: true, data: formattedTrends });
});

/**
 * GET /api/v1/analytics/charts/services
 * Returns service usage distribution
 */
export const getServiceDistribution = asyncHandler(async (req: Request, res: Response) => {
  const distribution = await AnalyticsLog.aggregate([
    { $group: { _id: '$serviceCategory', value: { $sum: 1 } } },
    { $sort: { value: -1 } }
  ]);

  const formattedDistribution = distribution.map(d => ({
    name: d._id,
    value: d.value
  }));

  res.status(200).json({ success: true, data: formattedDistribution });
});

/**
 * GET /api/v1/analytics/charts/intents
 * Returns intent distribution
 */
export const getIntentDistribution = asyncHandler(async (req: Request, res: Response) => {
  const distribution = await AnalyticsLog.aggregate([
    { $group: { _id: '$intent', value: { $sum: 1 } } },
    { $sort: { value: -1 } }
  ]);

  const formattedDistribution = distribution.map(d => ({
    name: d._id,
    value: d.value
  }));

  res.status(200).json({ success: true, data: formattedDistribution });
});

/**
 * GET /api/v1/analytics/explorer
 * Paginated query explorer
 */
export const getQueryExplorer = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string;

  let query: any = {};
  if (search) {
    query.queryText = { $regex: search, $options: 'i' };
  }

  const logs = await AnalyticsLog.find(query)
    .sort({ timestamp: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await AnalyticsLog.countDocuments(query);

  res.status(200).json({
    success: true,
    data: logs,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  });
});
