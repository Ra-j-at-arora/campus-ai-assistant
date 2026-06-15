import AcademicResource, { IAcademicResource } from '../models/AcademicResource';
import { AppError } from '../core/errors/AppError';

export class AcademicService {
  static async listResources(type?: string, term?: string): Promise<IAcademicResource[]> {
    const filter: any = {};
    if (type) filter.type = type;
    if (term) filter.term = term;

    return AcademicResource.find(filter).sort({ date: 1 });
  }

  static async getUpcomingResources(limit: number = 5): Promise<IAcademicResource[]> {
    return AcademicResource.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(limit);
  }

  static async createResource(data: Partial<IAcademicResource>): Promise<IAcademicResource> {
    return AcademicResource.create(data);
  }

  static async updateResource(id: string, data: Partial<IAcademicResource>): Promise<IAcademicResource> {
    const resource = await AcademicResource.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!resource) throw new AppError('Academic resource not found', 404, 'ACADEMIC_RESOURCE_NOT_FOUND');
    return resource;
  }

  static async deleteResource(id: string): Promise<void> {
    const result = await AcademicResource.findByIdAndDelete(id);
    if (!result) throw new AppError('Academic resource not found', 404, 'ACADEMIC_RESOURCE_NOT_FOUND');
  }
}
