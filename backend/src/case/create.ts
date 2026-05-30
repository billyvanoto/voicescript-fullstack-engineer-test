import {exec} from './../db.ts';

interface courtCase {
    name: string,
    duration: number,
    location: string,
    status: string
};

async function CreateNewCase(data: courtCase) {
    if (data.name === "") {
        throw new Error('Name is required');
    }
    if (data.duration < 0) {
        throw new Error('Duration must bigger than 0');
    }
    if (data.location === "") {
        throw new Error('Location is required');
    }

    const query = `
        INSERT INTO court_jobs.case (name, duration, location, status)
        VALUES ($1, $2, $3, $4) RETURNING id;
    `
    const value = [data.name, data.duration, data.location, data.status];
    const res = await exec(query, value);
    
    return res.rows[0].id;
}

export {
    type courtCase,
    CreateNewCase
}