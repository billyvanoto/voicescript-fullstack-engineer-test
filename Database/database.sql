CREATE USER vc_user WITH PASSWORD 'password';
SELECT * FROM pg_catalog.pg_user;

CREATE DATABASE voicescript_db WITH owner vc_user;

CREATE SCHEMA court_jobs;

-- 1. Allow the user to see the schema
GRANT USAGE ON SCHEMA court_jobs TO vc_user;

-- 2. Allow modifying data in existing tables and sequences
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA court_jobs TO vc_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA court_jobs TO vc_user;

-- 3. Apply privileges to future tables and sequences automatically
ALTER DEFAULT PRIVILEGES IN SCHEMA court_jobs 
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO vc_user;

SELECT table_schema, table_name, privilege_type 
FROM information_schema.table_privileges 
WHERE grantee = 'vc_user';

CREATE TABLE court_jobs.case (
    id serial PRIMARY KEY,
    name varchar NOT NULL,
    duration int NOT NULL, -- in minutes
    location varchar NOT NULL, -- physical or remote
    status varchar NOT NULL -- NEW -> ASSIGNED -> TRANSCRIBED -> REVIEWED -> COMPLETED
);

CREATE TABLE court_jobs.reporter (
    id serial PRIMARY KEY,
    name varchar NOT NULL,
    location varchar NOT NULL
);

CREATE TABLE court_jobs.editor (
    id serial PRIMARY KEY,
    name varchar NOT NULL
);

CREATE TABLE court_jobs.assigned_case (
    id serial PRIMARY KEY,
    case_id int REFERENCES court_jobs.case(id),
    reporter_id int REFERENCES court_jobs.reporter(id),
    editor_id int REFERENCES court_jobs.editor(id),
    reporter_fee numeric(15,2),
    editor_fee numeric(15,2)
);