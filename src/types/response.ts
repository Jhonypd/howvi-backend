export interface ApiResponse<T> {
  codigoHttp: number;
  sucesso: boolean;
  mensagem: string;
  resultado?: T;
}

export interface RespostaSucessoOptions<T> {
  resultado?: T;
  mensagem?: string;
  codigoHttp?: number;
}

export interface RespostaErroOptions<T = unknown> {
  mensagem?: string;
  codigoHttp?: number;
  resultado?: T;
}

export function respostaSucesso<T>(
  opcoes: RespostaSucessoOptions<T> = {},
): ApiResponse<T> {
  const {
    resultado,
    mensagem = "Operação realizada com sucesso.",
    codigoHttp = 200,
  } = opcoes;

  return {
    codigoHttp,
    sucesso: true,
    mensagem,
    resultado,
  };
}

export function respostaErro<T = unknown>(
  opcoes: RespostaErroOptions<T> = {},
): ApiResponse<T> {
  const {
    mensagem = "Erro interno do servidor.",
    codigoHttp = 500,
    resultado,
  } = opcoes;

  return {
    codigoHttp,
    sucesso: false,
    mensagem,
    resultado,
  };
}
