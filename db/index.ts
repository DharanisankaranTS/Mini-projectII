import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import ws from 'ws';
import * as schema from "@shared/schema";

// Set the WebSocket implementation for Neon
neonConfig.webSocketConstructor = ws;

// Debug information
console.log("Connecting to database with URL starting with:", process.env.DATABASE_URL?.substring(0, 35) + "...");

// Use the DATABASE_URL environment variable with direct password for testing
const sql = neon(process.env.DATABASE_URL!);

// Create the drizzle client
export const db = drizzle(sql, { schema });