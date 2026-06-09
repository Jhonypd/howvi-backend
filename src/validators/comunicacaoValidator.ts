import { CriacaoComunicacaoDTO } from "../types/db/comunicacao.js";

export class ValidacaoComunicacaoError extends Error {
  statusCode: number;
  detalhes: string[];

  constructor(detalhes: string[]) {
    super("Dados inválidos para criação da comunicação.");
    this.name = "ValidacaoComunicacaoError";
    this.statusCode = 400;
    this.detalhes = detalhes;
  }
}

export function validarCriacaoComunicacao(dados: CriacaoComunicacaoDTO): void {
  const erros: string[] = [];

  const { titulo, descricaoDetalhada, emailComunicante, idUnidade } = dados;

  if (!titulo?.trim()) {
    erros.push("Título é obrigatório.");
  }

  if (titulo?.trim() && titulo.trim().length < 5) {
    erros.push("Título deve ter pelo menos 5 caracteres.");
  }

  if (!descricaoDetalhada?.trim() || descricaoDetalhada.trim().length < 10) {
    erros.push("Descrição deve ter pelo menos 10 caracteres.");
  }

  if (!descricaoDetalhada?.trim()) {
    erros.push("Descrição é obrigatória.");
  }

  if (!emailComunicante?.trim()) {
    erros.push("E-mail é obrigatório.");
  }

  if (
    !emailComunicante?.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailComunicante)
  ) {
    erros.push("E-mail inválido.");
  }

  if (!idUnidade) {
    erros.push("Id da unidade é obrigatório.");
  }

  if (erros.length > 0) {
    throw new ValidacaoComunicacaoError(erros);
  }
}
