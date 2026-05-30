import {exec} from './../db.ts';

const reporterFeeByMinutes = 2000;

async function CalculateReporterFee(caseId: number) {
    const query = `
        SELECT duration FROM court_jobs.case
        WHERE id = ${caseId} AND status = 'new'
    `
    const res = await exec(query, null);
    if (res.rowCount == null || res.rowCount <= 0) {
        throw new Error('something went wrong');
    }

    const duration = res.rows[0].duration;
    return duration * reporterFeeByMinutes;
}

export {
    CalculateReporterFee
}