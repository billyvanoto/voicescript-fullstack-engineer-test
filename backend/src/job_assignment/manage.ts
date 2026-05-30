import {exec} from './../db.ts';

interface ManageRequest {
    page: number,
    pagesize: number,
}

async function ManageJobAssigment(data: ManageRequest) {
    const query = `
        SELECT 
            ac.id, c.id AS case_id, c.name AS case_name, c.duration AS case_duration,
            c.location AS case_location, c.status AS case_status,
            r.id AS reporter_id, r.name AS reporter_name,
            e.id AS editor_id, e.name AS editor_name,
            ac.reporter_fee, ac.editor_fee
        FROM court_jobs.assigned_case ac
            JOIN court_jobs.case c ON c.id = ac.case_id
            LEFT JOIN court_jobs.reporter r ON r.id = ac.reporter_id
            LEFT JOIN court_jobs.editor e ON e.id = ac.editor_id
        ORDER BY id DESC
        LIMIT $1 OFFSET $2
    `;
    const value = [data.pagesize, ((data.page-1)*data.pagesize) ];
    const response = await exec(query, value);
    
    const res = response.rows.map((v) => {
        let reporter = {};
        if (v.reporter_id) {
            reporter = {
                id: v.reporter_id,
                name: v.reporter_name,
            };
        }

        let editor = {};
        if (v.editor_id) {
            editor = {
                id: v.editor_id,
                name: v.editor_name,
            };
        }

        return {
            assignmentId: v.id,
            case: {
                id: v.case_id,
                name: v.case_name,
                duration: v.case_duration,
                location: v.case_location,
                status: v.case_status,
            },
            reporter: reporter,
            editor: editor,
            reporterFee: v.reporter_fee,
            editorFee: v.editor_fee,
        }
    });
    return res;
}

export {
    type ManageRequest,
    ManageJobAssigment
}