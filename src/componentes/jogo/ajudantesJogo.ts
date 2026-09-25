import { tocarEfeito } from "@/audio/motor";
import type { IdFerramenta } from "@/ferramentas/ids";
import { obterProgresso } from "@/lib/armazemProgresso";
import { desbloquearTema, escolherTema } from "@/lib/tema";
import type { Fala } from "@/motor/tipos";

export const FALA_PENSANDO: Fala = { texto: "Hmm, deixa eu pensar...", expressao: "pensativo" };

export const RECADO_PAISAGEM = "Pra digitar, fica mais confortável com o celular em pé";

const PALAVRA_SECRETA = "curioso";

/** Tempo para ler uma fala antes do balão fechar sozinho (celular deitado). */
export function tempoDeLeitura(texto: string): number {
  return 3500 + texto.length * 55;
}

/** Easter egg: a palavra do F12 libera o tema Segredo, sem chamar o Gemini. */
export function responderSegredo(pergunta: string, falar: (fala: Fala) => void): Fala | null {
  if (pergunta.trim().toLowerCase() !== PALAVRA_SECRETA) return null;
  const jaTinha = obterProgresso().temasDesbloqueados.includes("segredo");
  desbloquearTema("segredo");
  escolherTema("segredo");
  tocarEfeito("desbloqueio");
  const fala: Fala = {
    texto: jaTinha
      ? "Olha só quem voltou para investigar! O tema Segredo já é seu. Troque quando quiser na paleta lá em cima."
      : "Você me achou pelo F12! Isso é investigar do jeitinho de quem programa. Liberei o tema Segredo pra você: já liguei, e dá pra trocar na paleta lá em cima.",
    expressao: "comemorando",
  };
  falar(fala);
  return fala;
}

/** Ferramentas que moram na árvore: no celular, a apresentação mostra a Árvore. */
export const FERRAMENTAS_DA_ARVORE: readonly IdFerramenta[] = [
  "arvore",
  "editar-duplo-clique",
  "trilha",
  "esconder",
  "apagar",
  "duplicar",
  "renomear-tag",
];

/** Ferramentas que moram no painel Estilos (no celular em pé, o segmento Estilos). */
export const FERRAMENTAS_DOS_ESTILOS: readonly IdFerramenta[] = [
  "painel-estilos",
  "editar-valor-css",
  "ligar-desligar-declaracao",
  "setas-numericas",
  "seletor-de-cor",
  "nova-regra",
];

/** Ctrl+Z (desfazer) e Ctrl+Shift+Z ou Ctrl+Y (refazer), como no F12. */
export function atalhoHistorico(evento: {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
}): "desfazer" | "refazer" | null {
  if (!(evento.ctrlKey || evento.metaKey) || evento.altKey) return null;
  const tecla = evento.key.toLowerCase();
  if (tecla === "z") return evento.shiftKey ? "refazer" : "desfazer";
  if (tecla === "y" && !evento.shiftKey) return "refazer";
  return null;
}

/** Com o foco no editor ou num campo, vale o desfazer deles. */
export function focoTemDesfazerProprio(alvo: EventTarget | null): boolean {
  return alvo instanceof HTMLElement && Boolean(alvo.closest(".cm-editor, input, textarea, [contenteditable]"));
}

/** Elementos que já usam Enter sozinhos; aí o atalho global não age. */
export function focoUsaEnter(alvo: EventTarget | null): boolean {
  if (!(alvo instanceof HTMLElement)) return false;
  return Boolean(alvo.closest("input, textarea, button, a, select, [contenteditable], [role=tree], .cm-editor"));
}
