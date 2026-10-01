/*
 * O gráfico passos x tamanho (aba Desempenho, zona Algoritmos essenciais):
 * a mesma função do jogador rodando com listas de tamanhos diferentes. É a
 * intuição de desempenho sem matemática: num jeito os passos crescem junto
 * com a lista (reta), no outro eles disparam (curva), e é esse que trava
 * com um milhão de itens. Puro: gera as chamadas e resume as medições.
 */
import type { BancadaPrograma } from "@/conteudo/tipos";
import { LIMITES, type MedicaoPassos, type ValorEsperado } from "./executor/tipos";

export type ConfigDesempenho = NonNullable<BancadaPrograma["desempenho"]>;

/** Até onde uma medição conta: passou disso, "travaria" a página. */
export const LIMITE_DA_MEDICAO = LIMITES.passosMedicao;

export const TAMANHOS_PADRAO: readonly number[] = [10, 100, 500, 1000];

/** A lista de um tamanho: 1, 2, 3... (crescente), ao contrário, ou embaralhada sempre do mesmo jeito. */
export function listaDoTamanho(tamanho: number, tipo: ConfigDesempenho["lista"] = "crescente"): number[] {
  const lista = Array.from({ length: tamanho }, (_, i) => i + 1);
  if (tipo === "decrescente") return lista.reverse();
  if (tipo === "embaralhada") {
    let semente = 20260105 + tamanho;
    for (let i = lista.length - 1; i > 0; i -= 1) {
      semente = (semente * 1103515245 + 12345) % 2147483648;
      const j = semente % (i + 1);
      [lista[i], lista[j]] = [lista[j], lista[i]];
    }
  }
  return lista;
}

/** Os argumentos de cada medição: "$lista" vira a lista do tamanho e "$tamanho", o número. */
export function chamadasDaMedicao(config: ConfigDesempenho, funcao: ConfigDesempenho["funcoes"][number], tamanhos: readonly number[] = config.tamanhos ?? TAMANHOS_PADRAO) {
  return tamanhos.map((tamanho) => {
    const lista = listaDoTamanho(tamanho, config.lista);
    const args: ValorEsperado[] = (funcao.args ?? ["$lista"]).map((arg) => (arg === "$lista" ? lista : arg === "$tamanho" ? tamanho : arg));
    return { tamanho, args };
  });
}

/** A chave de uma medição guardada (validador passosNoMaximo com tamanho). */
export function chaveMedicao(funcao: string, tamanho: number): string {
  return `${funcao}:${tamanho}`;
}

/** "1.234 passos", "2,5 mil", "1,2 milhão": os números do gráfico para quem não programa. */
export function textoDePassos(passos: number): string {
  if (passos >= 1_000_000) return `${(passos / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} ${passos >= 2_000_000 ? "milhões" : "milhão"}`;
  if (passos >= 10_000) return `${Math.round(passos / 1000).toLocaleString("pt-BR")} mil`;
  return passos.toLocaleString("pt-BR");
}

/** Quantas vezes os passos cresceram do menor ao maior tamanho (para a explicação do gráfico). */
export function crescimento(medicoes: readonly MedicaoPassos[]): number | null {
  const validas = medicoes.filter((m) => !m.erro && m.passos > 0);
  if (validas.length < 2) return null;
  return validas[validas.length - 1].passos / validas[0].passos;
}
