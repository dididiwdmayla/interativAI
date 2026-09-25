/*
 * Links dentro da prévia. O iframe do site-alvo não pode navegar (a
 * página sumiria e a fase quebraria), então todo clique num link é
 * segurado e vira uma destas situações, igual para a interface e para os
 * testes de conteúdo.
 */
import type { DestinoLink } from "@/motor/eventos";

export type LinkClicado = {
  /** O href como está escrito no HTML ("" se não tiver). */
  href: string;
  destino: DestinoLink;
  /** Âncora: o elemento para onde rolar. */
  alvo: Element | null;
  /** target="_blank": abriria numa aba nova. */
  abaNova: boolean;
};

/** Elemento com o id (ou, como no navegador, <a name>) de uma âncora. */
function alvoDaAncora(documento: Document, nome: string): Element | null {
  if (!nome) return null;
  let decodificado = nome;
  try {
    decodificado = decodeURIComponent(nome);
  } catch {
    // Mantém como está.
  }
  return documento.getElementById(decodificado) ?? documento.getElementsByName(decodificado)[0] ?? null;
}

/** Classifica o link: âncora, quebrado, vazio ou externo. */
export function classificarLink(link: Element): LinkClicado {
  const documento = link.ownerDocument;
  const href = (link.getAttribute("href") ?? "").trim();
  const abaNova = (link.getAttribute("target") ?? "").trim().toLowerCase() === "_blank";
  if (href === "" || href === "#") return { href, destino: "vazio", alvo: null, abaNova };
  if (href.startsWith("#")) {
    const alvo = alvoDaAncora(documento, href.slice(1));
    return { href, destino: alvo ? "ancora" : "quebrado", alvo, abaNova };
  }
  return { href, destino: "externo", alvo: null, abaNova };
}

/** O link (a ou area) em que o clique caiu, se houver. */
export function linkDoAlvo(alvo: EventTarget | null): Element | null {
  const no = alvo as Node | null;
  if (!no || typeof no !== "object" || !("nodeType" in no)) return null;
  const elemento = no.nodeType === 1 ? (no as Element) : no.parentElement;
  return elemento?.closest("a, area") ?? null;
}

const LIMITE_HREF = 70;

/** Fala do computadorzinho para o link clicado (null na âncora: a rolagem já mostra). */
export function falaDoLink(link: LinkClicado): { texto: string; expressao: "apontando" | "preocupado" | "pensativo" } | null {
  switch (link.destino) {
    case "ancora":
      return null;
    case "externo": {
      const href = link.href.length > LIMITE_HREF ? `${link.href.slice(0, LIMITE_HREF - 3)}...` : link.href;
      return {
        texto: `Esse link levaria para: ${href}${link.abaNova ? " (numa aba nova)" : ""}`,
        expressao: "apontando",
      };
    }
    case "quebrado":
      return {
        texto: `Esse link aponta para ${link.href}, mas nenhuma peça da página tem esse id. É um link quebrado!`,
        expressao: "preocupado",
      };
    case "vazio":
      return link.href === "#"
        ? {
            texto: 'Esse link tem href="#": no navegador ele só pula pro topo da página, não leva a lugar nenhum.',
            expressao: "pensativo",
          }
        : { texto: "Esse link não leva a lugar nenhum: o href dele está vazio.", expressao: "pensativo" };
  }
}
