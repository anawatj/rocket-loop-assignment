import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const DATABASE_URL = process.env.DATABASE_URL
 const connectionString = DATABASE_URL
const pool  = new Pool({
    max: 20,
    connectionString: connectionString,
    idleTimeoutMillis: 30000
});

export default  pool

