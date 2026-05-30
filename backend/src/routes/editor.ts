import {Router, type Request, type Response} from 'express'
import {ErrorHandling} from '../error.ts';
import {ManageEditor, type ManageRequest} from '../editor/manage.ts';

const EditorRoutes = Router();

EditorRoutes.get('/v1/editor', async (req: Request, res: Response) => {
    const data:ManageRequest = {
        page: Number(req.query.page) || 1,
        pagesize: Number(req.query.pagesize) || 10,
    }
    try {
        const response = await ManageEditor(data);
        res.status(200).json(response);
    } catch (error) {
        const err = ErrorHandling(error);
        res.status(err.status).json({message: err.errorMessage});
    }
});

export default EditorRoutes;