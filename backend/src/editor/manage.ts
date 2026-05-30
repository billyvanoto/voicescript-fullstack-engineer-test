import {exec} from './../db.ts';

interface ManageRequest {
    page: number,
    pagesize: number,
}

async function ManageEditor(data: ManageRequest) {
    const query = `
        SELECT e.id, e.name, COUNT(ac.id) FILTER (WHERE c.status != 'completed')  as total_assigned
        FROM court_jobs.editor e
            LEFT JOIN court_jobs.assigned_case ac ON ac.editor_id = e.id
            LEFT JOIN court_jobs.case c ON ac.case_id = c.id
        GROUP BY e.id
        ORDER BY id DESC
        LIMIT $1 OFFSET $2
    `;
    const value = [data.pagesize, ((data.page-1)*data.pagesize) ];
    const response = await exec(query, value);
    return response.rows.map((v) => {
        return {
            id: v.id,
            name: v.name,
            assignedCase: v.total_assigned,
        }
    });
}

export {
    type ManageRequest,
    ManageEditor
}