export interface CriacaoComunicacaoDTO {
  titulo: string;
  descricaoDetalhada: string;
  emailComunicante: string;
  idUnidade: number | string;
}

export interface ComunicacaoSeguraDTO {
  emailComunicante?: string;
}

export interface ComunicacaoDTO {
  id: number;
  codigo: string;
  titulo: string;
  descricaoDetalhada: string;
  dataHoraEnvio: string | Date;
  emailComunicante: string;
  status: string;
  idUnidade: number;
}
