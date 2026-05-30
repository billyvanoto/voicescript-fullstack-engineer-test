import {exec} from './../db.ts';

interface ManageRequest {
    page: number,
    pagesize: number,
}

async function ManageReporter(data: ManageRequest) {
    const query = `
        SELECT r.id, r.name, r.location, COUNT(ac.id) FILTER (WHERE c.status != 'completed') AS total_assigned
        FROM court_jobs.reporter r
            LEFT JOIN court_jobs.assigned_case ac ON ac.reporter_id = r.id
            LEFT JOIN court_jobs.case c ON ac.case_id = c.id
        GROUP BY r.id
        ORDER BY id DESC
        LIMIT $1 OFFSET $2
    `;
    const value = [data.pagesize, ((data.page-1)*data.pagesize) ];
    const response = await exec(query, value);
    return response.rows.map((v) => {
        return {
            id: v.id,
            name: v.name,
            location: v.location,
            assignedCase: v.total_assigned,
        }
    });
}

export {
    type ManageRequest,
    ManageReporter
}