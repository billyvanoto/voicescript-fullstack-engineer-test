import {Router, type Request, type Response} from 'express'
import {ErrorHandling} from '../error.ts';
import {CreateNewCase, type courtCase} from '../case/create.ts';
import {AvailableCase, AssignCaseReporter, AssignCaseEditor, type AssignReporterRequest, type AssignEditorRequest} from '../case/assign.ts';
import { ManageCase, type ManageRequest } from '../case/manage.ts';
import {UpdateStatus, type UpdateStatusRequest} from '../case/update_status.ts'

const CaseRoutes = Router();

CaseRoutes.post('/v1/case', async (req: Request, res: Response) => {
    const data :courtCase = {
    name: req.body.name,
    duration: req.body.duration,
    location: req.body.location,
    status: 'new' // automatically set status to 'new' for newly created case
  };
  try {
    const response = await CreateNewCase(data);
    res.status(200).json({message: 'Succesfully created new case', id: response})
  } catch (error) {
    const err = ErrorHandling(error);
    res.status(err.status).json({message: err.errorMessage})
  }
});

CaseRoutes.get('/v1/case', async (req: Request, res: Response) => {
    const data:ManageRequest = {
        page: Number(req.query.page) || 1,
        pagesize: Number(req.query.pagesize) || 10,
    }
    try {
        const response = await ManageCase(data);
        res.status(200).json(response);
    } catch (error) {
        const err = ErrorHandling(error);
        res.status(err.status).json({message: err.errorMessage});
    }
});

CaseRoutes.get('/v1/case/available/reporter', async (req: Request, res: Response) => {
  const location = req.query.reporter_location as string;
  try {
    const response = await AvailableCase('reporter', location);
    res.status(200).json(response);
  } catch (error) {
    const err = ErrorHandling(error);
    res.status(err.status).json({message: err.errorMessage});
  }
});

CaseRoutes.get('/v1/case/available/editor', async (req: Request, res: Response) => {
  const location = req.query.reporter_location as string;
  try {
    const response = await AvailableCase('editor', location);
    res.status(200).json(response);
  } catch (error) {
    const err = ErrorHandling(error);
    res.status(err.status).json({message: err.errorMessage});
  }
});

CaseRoutes.post('/v1/case/assign/reporter', async (req: Request, res: Response) => {
  const data :AssignReporterRequest = {
    caseId: req.body.caseId,
    reporterId: req.body.reporterId,
  };
  try {
    const response = await AssignCaseReporter(data);
    res.status(200).json({message: 'Succesfully assign case', id: response});
  } catch (error) {
    const err = ErrorHandling(error);
    res.status(err.status).json({message: err.errorMessage});
  }
});

CaseRoutes.post('/v1/case/assign/editor', async (req: Request, res: Response) => {
  const data :AssignEditorRequest = {
    caseId: req.body.caseId,
    editorId: req.body.editorId,
  };
  try {
    const response = await AssignCaseEditor(data);
    res.status(200).json({message: 'Succesfully assign case', id: response});
  } catch (error) {
    const err = ErrorHandling(error);
    res.status(err.status).json({message: err.errorMessage});
  }
});

CaseRoutes.put('/v1/case/status', async (req: Request, res: Response) => {
  const data :UpdateStatusRequest = {
    caseId: req.body.caseId,
    status: req.body.status,
  };
  try {
    await UpdateStatus(data);
    res.status(200).json({message: 'Succesfully update case status'});
  } catch (error) {
    const err = ErrorHandling(error);
    res.status(err.status).json({message: err.errorMessage});
  }
})

export default CaseRoutes;