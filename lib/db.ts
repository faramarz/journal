import postgres from 'postgres'

// This is the format you requested in your original query
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not defined')
}

const sql = postgres(connectionString, {
  ssl: { rejectUnauthorized: false }
})

export default sql 