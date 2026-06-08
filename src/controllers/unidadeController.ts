import type { Request, Response } from "express";
import { UnidadeService } from "../services/unidadeService.js";
import { ComunicacaoService } from "../services/comunicacaoService.js";
import {
  ApiResponse,
  respostaErro,
  respostaSucesso,
} from "../types/response.js";
import { ComunicacaoDTO } from "../types/db/comunicacao.js";
import { UnidadeDTO, UnidadeListagemDTO } from "../types/db/unidade.js";
import type { FiltroListagemUnidadeDTO } from "../types/db/unidade.js";

const unidadeService = new UnidadeService();
const comunicacaoService = new ComunicacaoService();

export class UnidadeController {
  async listar(
    req: Request,
    res: Response<ApiResponse<{ unidades: UnidadeListagemDTO[] }>>,
  ) {
    const { nome, cidade, estado } =
      req.query as Partial<FiltroListagemUnidadeDTO>;
    const unidades = await unidadeService.listarUnidades({
      nome,
      cidade,
      estado,
    });
    return res.status(200).json(
      respostaSucesso({
        resultado: {
          unidades: unidades.map((unidade) => ({
            id: unidade.id,
            nome: unidade.nome,
            descricao: unidade.descricao,
            dataCriacao: unidade.dataCriacao,
            imagem: unidade.imagem,
            instituicao: {
              id: unidade.instituicao.id,
              nome: unidade.instituicao.nome,
            },
            municipios: unidade.municipios.map((municipio) => ({
              id: municipio.id,
              nome: municipio.nome,
              estado: municipio.estado,
            })),
          })),
        },
      }),
    );
  }

  async buscarPorId(
    req: Request<{ id: string }>,
    res: Response<ApiResponse<{ unidade: UnidadeDTO }>>,
  ) {
    const { id } = req.params;
    const unidade = await unidadeService.buscarUnidadePorId(id);

    if (!unidade) {
      return res.status(404).json(
        respostaErro({
          mensagem: "Unidade não encontrada.",
          codigoHttp: 404,
        }),
      );
    }

    return res.status(200).json(
      respostaSucesso({
        resultado: {
          unidade,
        },
      }),
    );
  }

  async listarComunicacoes(
    req: Request<{ id: string }>,
    res: Response<ApiResponse<{ comunicacoes: ComunicacaoDTO[] }>>,
  ) {
    const { id } = req.params;
    const unidadeExiste = await unidadeService.unidadeExiste(id);

    if (!unidadeExiste) {
      return res.status(404).json(
        respostaErro({
          mensagem: "Unidade não encontrada.",
          codigoHttp: 404,
        }),
      );
    }

    const comunicacoes =
      await comunicacaoService.listarComunicacoesPorUnidade(id);
    return res.status(200).json(
      respostaSucesso({
        resultado: {
          comunicacoes,
        },
      }),
    );
  }
}
