import dotenv from "dotenv";

import app from "./app.js";
import { verificarConexaoComRetry } from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const INTERVALO_CHECK_MS = 30 * 60 * 1000;
const TENTATIVAS = 5;
const INTERVALO_RETRY_MS = 60 * 1000;
let healthCheckEmExecucao = false;

async function executarHealthCheckBanco(): Promise<void> {
  if (healthCheckEmExecucao) return;
  healthCheckEmExecucao = true;

  try {
    const retornoBanco = await verificarConexaoComRetry(
      TENTATIVAS,
      INTERVALO_RETRY_MS,
    );

    console.log("[DB] Health-check OK:", retornoBanco);
  } catch (erro) {
    console.error("[DB] Health-check falhou apos retries:", erro);
  } finally {
    healthCheckEmExecucao = false;
  }
}

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

void executarHealthCheckBanco();
setInterval(() => {
  void executarHealthCheckBanco();
}, INTERVALO_CHECK_MS);
