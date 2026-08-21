const { Pool } = require("pg");
require("dotenv").config();

// Supabase requires SSL. rejectUnauthorized:false is standard for Supabase's
// managed certs when not loading a custom CA bundle.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on("connect", () => {
  console.log("✅ Connected to Supabase PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected database error:", err.message);
});

module.exports = pool;
