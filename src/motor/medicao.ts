/*
 * Medição simulada (zona "Ser encontrado", S4).
 *
 * O site-alvo ainda não roda JavaScript (o jogador aprende a escrever
 * código na ilha Páginas vivas), então o jogo SIMULA a ferramenta de
 * medição: um elemento com `data-evento="<nome>"` gera o evento `<nome>`
 * quando é clicado na prévia, e a aba Medição mostra os eventos chegando,
 * como o relatório em tempo real de uma ferramenta de análise. Na vida
 * real, isso é feito por um código de medição instalado na página.
 *
 * Links rastreáveis: os parâmetros utm_source, utm_medium e utm_campaign
 * no fim do endereço dizem de onde veio a visita. Eles não mudam a página
 * (quem abre o link vê o mesmo site); só a ferramenta de medição lê.
 */

export type Utm = { source: string; medium: string; campaign: string };

/** O nome do evento de um clique: o data-evento do elemento (ou de um ancestral), ou null. */
export function eventoDoClique(elemento: Element): { nome: string; elemento: Element } | null {
  const alvo = elemento.closest("[data-evento]");
  const nome = alvo?.getAttribute("data-evento")?.trim() ?? "";
  return alvo && nome ? { nome, elemento: alvo } : null;
}

/** Nome de evento aceito: letras minúsculas, números e _ (como as ferramentas de medição pedem). */
export function nomeDeEventoValido(nome: string): boolean {
  return /^[a-z][a-z0-9_]{0,39}$/.test(nome);
}

function limparParametro(valor: string): string {
  return valor.trim().toLowerCase().replace(/\s+/g, "-");
}

/** Monta o link rastreável: o endereço de base com os três utm no fim (sem repetir os que já tinha). */
export function montarLinkRastreavel(base: string, utm: Utm): string {
  const semProtocolo = !/^[a-z]+:\/\//i.test(base.trim());
  let url: URL;
  try {
    url = new URL(semProtocolo ? `https://${base.trim()}` : base.trim());
  } catch {
    url = new URL("https://site.exemplo/");
  }
  url.searchParams.set("utm_source", limparParametro(utm.source));
  url.searchParams.set("utm_medium", limparParametro(utm.medium));
  url.searchParams.set("utm_campaign", limparParametro(utm.campaign));
  return url.toString();
}

/** Os utm de um endereço (null se falta algum dos três ou o endereço não é válido). */
export function lerUtm(href: string | null | undefined): Utm | null {
  if (!href) return null;
  let url: URL;
  try {
    url = new URL(href, "https://site.exemplo/");
  } catch {
    return null;
  }
  const source = url.searchParams.get("utm_source")?.trim() ?? "";
  const medium = url.searchParams.get("utm_medium")?.trim() ?? "";
  const campaign = url.searchParams.get("utm_campaign")?.trim() ?? "";
  return source && medium && campaign ? { source, medium, campaign } : null;
}

/** "instagram / social / promo-inverno", como o relatório mostra a origem. */
export function rotuloDaOrigem(utm: Utm | null): string {
  return utm ? `${utm.source} / ${utm.medium} / ${utm.campaign}` : "direto (sem link rastreável)";
}

/** O link do seletor tem os três utm, com os valores pedidos (sem diferenciar maiúsculas). */
export function conferirLinkRastreavel(
  elementos: readonly Element[],
  pedido: Partial<Utm>,
): { passou: boolean; detalhe: string } {
  if (elementos.length === 0) return { passou: false, detalhe: "nenhum elemento com esse seletor" };
  const achados: string[] = [];
  for (const elemento of elementos) {
    const href = elemento.getAttribute("href");
    const utm = lerUtm(href);
    if (!utm) {
      achados.push(href ? `"${href}" sem os três utm` : "sem href");
      continue;
    }
    const bate = (Object.keys(pedido) as (keyof Utm)[]).every((chave) => utm[chave].toLowerCase() === (pedido[chave] ?? "").toLowerCase());
    if (bate) return { passou: true, detalhe: rotuloDaOrigem(utm) };
    achados.push(rotuloDaOrigem(utm));
  }
  return { passou: false, detalhe: achados.join("; ") };
}
