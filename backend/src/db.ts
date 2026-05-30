/**
 * Database Configuration Module
 * 
 * This module sets up and manages a PostgreSQL connection pool using the `pg` library.
 * It leverages environment variables for secure configuration and includes an asynchronous
 * verification function to confirm connectivity at startup.
 */

import dotenv from 'dotenv';
import { text } from 'node:stream/consumers';
import { Pool } from 'pg';

// Load environment variables from .env file
const currentDir = import.meta.dirname;
dotenv.config({path: currentDir + `/../.env`});
// PostgreSQL connection pool configuration using environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});


/**
 * Asynchronously verifies the PostgreSQL connection.
 * Ensures that any issues are logged immediately at application startup.
*/
async function verifyConnection(): Promise<void> {
    try {
    // Attempt to acquire a client from the pool
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database');
    client.release(); // Release the client back to the pool
  } catch (error) {
    console.error('❌ Error connecting to the database:', error);
  }
}

// Immediately verify connection upon module load.
verifyConnection();

export const exec = async (text :string, params :any) => {
    const client = await pool.connect();
    try {
        const res = await client.query(text, params);
        return res;
    } catch (error) {
        throw new Error("something went wrong", {cause: error});
    } finally {
        client.release();
    }
}

export const transaction = async(arrQuery :string[]) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        for (const q in arrQuery) {
            if (!arrQuery[q]) {
                throw new Error("missing query")
            }
            await client.query(arrQuery[q]);
        }
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK')
        throw new Error("something went wrong", {cause: error});
    } finally {
        client.release();
    }
}

// Export the pool to be used across the application.
export default pool;