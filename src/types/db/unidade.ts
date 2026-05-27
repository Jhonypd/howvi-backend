import type { MunicipioDTO } from "./municipio.js";

export interface UnidadeDTO {
  id: number;
  nome: string;
  descricao: string;
  dataCriacao: Date;
  imagem?: string | null;
  instituicao: {
    id: number;
    nome: string;
    email?: string | null;
    telefone?: string | null;
  };
  municipios: MunicipioDTO[];
}

export interface UnidadeListagemDTO extends Omit<UnidadeDTO, "instituicao"> {
  instituicao: {
    id: number;
    nome: string;
  };
}

export interface FiltroListagemUnidadeDTO {
  nome?: string;
  cidade?: string;
  estado?: string;
}
