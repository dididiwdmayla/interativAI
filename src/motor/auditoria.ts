/*
 * A auditoria do painel Lighthouse, versão simplificada do jogo.
 *
 * Roda sobre o DOM e o motor de cascata (as cores resolvidas, as @media
 * avaliadas na tela informada), sem layout: dá o mesmo resultado no
 * navegador e no jsdom, então o testar:conteudo enxerga as mesmas notas
 * que o jogador.
 *
 * Conferido no Lighthouse de verdade (core/config/default-config.js e
 * shared/util.js): cada categoria é a média das verificações que se
 * aplicam, pesadas (image-alt 10, button-name 10, link-name 7,
 * color-contrast 7, document-title 7, html-has-lang 7, heading-order 3,
 * landmark-one-main 3 em Acessibilidade; doctype e charset em Boas
 * práticas; document-title, meta-description, link-text e image-alt em
 * SEO); verificação que não se aplica (página sem imagem) não conta. A
 * nota vai de 0 a 100: 90 ou mais é boa, de 50 a 89 é média, abaixo de 50
 * é ruim. Aqui o viewport e o id duplicado moram em Boas práticas, com
 * peso 3 (simplificação).
 */
import { leitorDeValores, type OpcoesCascata, type ValorEfetivo } from "./css/cascata";
import { contrasteEntre, CONTRASTE_MINIMO } from "@/lib/contraste";
import { lerCor } from "./css/valores";

export type CategoriaAuditoria = "acessibilidade" | "boas-praticas" | "seo";

export const CATEGORIAS_AUDITORIA: readonly { id: CategoriaAuditoria; nome: string }[] = [
  { id: "acessibilidade", nome: "Acessibilidade" },
  { id: "boas-praticas", nome: "Boas práticas" },
  { id: "seo", nome: "SEO básico" },
];

export const IDS_REGRAS_AUDITORIA = [
  "imagem-sem-alt",
  "contraste",
  "titulos-pulando-nivel",
  "link-sem-texto",
  "botao-sem-texto",
  "html-sem-lang",
  "pagina-sem-titulo",
  "sem-main",
  "sem-meta-viewport",
  "id-duplicado",
  "sem-doctype",
  "sem-charset",
  "sem-descricao",
  "link-generico",
] as const;

export type IdRegraAuditoria = (typeof IDS_REGRAS_AUDITORIA)[number];

export type RegraAuditoria = {
  id: IdRegraAuditoria;
  /** A verificação do Lighthouse de verdade que ela imita. */
  noLighthouse: string;
  /** Pesos nas categorias em que ela conta. */
  pesos: Partial<Record<CategoriaAuditoria, number>>;
  /** Quando falha (o título do problema). */
  titulo: string;
  /** Quando passa. */
  tituloOk: string;
  /** Por que importa, em linguagem de leigo. */
  porQue: string;
  /** Como consertar, em uma frase. */
  comoConsertar: string;
};

export const REGRAS_AUDITORIA: Readonly<Record<IdRegraAuditoria, RegraAuditoria>> = {
  "imagem-sem-alt": {
    id: "imagem-sem-alt",
    noLighthouse: "image-alt",
    pesos: { acessibilidade: 10, seo: 1 },
    titulo: "Imagem sem o atributo alt",
    tituloOk: "Toda imagem tem alt",
    porQue:
      "Quem usa leitor de tela (um programa que lê a página em voz alta) ouve só \"imagem\", sem saber o que tem nela. O Google também usa o alt para entender a foto.",
    comoConsertar: 'Ponha um alt que descreva a imagem (alt="" se ela for só enfeite).',
  },
  contraste: {
    id: "contraste",
    noLighthouse: "color-contrast",
    pesos: { acessibilidade: 7 },
    titulo: "Texto com pouco contraste com o fundo",
    tituloOk: "O texto se destaca do fundo",
    porQue:
      "Texto claro em fundo claro some para quem enxerga pouco, e para todo mundo no sol. O mínimo é 4,5:1 (3:1 em texto grande).",
    comoConsertar: "Escureça o texto ou clareie o fundo (ou o contrário) até passar do mínimo.",
  },
  "titulos-pulando-nivel": {
    id: "titulos-pulando-nivel",
    noLighthouse: "heading-order",
    pesos: { acessibilidade: 3 },
    titulo: "Títulos pulando nível",
    tituloOk: "Os títulos seguem a ordem",
    porQue:
      "Os títulos são o sumário da página: quem usa leitor de tela pula de título em título. Ir do h1 direto para o h3 parece que faltou um capítulo.",
    comoConsertar: "Troque o título para o nível logo abaixo do anterior (depois de h1, h2).",
  },
  "link-sem-texto": {
    id: "link-sem-texto",
    noLighthouse: "link-name",
    pesos: { acessibilidade: 7 },
    titulo: "Link sem texto",
    tituloOk: "Todo link tem texto",
    porQue: 'Um link sem texto é lido só como "link". Ninguém sabe para onde ele leva.',
    comoConsertar: "Escreva um texto dentro do link (ou um aria-label, se for só um ícone).",
  },
  "botao-sem-texto": {
    id: "botao-sem-texto",
    noLighthouse: "button-name",
    pesos: { acessibilidade: 10 },
    titulo: "Botão sem texto",
    tituloOk: "Todo botão tem texto",
    porQue: 'Um botão sem texto é lido só como "botão". Quem não vê a tela não sabe o que ele faz.',
    comoConsertar: "Escreva o que o botão faz dentro dele (ou um aria-label, se for só um ícone).",
  },
  "html-sem-lang": {
    id: "html-sem-lang",
    noLighthouse: "html-has-lang",
    pesos: { acessibilidade: 7 },
    titulo: "O <html> não diz o idioma (lang)",
    tituloOk: "O <html> diz o idioma",
    porQue: "Sem o idioma, o leitor de tela pode ler o português com a pronúncia do inglês.",
    comoConsertar: 'Ponha lang="pt-BR" no <html>.',
  },
  "pagina-sem-titulo": {
    id: "pagina-sem-titulo",
    noLighthouse: "document-title",
    pesos: { acessibilidade: 7, seo: 1 },
    titulo: "Página sem <title>",
    tituloOk: "A página tem <title>",
    porQue: "O <title> é o nome da aba e o título que aparece no Google. Sem ele, a aba mostra só o endereço.",
    comoConsertar: "Escreva um <title> no head, com o nome da página.",
  },
  "sem-main": {
    id: "sem-main",
    noLighthouse: "landmark-one-main",
    pesos: { acessibilidade: 3 },
    titulo: "Página sem <main>",
    tituloOk: "A página tem um <main>",
    porQue: "O <main> marca o conteúdo principal. Leitores de tela têm um atalho para pular direto para ele, sem passar pelo menu.",
    comoConsertar: "Envolva o conteúdo principal num <main> (um só por página).",
  },
  "sem-meta-viewport": {
    id: "sem-meta-viewport",
    noLighthouse: "viewport",
    pesos: { "boas-praticas": 3 },
    titulo: "Página sem <meta name=\"viewport\">",
    tituloOk: "A página tem meta viewport",
    porQue: "Sem ele, o celular desenha a página em 980 px e encolhe tudo: letra minúscula e zoom de pinça.",
    comoConsertar: 'Ponha <meta name="viewport" content="width=device-width, initial-scale=1"> no head.',
  },
  "id-duplicado": {
    id: "id-duplicado",
    noLighthouse: "duplicate-id-aria",
    pesos: { "boas-praticas": 3 },
    titulo: "Dois elementos com o mesmo id",
    tituloOk: "Os ids são únicos",
    porQue: "O id é como um RG: tem que ser único. Com dois iguais, o link âncora e o CSS #id pegam só o primeiro.",
    comoConsertar: "Troque um dos ids (ou use class, que pode repetir).",
  },
  "sem-doctype": {
    id: "sem-doctype",
    noLighthouse: "doctype",
    pesos: { "boas-praticas": 1 },
    titulo: "Página sem <!DOCTYPE html>",
    tituloOk: "A página tem <!DOCTYPE html>",
    porQue: "Sem ele, o navegador entra no modo antigo (quirks) e desenha a página com regras de antigamente.",
    comoConsertar: "Ponha <!DOCTYPE html> na primeira linha.",
  },
  "sem-charset": {
    id: "sem-charset",
    noLighthouse: "charset",
    pesos: { "boas-praticas": 1 },
    titulo: "Página sem <meta charset>",
    tituloOk: "A página diz a codificação (charset)",
    porQue: "Sem ele, os acentos podem virar símbolos estranhos (CartÃ£o no lugar de Cartão).",
    comoConsertar: 'Ponha <meta charset="utf-8"> no começo do head.',
  },
  "sem-descricao": {
    id: "sem-descricao",
    noLighthouse: "meta-description",
    pesos: { seo: 1 },
    titulo: "Página sem descrição (meta description)",
    tituloOk: "A página tem descrição",
    porQue: "A descrição é o resuminho que aparece embaixo do título no Google. Sem ela, o Google escolhe um pedaço qualquer.",
    comoConsertar: 'Ponha <meta name="description" content="..."> no head, com uma frase sobre a página.',
  },
  "link-generico": {
    id: "link-generico",
    noLighthouse: "link-text",
    pesos: { seo: 1 },
    titulo: "Link com texto que não diz nada",
    tituloOk: "Os links dizem para onde vão",
    porQue: '"Clique aqui" não diz nada fora da frase. O Google e os leitores de tela preferem links que dizem o destino.',
    comoConsertar: 'Troque o texto por algo como "Veja o cardápio".',
  },
};

/** Um problema achado: a regra, as peças (vazio se é da página inteira) e um detalhe por peça. */
export type ProblemaAuditoria = {
  regra: IdRegraAuditoria;
  elementos: Element[];
  detalhes: string[];
};

export type ResultadoAuditoria = {
  notas: Record<CategoriaAuditoria, number>;
  /** Regras que falharam, com as peças. */
  problemas: ProblemaAuditoria[];
  /** Regras que se aplicam e passaram. */
  aprovadas: IdRegraAuditoria[];
  /** Regras que não se aplicam nesta página (sem imagem, sem link...). */
  naoSeAplicam: IdRegraAuditoria[];
};

/** Faixa da nota, como o Lighthouse: 90 ou mais boa, de 50 a 89 média, abaixo de 50 ruim. */
export function faixaDaNota(nota: number): "boa" | "media" | "ruim" {
  if (nota >= 90) return "boa";
  if (nota >= 50) return "media";
  return "ruim";
}

/* ------------------------------------------------------------------ */
/* Ajudantes                                                           */
/* ------------------------------------------------------------------ */

/** Estilos do próprio jogo (esconder, folha injetada) e o que não se vê não entram. */
function ignorada(elemento: Element): boolean {
  return (
    elemento.hasAttribute("data-jogo-injetado") ||
    elemento.closest("[hidden], [aria-hidden='true'], template, script, style, noscript") !== null
  );
}

function textoDe(elemento: Element): string {
  return (elemento.textContent ?? "").replace(/\s+/g, " ").trim();
}

/** O nome acessível simplificado: texto, aria-label, title ou o alt de uma imagem dentro. */
function temNome(elemento: Element): boolean {
  if (textoDe(elemento).length > 0) return true;
  if ((elemento.getAttribute("aria-label") ?? "").trim().length > 0) return true;
  if ((elemento.getAttribute("title") ?? "").trim().length > 0) return true;
  const rotulada = elemento.getAttribute("aria-labelledby");
  if (rotulada && rotulada.split(/\s+/).some((id) => textoDe(elemento.ownerDocument.getElementById(id) ?? elemento).length > 0)) return true;
  if (elemento.tagName === "INPUT" && (elemento.getAttribute("value") ?? "").trim().length > 0) return true;
  return Array.from(elemento.querySelectorAll("img[alt], svg title")).some((filho) =>
    filho.tagName.toLowerCase() === "img" ? (filho.getAttribute("alt") ?? "").trim().length > 0 : textoDe(filho).length > 0,
  );
}

const LINKS_GENERICOS = new Set(["clique aqui", "clique", "aqui", "saiba mais", "leia mais", "mais", "veja mais", "link", "click here", "here", "more", "read more"]);

function valorOu(valor: ValorEfetivo, reserva: string | null): string | null {
  if (valor.tipo === "valor") return valor.valor;
  // Nada declara (a cor inicial do navegador): texto preto.
  if (valor.tipo === "incerto" && valor.motivo.startsWith("nada declara")) return reserva;
  return null;
}

/** Tem um texto próprio (um nó de texto filho com letras)? */
function temTextoProprio(elemento: Element): boolean {
  return Array.from(elemento.childNodes).some((no) => no.nodeType === 3 && (no.textContent ?? "").trim().length > 0);
}

/* ------------------------------------------------------------------ */
/* A auditoria                                                         */
/* ------------------------------------------------------------------ */

/**
 * Roda todas as verificações sobre a página. `opcoes.tela` escolhe a tela
 * das @media (o modo dispositivo); sem ela, a da prévia.
 */
export function auditar(documento: Document, opcoes: OpcoesCascata = {}): ResultadoAuditoria {
  const ler = leitorDeValores(documento, opcoes);
  const corpo = documento.body;
  const pecas = corpo ? Array.from(corpo.querySelectorAll("*")).filter((elemento) => !ignorada(elemento)) : [];
  const resultado = new Map<IdRegraAuditoria, ProblemaAuditoria | "ok" | "na">();
  const falha = (regra: IdRegraAuditoria, elementos: Element[], detalhes: string[] = []) =>
    resultado.set(regra, elementos.length > 0 || detalhes.length > 0 ? { regra, elementos, detalhes } : "ok");

  /** Escondida pelo CSS (display: none ou visibility: hidden, na peça ou num ancestral)? */
  const escondidas = new Map<Element, boolean>();
  const escondida = (elemento: Element): boolean => {
    const guardada = escondidas.get(elemento);
    if (guardada !== undefined) return guardada;
    const display = ler(elemento, "display");
    const visibilidade = ler(elemento, "visibility");
    const pai = elemento.parentElement;
    const valor =
      (display.tipo === "valor" && display.valor.toLowerCase() === "none") ||
      (visibilidade.tipo === "valor" && visibilidade.valor.toLowerCase() === "hidden") ||
      (pai !== null && pai !== documento.documentElement && escondida(pai));
    escondidas.set(elemento, valor);
    return valor;
  };
  const visiveis = pecas.filter((elemento) => !escondida(elemento));

  // Imagens.
  const imagens = visiveis.filter((elemento) => elemento.tagName === "IMG" || (elemento.tagName === "INPUT" && elemento.getAttribute("type") === "image"));
  if (imagens.length === 0) resultado.set("imagem-sem-alt", "na");
  else falha("imagem-sem-alt", imagens.filter((imagem) => !imagem.hasAttribute("alt")));

  // Links e botões.
  const links = visiveis.filter((elemento) => elemento.tagName === "A" && elemento.hasAttribute("href"));
  if (links.length === 0) {
    resultado.set("link-sem-texto", "na");
    resultado.set("link-generico", "na");
  } else {
    falha("link-sem-texto", links.filter((link) => !temNome(link)));
    falha(
      "link-generico",
      links.filter((link) => LINKS_GENERICOS.has(textoDe(link).toLowerCase().replace(/[.!:]+$/, ""))),
    );
  }
  const botoes = visiveis.filter(
    (elemento) =>
      elemento.tagName === "BUTTON" ||
      elemento.getAttribute("role") === "button" ||
      (elemento.tagName === "INPUT" && ["button", "submit", "reset"].includes(elemento.getAttribute("type") ?? "")),
  );
  if (botoes.length === 0) resultado.set("botao-sem-texto", "na");
  else falha("botao-sem-texto", botoes.filter((botao) => !temNome(botao)));

  // Títulos: cada um sobe no máximo um nível depois do anterior.
  const titulos = visiveis.filter((elemento) => /^H[1-6]$/.test(elemento.tagName));
  if (titulos.length < 2) resultado.set("titulos-pulando-nivel", "na");
  else {
    const pulando: Element[] = [];
    const detalhes: string[] = [];
    titulos.forEach((titulo, indice) => {
      if (indice === 0) return;
      const anterior = Number(titulos[indice - 1].tagName[1]);
      const nivel = Number(titulo.tagName[1]);
      if (nivel > anterior + 1) {
        pulando.push(titulo);
        detalhes.push(`h${anterior} e depois h${nivel}`);
      }
    });
    falha("titulos-pulando-nivel", pulando, detalhes);
  }

  // Contraste: cada peça com texto próprio, a cor do texto contra o primeiro fundo opaco de baixo.
  const comTexto = visiveis.filter(temTextoProprio);
  const ruins: Element[] = [];
  const detalhesContraste: string[] = [];
  let avaliadas = 0;
  for (const elemento of comTexto) {
    const cor = valorOu(ler(elemento, "color"), "#000000");
    if (!cor || !lerCor(cor)) continue;
    let fundo: string | null = "#ffffff";
    for (let atual: Element | null = elemento; atual; atual = atual.parentElement) {
      const imagem = ler(atual, "background-image");
      if (imagem.tipo !== "valor" || imagem.valor.toLowerCase() !== "none") {
        // Imagem ou gradiente no fundo (ou o motor não sabe): o Lighthouse também deixa para conferir à mão.
        if (imagem.tipo === "valor" || !imagem.motivo.startsWith("nada declara")) {
          fundo = null;
          break;
        }
      }
      const valor = valorOu(ler(atual, "background-color"), "transparent");
      if (valor === null) {
        fundo = null;
        break;
      }
      const rgba = lerCor(valor);
      if (rgba && rgba[3] > 0) {
        fundo = valor;
        break;
      }
    }
    if (fundo === null) continue;
    const razao = contrasteEntre(cor, fundo);
    if (razao === null) continue;
    avaliadas++;
    const tamanho = ler(elemento, "font-size");
    const peso = ler(elemento, "font-weight");
    const px = tamanho.tipo === "valor" && /px$/i.test(tamanho.valor) ? Number.parseFloat(tamanho.valor) : 16;
    const negrito = peso.tipo === "valor" && (peso.valor === "bold" || peso.valor === "bolder" || Number(peso.valor) >= 700);
    const grande = px >= 24 || (px >= 18.66 && negrito);
    const minimo = grande ? 3 : CONTRASTE_MINIMO;
    if (razao < minimo) {
      ruins.push(elemento);
      detalhesContraste.push(`${(Math.floor(razao * 10) / 10).toLocaleString("pt-BR")}:1, o mínimo aqui é ${minimo.toLocaleString("pt-BR")}:1`);
    }
  }
  if (avaliadas === 0) resultado.set("contraste", "na");
  else falha("contraste", ruins, detalhesContraste);

  // A página inteira.
  const html = documento.documentElement;
  falha("html-sem-lang", (html.getAttribute("lang") ?? "").trim().length === 0 ? [html] : []);
  falha("pagina-sem-titulo", (documento.querySelector("title")?.textContent ?? "").trim().length === 0 ? [html] : []);
  falha("sem-main", documento.querySelector("main, [role='main']") ? [] : [corpo ?? html]);
  const viewport = documento.querySelector('meta[name="viewport" i]');
  falha("sem-meta-viewport", viewport && /width|initial-scale/i.test(viewport.getAttribute("content") ?? "") ? [] : [html]);
  falha("sem-doctype", documento.doctype?.name.toLowerCase() === "html" ? [] : [html]);
  falha("sem-charset", documento.querySelector("meta[charset], meta[http-equiv='content-type' i]") ? [] : [html]);
  falha("sem-descricao", (documento.querySelector('meta[name="description" i]')?.getAttribute("content") ?? "").trim().length > 0 ? [] : [html]);

  // Ids repetidos (no corpo).
  const porId = new Map<string, Element[]>();
  for (const elemento of pecas) {
    const id = elemento.getAttribute("id");
    if (!id) continue;
    porId.set(id, [...(porId.get(id) ?? []), elemento]);
  }
  const repetidos = [...porId.entries()].filter(([, lista]) => lista.length > 1);
  falha(
    "id-duplicado",
    repetidos.flatMap(([, lista]) => lista.slice(1)),
    repetidos.flatMap(([id, lista]) => lista.slice(1).map(() => `id="${id}" repetido`)),
  );

  // Notas: média pesada das que se aplicam.
  const notas = {} as Record<CategoriaAuditoria, number>;
  for (const { id: categoria } of CATEGORIAS_AUDITORIA) {
    let total = 0;
    let passou = 0;
    for (const regra of IDS_REGRAS_AUDITORIA) {
      const peso = REGRAS_AUDITORIA[regra].pesos[categoria];
      const situacao = resultado.get(regra);
      if (!peso || situacao === "na" || situacao === undefined) continue;
      total += peso;
      if (situacao === "ok") passou += peso;
    }
    notas[categoria] = total === 0 ? 100 : Math.round((passou / total) * 100);
  }

  const problemas: ProblemaAuditoria[] = [];
  const aprovadas: IdRegraAuditoria[] = [];
  const naoSeAplicam: IdRegraAuditoria[] = [];
  for (const regra of IDS_REGRAS_AUDITORIA) {
    const situacao = resultado.get(regra);
    if (situacao === "ok") aprovadas.push(regra);
    else if (situacao === "na" || situacao === undefined) naoSeAplicam.push(regra);
    else problemas.push(situacao);
  }
  return { notas, problemas, aprovadas, naoSeAplicam };
}
