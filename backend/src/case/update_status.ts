import {exec} from './../db.ts';

interface UpdateStatusRequest {
    caseId: number,
    status: string
}

async function UpdateStatus(data:UpdateStatusRequest) {
    if (data.status === "") {
        throw new Error('Status is required');
    }
   
    const query = `
        UPDATE court_jobs.case SET status = $1
        WHERE id = $2;
    `
    const value = [data.status, data.caseId];
    const res = await exec(query, value);
    if (res.rowCount == null || res.rowCount == 0) {
        throw new Error('something went wrong');
    }
    return;
}

export {
    type UpdateStatusRequest,
    UpdateStatus
}