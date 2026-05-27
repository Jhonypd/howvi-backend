import sql from "../config/database.js";
import type { FiltroListagemUnidadeDTO } from "../types/db/unidade.js";

export class UnidadeRepository {
  async listarUnidadesComRelacoes(
    filtros?: FiltroListagemUnidadeDTO,
  ): Promise<any[]> {
    try {
      const nomeFiltro = filtros?.nome?.trim();
      const cidadeFiltro = filtros?.cidade?.trim();
      const estadoFiltro = filtros?.estado?.trim();

      return (await sql`
        SELECT
          uc.id AS unidade_id,
          uc.nome AS unidade_nome,
          uc.descricao AS unidade_descricao,
          uc.imagem_url AS unidade_imagem_url,
          uc.data_criacao AS unidade_data_criacao,
          i.id AS instituicao_id,
          i.nome AS instituicao_nome,
          i.email AS instituicao_email,
          i.telefone AS instituicao_telefone,
          m.id AS municipio_id,
          m.nome AS municipio_nome,
          m.estado AS municipio_estado
        FROM howvi.unidade_conservacao uc
        INNER JOIN howvi.instituicao i ON i.id = uc.id_instituicao
        LEFT JOIN howvi.unidade_municipio um ON um.id_unidade = uc.id
        LEFT JOIN howvi.municipio m ON m.id = um.id_municipio
        WHERE 1 = 1
        ${nomeFiltro ? sql`AND uc.nome ILIKE ${`%${nomeFiltro}%`}` : sql``}
        ${
          cidadeFiltro
            ? sql`
              AND EXISTS (
                SELECT 1
                FROM howvi.unidade_municipio um_filtro
                INNER JOIN howvi.municipio m_filtro
                  ON m_filtro.id = um_filtro.id_municipio
                WHERE um_filtro.id_unidade = uc.id
                  AND m_filtro.nome ILIKE ${`%${cidadeFiltro}%`}
              )
            `
            : sql``
        }
        ${
          estadoFiltro
            ? sql`
              AND EXISTS (
                SELECT 1
                FROM howvi.unidade_municipio um_filtro
                INNER JOIN howvi.municipio m_filtro
                  ON m_filtro.id = um_filtro.id_municipio
                WHERE um_filtro.id_unidade = uc.id
                  AND m_filtro.estado ILIKE ${`%${estadoFiltro}%`}
              )
            `
            : sql``
        }
        ORDER BY uc.nome, m.nome, m.estado
      `) as any[];
    } catch (error: any) {
      throw new Error(`Erro ao listar unidades no Supabase: ${error.message}`, {
        cause: error,
      });
    }
  }

  async buscarUnidadeComRelacoesPorId(id: number | string): Promise<any[]> {
    try {
      return (await sql`
        SELECT
          uc.id AS unidade_id,
          uc.nome AS unidade_nome,
          uc.descricao AS unidade_descricao,
          uc.imagem_url AS unidade_imagem_url,
          uc.data_criacao AS unidade_data_criacao,
          i.id AS instituicao_id,
          i.nome AS instituicao_nome,
          i.email AS instituicao_email,
          i.telefone AS instituicao_telefone,
          m.id AS municipio_id,
          m.nome AS municipio_nome,
          m.estado AS municipio_estado
        FROM howvi.unidade_conservacao uc
        INNER JOIN howvi.instituicao i ON i.id = uc.id_instituicao
        LEFT JOIN howvi.unidade_municipio um ON um.id_unidade = uc.id
        LEFT JOIN howvi.municipio m ON m.id = um.id_municipio
        WHERE uc.id = ${id}
        ORDER BY m.nome, m.estado
      `) as any[];
    } catch (error: any) {
      throw new Error(
        `Erro ao buscar unidade por id no Supabase: ${error.message}`,
        {
          cause: error,
        },
      );
    }
  }

  async buscarUnidadePorId(
    id: number | string,
  ): Promise<{ id: number } | null> {
    try {
      const unidades = (await sql`
        SELECT id
        FROM howvi.unidade_conservacao
        WHERE id = ${id}
      `) as { id: number }[];

      return unidades[0] ?? null;
    } catch (error: any) {
      throw new Error(
        `Erro ao verificar unidade no Supabase: ${error.message}`,
        {
          cause: error,
        },
      );
    }
  }
}
