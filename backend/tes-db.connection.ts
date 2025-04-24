import { Client } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function testConnection() {
  try {
    await client.connect();
    console.log('✅ Koneksi ke database berhasil!');
  } catch (err) {
    console.error('❌ Error koneksi ke database:', (err as Error).message);
  } finally {
    await client.end();
  }
}

testConnection();
