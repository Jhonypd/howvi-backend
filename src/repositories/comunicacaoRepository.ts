import sql from "../config/database.js";
import {
  criptografarTexto,
  descriptografarTexto,
} from "../utils/criptografia.js";
import type {
  CriacaoComunicacaoDTO,
  ComunicacaoDTO,
} from "../types/db/comunicacao.js";

function formatarEmailComunicante(email: string) {
  return email.replace(/@.*/, "@****");
}

export class ComunicacaoRepository {
  async criarComunicacao({
    titulo,
    descricaoDetalhada,
    emailComunicante,
    idUnidade,
  }: CriacaoComunicacaoDTO): Promise<ComunicacaoDTO | null> {
    try {
      const emailCriptografado = criptografarTexto(emailComunicante);

      const comunicacoes = await sql`
        INSERT INTO howvi.comunicacao (
          titulo,
          descricao_detalhada,
          email_comunicante,
          id_unidade
        )
        VALUES (
          ${titulo},
          ${descricaoDetalhada},
          ${emailCriptografado},
          ${idUnidade}
        )
        RETURNING
          id,
          codigo,
          titulo,
          descricao_detalhada AS "descricaoDetalhada",
          data_hora_envio AS "dataHoraEnvio",
          email_comunicante AS "emailComunicante",
          status,
          id_unidade AS "idUnidade"
      `;

      const comunicacao = comunicacoes[0] as ComunicacaoDTO | undefined;

      return comunicacao
        ? {
            ...comunicacao,
            emailComunicante: formatarEmailComunicante(
              descriptografarTexto(comunicacao.emailComunicante),
            ),
          }
        : null;
    } catch (error: any) {
      throw new Error(
        `Erro ao criar comunicacao no Supabase: ${error.message}`,
        {
          cause: error,
        },
      );
    }
  }

  async buscarComunicacoesPorUnidade(
    idUnidade: number | string,
  ): Promise<ComunicacaoDTO[]> {
    try {
      const comunicacoes = (await sql`
        SELECT
          id,
          codigo,
          titulo,
          descricao_detalhada AS "descricaoDetalhada",
          data_hora_envio AS "dataHoraEnvio",
          email_comunicante AS "emailComunicante",
          status,
          id_unidade AS "idUnidade"
        FROM howvi.comunicacao
        WHERE id_unidade = ${idUnidade}
        ORDER BY data_hora_envio DESC
      `) as ComunicacaoDTO[];

      return comunicacoes.map((comunicacao) => ({
        ...comunicacao,
        emailComunicante: formatarEmailComunicante(
          descriptografarTexto(comunicacao.emailComunicante),
        ),
      }));
    } catch (error: any) {
      throw new Error(
        `Erro ao buscar comunicacoes no Supabase: ${error.message}`,
        {
          cause: error,
        },
      );
    }
  }
}
