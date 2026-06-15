import { LibraryService } from '../services/LibraryService';
import { EventService } from '../services/EventService';
import { CafeteriaService } from '../services/CafeteriaService';
import { AcademicService } from '../services/AcademicService';

export const ServiceRegistry = {
  library: LibraryService,
  events: EventService,
  cafeteria: CafeteriaService,
  academics: AcademicService,
};
