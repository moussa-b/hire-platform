// Database connection and query helpers
import { Pool } from 'pg';

// Construct DATABASE_URL if not provided, using individual env vars as fallback
const getDatabaseUrl = (): string => {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '') {
    return process.env.DATABASE_URL;
  }
  
  // Fallback: construct from individual environment variables
  const user = process.env.POSTGRES_USER || 'hire_user';
  const password = String(process.env.POSTGRES_PASSWORD || 'hire_password');
  const host = process.env.POSTGRES_HOST || 'localhost';
  const port = process.env.POSTGRES_PORT || '5432';
  const database = process.env.POSTGRES_DB || 'hire_platform';
  
  // Ensure password is a string (not undefined/null)
  if (typeof password !== 'string') {
    throw new Error('Database password must be a string');
  }
  
  return `postgresql://${user}:${password}@${host}:${port}/${database}`;
};

const connectionString = getDatabaseUrl();

if (!connectionString) {
  throw new Error('DATABASE_URL or PostgreSQL connection details must be provided');
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test connection
pool.on('connect', () => {
  // Connected to database
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export async function query(text: string, params?: any[]) {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (error) {
    console.error('Database query error', { text, error });
    throw error;
  }
}

export async function getClient() {
  const client = await pool.connect();
  const originalQuery = client.query.bind(client);
  const release = client.release.bind(client);
  
  // Track the last query for debugging
  let lastQuery: any[] | null = null;
  
  // Set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
    if (lastQuery) {
      console.error(`The last executed query on this client was:`, lastQuery);
    }
  }, 5000);
  
  // Monkey patch the query method to log the last query
  client.query = (...args: any[]) => {
    lastQuery = args;
    return originalQuery(...args);
  };
  
  client.release = () => {
    clearTimeout(timeout);
    return release();
  };
  
  return client;
}

export default pool;

