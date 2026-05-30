import {Router, type Request, type Response} from 'express'
import {ErrorHandling} from '../error.ts';
import {ManageJobAssigment, type ManageRequest} from '../job_assignment/manage.ts';

const JobAssignmentRoutes = Router();

JobAssignmentRoutes.get('/v1/assignedcase', async (req: Request, res: Response) => {
    const data:ManageRequest = {
        page: Number(req.query.page) || 1,
        pagesize: Number(req.query.pagesize) || 10,
    }
    try {
        const response = await ManageJobAssigment(data);
        res.status(200).json(response);
    } catch (error) {
        const err = ErrorHandling(error);
        res.status(err.status).json({message: err.errorMessage});
    }
});

export default JobAssignmentRoutes;