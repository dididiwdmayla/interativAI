import type { ResultadoValidador } from "@/motor/validadores";

/** Um objetivo (ou parte do desafio) visto pelo /lab/fases. */
export type ItemLab = {
  id: string;
  rotulo: string;
  /** Guiado, sozinho, previsão, parte... */
  etiqueta: string;
  situacao: "feito" | "atual" | "futuro";
  resultado: ResultadoValidador | null;
};

/** O que o JogoFase expõe para o painel do lab. */
export type ApiLab = {
  /** Sobe a cada evento do painel (o JogoFase redesenha a gaveta junto). */
  versao: number;
  /** Avalia agora todos os validadores da fase contra a página viva. */
  avaliarItens: () => ItemLab[];
  /** Aplica a solucaoDeTeste do objetivo (ou parte) atual. Devolve o erro, se houver. */
  aplicarSolucaoAtual: () => string | null;
};
