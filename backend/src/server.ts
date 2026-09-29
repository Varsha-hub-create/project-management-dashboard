import dotenv from "dotenv";
import app from "./app";
import { pool } from "./config/database";

dotenv.config();

const PORT = Number(process.env.PORT ?? 5000);

async function start() {
  try {
    await pool.query("SELECT 1");

    app.listen(PORT, () => {
      console.log(`Project Management API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

start();
