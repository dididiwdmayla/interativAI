/*
 * Peças comuns das unidades de chamado da Depuração (U5 e U6): falas do
 * computadorzinho, enunciado igual para mouse e toque, os casos escondidos
 * de uma função e as listas de conceitos que voltam em todo chamado.
 */
import type { Acao, Fala, IdConceito, Validador } from "@/conteudo/tipos";
import type { CasoFuncao, ValorEsperado } from "@/motor/executor/tipos";

export const curioso = (texto: string): Fala => ({ texto, expressao: "curioso" });
export const enunciado = (texto: string) => ({ mouse: texto, toque: texto });

/** `funcaoPassa` com os casos escritos como [argumentos, esperado]. */
export const casosDe = (nome: string, casos: [ValorEsperado[], ValorEsperado][]): Validador => ({
  tipo: "funcaoPassa",
  nome,
  casos: casos.map(([args, esperado]): CasoFuncao => ({ args, esperado })),
});

/** O que o aluno já sabe de Depuração e Lógica quando abre um chamado. */
export const SABE_DEPURACAO: IdConceito[] = [
  "ler-mensagem-de-erro",
  "funcao-js",
  "return-js",
  "escopo-bloco-js",
  "array-js",
  "objeto-js",
  "for-of-js",
  "igualdade-estrita",
  "causa-do-erro",
  "ponto-de-parada",
  "hipotese-de-bug",
  "bug-silencioso",
  "passar-por-cima",
  "observar-expressoes",
  "escopo-na-pausa",
];

/** Ferramentas da tela de investigação com casos de teste e plano. */
export const FERRAMENTAS_INVESTIGACAO = [
  "console",
  "snippet",
  "palco-memoria",
  "linha-do-tempo",
  "pontos-de-parada",
  "controles-depurador",
  "painel-escopo",
  "painel-observar",
  "pilha-de-chamadas",
] as const;

export const SITE_DE_CONSOLE = { url: "console", titulo: "Palco da memória", head: "", body: "" };

/** Retoma o programa pausado e desliga o ponto de parada da linha (antes de rodar o conserto). */
export const soltarPonto = (linha: number): Acao[] => [{ tipo: "controlarDepurador", controle: "retomar" }, { tipo: "alternarPontoDeParada", linha }];
