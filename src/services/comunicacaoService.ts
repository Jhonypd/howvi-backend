import { ComunicacaoRepository } from "../repositories/comunicacaoRepository.js";
import { UnidadeRepository } from "../repositories/unidadeRepository.js";
import type {
  CriacaoComunicacaoDTO,
  ComunicacaoDTO,
} from "../types/db/comunicacao.js";

const comunicacaoRepository = new ComunicacaoRepository();
const unidadeRepository = new UnidadeRepository();

export class ComunicacaoService {
  async criarComunicacao(
    dados: CriacaoComunicacaoDTO,
  ): Promise<ComunicacaoDTO | null> {
    const unidadeExiste = await unidadeRepository.buscarUnidadePorId(
      dados.idUnidade,
    );

    if (!unidadeExiste) {
      return null;
    }

    return comunicacaoRepository.criarComunicacao(dados);
  }

  async listarComunicacoesPorUnidade(
    idUnidade: number | string,
  ): Promise<ComunicacaoDTO[]> {
    return comunicacaoRepository.buscarComunicacoesPorUnidade(idUnidade);
  }
}
