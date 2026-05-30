import {exec, transaction} from './../db.ts';
import {CalculateReporterFee} from './fee_calculation.ts';

const editorFee = 200000;
interface AssignReporterRequest {
    caseId: number,
    reporterId: number,
}

interface AssignEditorRequest {
    caseId: number,
    editorId: number,
}

async function AvailableCase(actor:string, location: string) {
    let query = `
        SELECT c.id, c.name, c.duration, c.location, c.status
        FROM court_jobs.case c
            LEFT JOIN court_jobs.assigned_case ac ON ac.case_id = c.id
    `;
    const whereCondition = [];
    switch (actor) {
        case 'reporter':
            if (location && location != "") {
                whereCondition.push(`location = ANY(ARRAY['${location}', 'remote']) AND status = 'new'`)
            } else {
                whereCondition.push(`location = ANY(ARRAY['remote']) AND status = 'new'`)
            }
            whereCondition.push(`ac.reporter_id IS NULL`);
            break;
    
        case 'editor':
            whereCondition.push(`status = 'transcribed'`);
            whereCondition.push(`ac.editor_id IS NULL`);
            break;
        default:
            return [];
    }
    if (whereCondition.length > 0) {
        query = `${query} WHERE ${whereCondition.join(" AND ")}`
    }
    query = `${query} ORDER BY id ASC`
    console.log(query);
    const response = await exec(query, null);
    return response.rows;
}

async function AssignCaseReporter(data: AssignReporterRequest) {
    const reporterFee = await CalculateReporterFee(data.caseId);
    if (reporterFee <= 0) {
        throw new Error('invalid case');
    }
    const arrQuery = [
        `
            INSERT INTO court_jobs.assigned_case (
                case_id, reporter_id, reporter_fee
            ) VALUES (
                ${data.caseId}, ${data.reporterId}, ${reporterFee}
            )
        `,
        `
            UPDATE court_jobs.case SET status = 'assigned'
            WHERE id = ${data.caseId}
        `
    ];
    const response = await transaction(arrQuery);
    return response;
}

async function AssignCaseEditor(data: AssignEditorRequest) {
    const query = `
        SELECT duration FROM court_jobs.case
        WHERE id = ${data.caseId} AND status = 'transcribed'
    `
    const res = await exec(query, null);
    if (res.rowCount == null || res.rowCount <= 0) {
        throw new Error('invalid case');
    }
    const arrQuery = [
        `
            UPDATE court_jobs.assigned_case SET
                editor_id = ${data.editorId}, editor_fee = ${editorFee}
            WHERE case_id = ${data.caseId}
        `,
        `
            UPDATE court_jobs.case SET status = 'transcribed'
            WHERE id = ${data.caseId}
        `
    ];
    const response = await transaction(arrQuery);
    return response;
}

export {
    type AssignReporterRequest,
    type AssignEditorRequest,
    AvailableCase,
    AssignCaseReporter,
    AssignCaseEditor
}