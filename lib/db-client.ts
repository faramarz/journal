import postgres from 'postgres'

// Creating the PostgreSQL client with specific options to handle connectivity
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in environment variables')
}

// Create the client
const sql = postgres(connectionString, {
  ssl: true, // Use SSL for secure connections
  connect_timeout: 10, // 10 second connection timeout
  ssl_reject_unauthorized: false, // Allow self-signed certificates
  types: {
    // Define custom types if needed
  },
  connection: {
    // Force IPv4
    family: 4
  }
})

export default sql 