import postgres, { Sql } from "postgres";
import dotenv from "dotenv";

dotenv.config();

const sql: Sql = postgres(process.env.DATABASE_URL as string);

export default sql;
