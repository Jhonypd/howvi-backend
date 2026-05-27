import type { Request, Response } from "express";
import { ComunicacaoService } from "../services/comunicacaoService.js";
import type { CriacaoComunicacaoDTO } from "../types/db/comunicacao.js";
import { respostaErro, respostaSucesso } from "../types/response.js";

const comunicacaoService = new ComunicacaoService();

export class ComunicacaoController {
  async criar(req: Request<{}, any, CriacaoComunicacaoDTO>, res: Response) {
    const { titulo, descricaoDetalhada, emailComunicante, idUnidade } =
      req.body;

    if (!titulo || !descricaoDetalhada || !emailComunicante || !idUnidade) {
      return res.status(400).json(
        respostaErro({
          mensagem:
            "titulo, descrição, email e id da unidade são obrigatórios.",
          codigoHttp: 400,
        }),
      );
    }

    const comunicacao = await comunicacaoService.criarComunicacao({
      titulo,
      descricaoDetalhada,
      emailComunicante,
      idUnidade,
    });

    if (!comunicacao) {
      return res
        .status(404)
        .json(
          respostaErro({
            mensagem: "Unidade não encontrada.",
            codigoHttp: 404,
          }),
        );
    }

    return res.status(201).json(
      respostaSucesso({
        resultado: comunicacao,
        mensagem: "Comunicação criada com sucesso.",
        codigoHttp: 201,
      }),
    );
  }
}
