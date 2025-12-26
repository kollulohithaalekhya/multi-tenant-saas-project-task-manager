import fs from "fs";
import path from "path";
import pool from "../config/db.js";

const __dirname = new URL(".", import.meta.url).pathname;

export async function initDb() {
  try {
    console.log(" Running migrations...");

    const migrationsDir = path.resolve(__dirname, "../../migrations");
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter(f => f.endsWith(".sql"))
      .sort();

    for (const file of migrationFiles) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
      await pool.query(sql);
      console.log(` Migration applied: ${file}`);
    }

    console.log("🌱 Running seeds...");
    const seedSql = fs.readFileSync(
      path.resolve(__dirname, "../../seeds/seed_data.sql"),
      "utf8"
    );
    await pool.query(seedSql);

    console.log(" Database initialized");
  } catch (err) {
    console.error(" DB init failed", err);
    process.exit(1);
  }
}
