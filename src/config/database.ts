import postgres, { Sql } from "postgres";
import dotenv from "dotenv";

dotenv.config();

const sql: Sql = postgres(process.env.DATABASE_URL as string);

function timer(ms: number): Promise<void> {
  return new Promise((resolver) => setTimeout(resolver, ms));
}

export type HealthCheckBanco = {
  ok: number;
  horarioBanco: string;
  banco: string;
  versaoPostgres: string;
  tables: string;
};

export async function verificarConexaoBanco(): Promise<HealthCheckBanco> {
  const resultado = await sql<HealthCheckBanco[]>`
    SELECT
      1 AS ok,
      NOW()::text AS "horarioBanco",
      current_database() AS banco,
      version() AS "versaoPostgres",
      string_agg(table_name, ', ') AS tables
    FROM
      information_schema.tables
    WHERE
      table_schema = 'howvi'
  `;

  return resultado[0];
}

export async function verificarConexaoComRetry(
  tentativas = 5,
  intervaloMs = 60_000,
): Promise<HealthCheckBanco> {
  let ultimoErro: unknown;

  for (let tentativa = 1; tentativa <= tentativas; tentativa++) {
    try {
      return await verificarConexaoBanco();
    } catch (erro) {
      ultimoErro = erro;
      console.error(
        `[DB] Falha no health-check (tentativa ${tentativa}/${tentativas}).`,
      );

      if (tentativa < tentativas) {
        await timer(intervaloMs);
      }
    }
  }

  throw new Error("Falha no health-check do banco apos todas as tentativas.", {
    cause: ultimoErro instanceof Error ? ultimoErro : undefined,
  });
}

export default sql;
