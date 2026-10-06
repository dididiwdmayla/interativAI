/*
 * A tela de aplicativo das cenas (o tipo `telaApp`): o "dispositivo" de um
 * software é a tela dele. Ela guarda o que mostra num texto só
 * (`conteudo`, JSON), e daí saem o desenho, o `texto` e os `conflitos` que o
 * código lê. Puro: o motor, a tela, os validadores e o Levar pro mundo usam
 * as mesmas funções.
 */
import { TELA_APP } from "./catalogo";

export type LinhaDaAgenda = { horario: number; cliente: string; repetido: boolean };

export type ConteudoDaTela =
  | { tipo: "recado"; recado: string }
  | { tipo: "agenda"; titulo: string; linhas: LinhaDaAgenda[]; escondidas: number };

/** O que a tela mostra, a partir do `conteudo` guardado (null: apagada). */
export function lerConteudoDaTela(conteudo: unknown): ConteudoDaTela | null {
  if (typeof conteudo !== "string" || !conteudo) return null;
  try {
    const dado = JSON.parse(conteudo) as { recado?: string; titulo?: string; linhas?: [number, string][]; mais?: number };
    if (typeof dado.recado === "string") return { tipo: "recado", recado: dado.recado };
    const linhas = dado.linhas ?? [];
    const contagem = new Map<number, number>();
    for (const [horario] of linhas) contagem.set(horario, (contagem.get(horario) ?? 0) + 1);
    return {
      tipo: "agenda",
      titulo: dado.titulo ?? "",
      linhas: linhas.map(([horario, cliente]) => ({ horario, cliente, repetido: (contagem.get(horario) ?? 0) > 1 })),
      escondidas: dado.mais ?? 0,
    };
  } catch {
    return null;
  }
}

/** O horário como a agenda mostra: 9h, 10h. */
export const textoDoHorario = (horario: number) => `${horario}h`;

/** O que a tela mostra em texto (a propriedade `texto`). */
export function textoDaTela(conteudo: ConteudoDaTela | null): string {
  if (!conteudo) return "";
  if (conteudo.tipo === "recado") return conteudo.recado;
  const linhas = conteudo.linhas.map((linha) => `${textoDoHorario(linha.horario)} ${linha.cliente}`).join(", ") || "agenda vazia";
  return conteudo.titulo ? `${conteudo.titulo}: ${linhas}` : linhas;
}

/** Quantos horários aparecem mais de uma vez na agenda (a propriedade `conflitos`). */
export function conflitosDaTela(conteudo: ConteudoDaTela | null): number {
  if (!conteudo || conteudo.tipo !== "agenda") return 0;
  return new Set(conteudo.linhas.filter((linha) => linha.repetido).map((linha) => linha.horario)).size;
}

type CriarErro = (tipo: "TypeError" | "RangeError", mensagem: string) => Error;

/** O recado, como fica guardado (até 24 letras). */
export function guardarRecado(texto: unknown, criarErro: CriarErro): string {
  if (texto === undefined) throw criarErro("TypeError", 'mostrar precisa do recado, como mostrar("Bom dia!").');
  const recado = String(texto).slice(0, TELA_APP.letrasDoRecado);
  return recado ? JSON.stringify({ recado }) : "";
}

/**
 * A agenda, como fica guardada: confere cada marcação (o erro diz qual e o
 * que falta), põe em ordem de horário (a ordem da lista desempata) e guarda
 * as primeiras linhas que cabem na tela.
 */
export function guardarAgenda(lista: unknown, titulo: unknown, criarErro: CriarErro): string {
  if (!Array.isArray(lista)) throw criarErro("TypeError", "mostrarAgenda precisa de uma lista de marcações, como mostrarAgenda(agenda).");
  if (titulo !== undefined && typeof titulo !== "string") throw criarErro("TypeError", 'O título da agenda é um texto, como mostrarAgenda(agenda, "Terça").');
  const linhas = lista.map((marcacao: unknown, i): [number, string] => {
    const item = marcacao as { horario?: unknown; cliente?: unknown } | null;
    if (typeof item !== "object" || item === null) throw criarErro("TypeError", `A marcação ${i} da lista não é um objeto { horario, cliente }.`);
    const { horario, cliente } = item;
    if (typeof horario !== "number" || !Number.isInteger(horario) || horario < 0 || horario > 23) {
      throw criarErro("TypeError", `A marcação ${i} precisa de horario: um número inteiro de 0 a 23.`);
    }
    if (typeof cliente !== "string") throw criarErro("TypeError", `A marcação ${i} precisa de cliente: um texto, como "Ana".`);
    return [horario, cliente.slice(0, TELA_APP.letrasDoCliente)];
  });
  const ordenadas = linhas.map((linha, i) => ({ linha, i })).sort((a, b) => a.linha[0] - b.linha[0] || a.i - b.i).map(({ linha }) => linha);
  return JSON.stringify({
    titulo: (titulo ?? "").slice(0, TELA_APP.letrasDoTitulo),
    linhas: ordenadas.slice(0, TELA_APP.linhas),
    mais: Math.max(0, ordenadas.length - TELA_APP.linhas),
  });
}
