import type { Request, Response, NextFunction } from "express";

export function erroMiddleware(
  error: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(error);

  const statusCode = error?.statusCode ?? 500;
  const mensagem = error?.message ?? "Erro interno do servidor.";

  return res.status(statusCode).json({ mensagem });
}
