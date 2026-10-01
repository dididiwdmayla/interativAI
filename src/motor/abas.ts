/*
 * As abas de cima do DevTools, na ordem do Chrome. Estilos e Calculado não
 * são abas de cima: no Chrome eles são sub-painéis DENTRO de Elements
 * (Styles e Computed), e aqui também (ver PainelElementos em
 * src/conteudo/tipos.ts).
 *
 * Busca, Medição e Campanha (zona "Ser encontrado") não existem no Chrome, e a
 * Desempenho daqui conta passos em vez de medir tempo: são
 * simulações do jogo, então só aparecem nas fases que as usam
 * (`soQuandoLivre`), e as fases publicadas continuam com as abas de sempre.
 */
export type Aba = "elementos" | "console" | "fontes" | "rede" | "aplicacao" | "lighthouse" | "busca" | "medicao" | "campanha" | "desempenho";

export type DefinicaoAba = { id: Aba; rotulo: string; soQuandoLivre?: true };

export const ABAS: readonly DefinicaoAba[] = [
  { id: "elementos", rotulo: "Elementos" },
  { id: "console", rotulo: "Console" },
  { id: "fontes", rotulo: "Fontes" },
  { id: "rede", rotulo: "Rede" },
  // No Chrome, Desempenho (Performance) vem depois de Rede e mede tempo. Aqui é a simulação do
  // jogo que conta passos (zonas Algoritmos essenciais e Estruturas de dados), só nas fases que usam.
  { id: "desempenho", rotulo: "Desempenho", soQuandoLivre: true },
  { id: "aplicacao", rotulo: "Aplicação" },
  // No Chrome, Lighthouse vem depois de Application (e de Security): aqui, a última do Chrome.
  { id: "lighthouse", rotulo: "Lighthouse" },
  { id: "busca", rotulo: "Busca", soQuandoLivre: true },
  { id: "medicao", rotulo: "Medição", soQuandoLivre: true },
  { id: "campanha", rotulo: "Campanha", soQuandoLivre: true },
];
