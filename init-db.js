const { Pool } = require('pg');

// Create a connection pool
const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: {
    rejectUnauthorized: false // Allow self-signed certificates
  }
});

async function initializeDatabase() {
  try {
    console.log('Creating tables...');
    
    // Begin transaction
    await pool.query('BEGIN');
    
    // Create donors table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS donors (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        blood_type TEXT NOT NULL,
        organ_type TEXT NOT NULL,
        medical_history TEXT,
        location TEXT,
        contact_info TEXT,
        wallet_address TEXT,
        encrypted_medical_data TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create recipients table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS recipients (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        blood_type TEXT NOT NULL,
        organ_needed TEXT NOT NULL,
        urgency_level INTEGER NOT NULL,
        medical_history TEXT,
        location TEXT,
        contact_info TEXT,
        wallet_address TEXT,
        encrypted_medical_data TEXT,
        status TEXT DEFAULT 'waiting',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create matches table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        donor_id INTEGER REFERENCES donors(id),
        recipient_id INTEGER REFERENCES recipients(id),
        organ_type TEXT NOT NULL,
        compatibility_score NUMERIC(5,2) NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        approved_at TIMESTAMP,
        approved_by TEXT,
        completed_at TIMESTAMP,
        outcome TEXT
      )
    `);
    
    // Create transactions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        tx_hash TEXT,
        type TEXT NOT NULL,
        details JSONB,
        status TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create admins table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        email TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create ai_models table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ai_models (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        version TEXT NOT NULL,
        accuracy NUMERIC(5,2),
        last_trained TIMESTAMP,
        model_data JSONB
      )
    `);
    
    // Create statistics table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS statistics (
        id SERIAL PRIMARY KEY,
        total_donors INTEGER DEFAULT 0,
        total_recipients INTEGER DEFAULT 0,
        successful_matches INTEGER DEFAULT 0,
        pending_matches INTEGER DEFAULT 0,
        average_match_score NUMERIC(5,2),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Commit transaction
    await pool.query('COMMIT');
    
    console.log('Database initialized successfully');
  } catch (error) {
    // Rollback transaction on error
    await pool.query('ROLLBACK');
    console.error('Error initializing database:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the initialization
initializeDatabase();