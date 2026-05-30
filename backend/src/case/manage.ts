import {exec} from './../db.ts';

interface ManageRequest {
    page: number,
    pagesize: number,
}

async function ManageCase(data: ManageRequest) {
    const query = `
        SELECT id, name, duration, location, status
        FROM court_jobs.case
        ORDER BY id DESC
        LIMIT $1 OFFSET $2
    `;
    const value = [data.pagesize, ((data.page-1)*data.pagesize) ];
    const response = await exec(query, value);
    return response.rows;
}

export {
    type ManageRequest,
    ManageCase
}