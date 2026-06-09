import type { NextFunction, Request, Response } from "express";
import { ComunicacaoService } from "../services/comunicacaoService.js";
import type { CriacaoComunicacaoDTO } from "../types/db/comunicacao.js";
import { respostaErro, respostaSucesso } from "../types/response.js";

const comunicacaoService = new ComunicacaoService();

export class ComunicacaoController {
  async criar(
    req: Request<{}, any, CriacaoComunicacaoDTO>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { titulo, descricaoDetalhada, emailComunicante, idUnidade } =
        req.body;

      const comunicacao = await comunicacaoService.criarComunicacao({
        titulo,
        descricaoDetalhada,
        emailComunicante,
        idUnidade,
      });

      if (!comunicacao) {
        return res.status(404).json(
          respostaErro({
            mensagem: "Unidade não encontrada.",
            codigoHttp: 404,
          }),
        );
      }

      return res.status(201).json(
        respostaSucesso({
          resultado: { id: comunicacao.id },
          mensagem: "Comunicação criada com sucesso.",
          codigoHttp: 201,
        }),
      );
    } catch (error) {
      return next(error);
    }
  }
}
