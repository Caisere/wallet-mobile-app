import { neon } from "@neondatabase/serverless";
import "dotenv/config";

const DB_URL = process.env.DATABASE_URL;

if (!DB_URL) {
  console.log("can't find the Database URL");
}

// create a sqp connection using DB connection
export const sql = neon(DB_URL);
