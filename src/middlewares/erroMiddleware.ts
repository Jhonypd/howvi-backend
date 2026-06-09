import type { Request, Response, NextFunction } from "express";
import { respostaErro } from "../types/response.js";

export function erroMiddleware(
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(error);

  const statusCode = error?.statusCode ?? 500;
  const mensagem = error?.message ?? "Erro interno do servidor.";
  const resultado = error?.detalhes ?? error?.resultado;

  return res.status(statusCode).json(
    respostaErro({
      mensagem,
      codigoHttp: statusCode,
      resultado,
    }),
  );
}
