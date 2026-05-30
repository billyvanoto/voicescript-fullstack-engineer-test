import {Router} from 'express';
import CaseRoutes from './case.ts';
import ReporterRoutes from './reporter.ts';
import EditorRoutes from './editor.ts';
import JobAssignmentRoutes from './job_assignment.ts';

const routes = Router();

routes.use(CaseRoutes);
routes.use(ReporterRoutes);
routes.use(EditorRoutes);
routes.use(JobAssignmentRoutes);

export default routes;