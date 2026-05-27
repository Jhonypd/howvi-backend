import type { Request } from "express";
import type { FiltroListagemUnidadeDTO } from "../db/unidade.js";

export type ListarUnidadesRequest = Request<
  never,
  never,
  never,
  FiltroListagemUnidadeDTO
>;
