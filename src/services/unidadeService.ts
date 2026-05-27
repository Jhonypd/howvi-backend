import { UnidadeRepository } from "../repositories/unidadeRepository.js";
import type {
  FiltroListagemUnidadeDTO,
  UnidadeDTO,
} from "../types/db/unidade.js";
import type { MunicipioDTO } from "../types/db/municipio.js";

const unidadeRepository = new UnidadeRepository();

function agruparUnidadePorId(registros: any[]): UnidadeDTO[] {
  const unidades = new Map<
    number,
    UnidadeDTO & { municipios: MunicipioDTO[] }
  >();

  for (const registro of registros) {
    const unidadeId = registro.unidade_id;

    if (!unidades.has(unidadeId)) {
      unidades.set(unidadeId, {
        id: unidadeId,
        nome: registro.unidade_nome,
        descricao: registro.unidade_descricao,
        imagem: registro.unidade_imagem_url ?? null,
        dataCriacao: registro.unidade_data_criacao,
        instituicao: {
          id: registro.instituicao_id,
          nome: registro.instituicao_nome,
          email: registro.instituicao_email ?? null,
          telefone: registro.instituicao_telefone ?? null,
        },
        municipios: [],
      });
    }

    if (
      registro.municipio_id &&
      registro.municipio_nome &&
      registro.municipio_estado
    ) {
      const unidade = unidades.get(unidadeId)!;
      const jaExiste = unidade.municipios.some(
        (municipio) => municipio.id === registro.municipio_id,
      );

      if (!jaExiste) {
        unidade.municipios.push({
          id: registro.municipio_id,
          nome: registro.municipio_nome,
          estado: registro.municipio_estado,
        });
      }
    }
  }

  return Array.from(unidades.values()).map((unidade) => ({
    id: unidade.id,
    nome: unidade.nome,
    descricao: unidade.descricao,
    imagem: unidade.imagem,
    dataCriacao: unidade.dataCriacao,
    instituicao: unidade.instituicao,
    municipios: unidade.municipios,
  }));
}

function montarUnidadeCompleta(registros: any[]): UnidadeDTO {
  const primeiroRegistro = registros[0];

  return {
    id: primeiroRegistro.unidade_id,
    nome: primeiroRegistro.unidade_nome,
    descricao: primeiroRegistro.unidade_descricao,
    dataCriacao: primeiroRegistro.unidade_data_criacao,
    imagem: primeiroRegistro.unidade_imagem_url ?? null,
    instituicao: {
      id: primeiroRegistro.instituicao_id,
      nome: primeiroRegistro.instituicao_nome,
      email: primeiroRegistro.instituicao_email ?? null,
      telefone: primeiroRegistro.instituicao_telefone ?? null,
    },
    municipios: registros
      .filter((registro) => registro.municipio_id)
      .map((registro) => ({
        id: registro.municipio_id as number,
        nome: registro.municipio_nome as string,
        estado: registro.municipio_estado as string,
      })),
  };
}

export class UnidadeService {
  async listarUnidades(
    filtros?: FiltroListagemUnidadeDTO,
  ): Promise<UnidadeDTO[]> {
    const registros =
      await unidadeRepository.listarUnidadesComRelacoes(filtros);
    return agruparUnidadePorId(registros);
  }

  async buscarUnidadePorId(id: number | string): Promise<UnidadeDTO | null> {
    const registros = await unidadeRepository.buscarUnidadeComRelacoesPorId(id);

    if (registros.length === 0) {
      return null;
    }

    return montarUnidadeCompleta(registros);
  }

  async unidadeExiste(id: number | string): Promise<boolean> {
    return Boolean(await unidadeRepository.buscarUnidadePorId(id));
  }
}
