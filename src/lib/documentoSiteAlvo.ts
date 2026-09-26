import { ATRIBUTO_FOLHA_DO_JOGO } from "@/motor/css/cascata";
import { consertarAcentos, quebrarAcentos, temCharset } from "./codificacao";
import { ATRIBUTO_INJETADO, ehDocumentoInteiro, ehTexto, marcarDocumentoInteiro } from "./dom";
import { CLASSE_ESCONDER, ESTILO_ESCONDER, ID_ESTILO_ESCONDER } from "./esconder";

/** Um "</style" dentro do CSS fecharia o <style> antes da hora. */
function protegerCss(css: string): string {
  return css.replace(/<\/style/gi, "<\\/style");
}

/** O <style> editável do site-alvo (a folha "estilo.css" do painel Estilos). */
export function tagFolhaDoJogo(css: string): string {
  // Sem quebra de linha em volta: as linhas do textContent batem com as do editor CSS.
  return `<style ${ATRIBUTO_FOLHA_DO_JOGO}>${protegerCss(css)}</style>`;
}

/**
 * Monta o documento completo que vai no srcdoc do iframe do preview.
 * A folha editável (quando a fase tem CSS) vem depois do head fixo, e a
 * regra de esconder do F12 vai no fim, como o Chrome faz.
 */
export function montarDocumentoSiteAlvo(head: string, body: string, css: string | null = null): string {
  return `<!doctype html>
<html lang="pt-BR">
<head>
${head}
${css !== null ? `${tagFolhaDoJogo(css)}\n` : ""}${ESTILO_ESCONDER}
</head>
<body>
${body}
</body>
</html>`;
}

/** Cria um Document solto (fora da tela) a partir de um body, para comparações. */
export function criarDocumentoSolto(head: string, body: string, css: string | null = null): Document {
  return new DOMParser().parseFromString(montarDocumentoSiteAlvo(head, body, css), "text/html");
}

/** O texto da folha editável no documento, ou null se a fase não tem CSS. */
export function lerCssDoDocumento(documento: Document): string | null {
  const estilo = documento.querySelector(`style[${ATRIBUTO_FOLHA_DO_JOGO}]`);
  return estilo ? (estilo.textContent ?? "") : null;
}

/** Troca o texto da folha editável na hora (sem recarregar a página). */
export function escreverCssNoDocumento(documento: Document, css: string): boolean {
  const estilo = documento.querySelector(`style[${ATRIBUTO_FOLHA_DO_JOGO}]`);
  if (!estilo) return false;
  estilo.textContent = css;
  return true;
}

/* ------------------------------------------------------------------ */
/* Modo documento: o jogador edita o documento inteiro                 */
/* ------------------------------------------------------------------ */

/**
 * O texto inicial do editor numa fase com `modoDocumento`: o documento
 * inteiro (doctype, html, head e body), montado do head e do body do
 * site-alvo. Daqui em diante a fonte de verdade é esse texto.
 */
export function documentoInteiroInicial(head: string, body: string): string {
  const recuar = (texto: string) =>
    texto
      .trim()
      .split("\n")
      .map((linha) => (linha.length > 0 ? `  ${linha}` : linha))
      .join("\n");
  const cabeca = head.trim().length > 0 ? `<head>\n${recuar(head)}\n</head>` : "<head>\n</head>";
  const corpo = body.trim().length > 0 ? `<body>\n${recuar(body)}\n</body>` : "<body>\n</body>";
  return `<!DOCTYPE html>\n<html lang="pt-BR">\n${cabeca}\n${corpo}\n</html>`;
}

/** Documentos em que os acentos foram quebrados de propósito (sem meta charset). */
const DOCUMENTOS_QUEBRADOS = new WeakSet<Document>();

/** Os acentos da prévia estão quebrados (simulação de página sem meta charset)? */
export function acentosQuebrados(documento: Document): boolean {
  return DOCUMENTOS_QUEBRADOS.has(documento);
}

function textosDaPagina(documento: Document): Text[] {
  const textos: Text[] = [];
  const visitar = (no: Node) => {
    for (const filho of Array.from(no.childNodes)) {
      if (ehTexto(filho)) textos.push(filho);
      // O texto do <style> e do <script> não é texto da página.
      else if (filho.nodeType === 1 && !["style", "script"].includes((filho as Element).tagName.toLowerCase())) visitar(filho);
    }
  };
  visitar(documento.documentElement);
  return textos;
}

/**
 * Depois de carregar (ou de parsear, na simulação) um documento inteiro:
 * põe os estilos do jogo no head (a regra do esconder e, se a fase tem
 * CSS, a folha editável), escondidos da árvore e do código, e simula os
 * acentos quebrados se a página não declara a codificação.
 *
 * Por que simular: num site de verdade, sem `<meta charset="utf-8">` o
 * navegador pode ler os bytes UTF-8 como Windows-1252 ("Cartão" vira
 * "CartÃ£o"). A prévia usa srcdoc, que já é texto (não há bytes para
 * decodificar), então isso não acontece sozinho (ver lib/codificacao.ts).
 */
export function prepararDocumentoInteiro(documento: Document, css: string | null): void {
  marcarDocumentoInteiro(documento);
  const head = documento.head ?? documento.documentElement.insertBefore(documento.createElement("head"), documento.body);
  if (css !== null && !documento.querySelector(`style[${ATRIBUTO_FOLHA_DO_JOGO}]`)) {
    const folha = documento.createElement("style");
    folha.setAttribute(ATRIBUTO_FOLHA_DO_JOGO, "");
    folha.setAttribute(ATRIBUTO_INJETADO, "");
    folha.textContent = css;
    head.appendChild(folha);
  }
  if (!documento.getElementById(ID_ESTILO_ESCONDER)) {
    const esconder = documento.createElement("style");
    esconder.id = ID_ESTILO_ESCONDER;
    esconder.setAttribute(ATRIBUTO_INJETADO, "");
    esconder.textContent = `\n.${CLASSE_ESCONDER}, .${CLASSE_ESCONDER} * { visibility: hidden !important; }\n`;
    head.appendChild(esconder);
  }
  atualizarAcentos(documento);
}

/**
 * Quebra os acentos se a página não declara a codificação, ou conserta se
 * passou a declarar (o meta charset entrou ou saiu por uma edição).
 */
export function atualizarAcentos(documento: Document): void {
  const quebrar = !temCharset(documento);
  if (quebrar === acentosQuebrados(documento)) return;
  for (const texto of textosDaPagina(documento)) {
    const valor = texto.nodeValue ?? "";
    texto.nodeValue = quebrar ? quebrarAcentos(valor) : consertarAcentos(valor);
  }
  if (quebrar) DOCUMENTOS_QUEBRADOS.add(documento);
  else DOCUMENTOS_QUEBRADOS.delete(documento);
}

/**
 * O texto de um nó como o jogador escreveu: com os acentos de volta se a
 * prévia está simulando a quebra (os validadores olham o texto de verdade;
 * a quebra é só o que a tela mostra).
 */
export function textoVerdadeiro(no: Node): string {
  const documento = no.ownerDocument;
  if (!documento || !acentosQuebrados(documento)) return no.textContent ?? "";
  if (ehTexto(no)) return consertarAcentos(no.nodeValue ?? "");
  let texto = "";
  for (const filho of Array.from(no.childNodes)) texto += textoVerdadeiro(filho);
  return texto;
}

/** A cópia do <html> sem o que o jogo pôs na página e com os acentos de volta. */
function htmlLimpo(documento: Document): Element {
  const copia = documento.documentElement.cloneNode(true) as Element;
  for (const injetado of Array.from(copia.querySelectorAll(`[${ATRIBUTO_INJETADO}]`))) injetado.remove();
  if (acentosQuebrados(documento)) {
    const visitar = (no: Node) => {
      for (const filho of Array.from(no.childNodes)) {
        if (ehTexto(filho)) filho.nodeValue = consertarAcentos(filho.nodeValue ?? "");
        else visitar(filho);
      }
    };
    visitar(copia);
  }
  return copia;
}

/**
 * A foto do desfazer: o HTML de dentro do body ou, no modo documento, o
 * <html> inteiro (com os atributos dele, como o lang), limpo. Volta com
 * restaurarRaiz.
 */
export function fotografarRaiz(documento: Document): string {
  return ehDocumentoInteiro(documento) ? htmlLimpo(documento).outerHTML : documento.body.innerHTML;
}

/** Volta uma foto de fotografarRaiz (no modo documento, os estilos do jogo e os acentos voltam também). */
export function restaurarRaiz(documento: Document, html: string): void {
  if (!ehDocumentoInteiro(documento)) {
    documento.body.innerHTML = html;
    return;
  }
  const css = lerCssDoDocumento(documento);
  const lido = new DOMParser().parseFromString(`<!DOCTYPE html>${html}`, "text/html").documentElement;
  const raiz = documento.documentElement;
  for (const atributo of Array.from(raiz.attributes)) raiz.removeAttribute(atributo.name);
  for (const atributo of Array.from(lido.attributes)) raiz.setAttribute(atributo.name, atributo.value);
  raiz.innerHTML = lido.innerHTML;
  // O texto da foto é o certo: a quebra (se ainda valer) é refeita agora.
  DOCUMENTOS_QUEBRADOS.delete(documento);
  prepararDocumentoInteiro(documento, css);
}

/**
 * O texto do documento inteiro, como vai para o editor: sem o que o jogo
 * pôs na página e com os acentos de volta (a quebra é só da prévia).
 */
export function serializarDocumentoInteiro(documento: Document): string {
  const doctype = documento.doctype ? `<!DOCTYPE ${documento.doctype.name}>\n` : "";
  return `${doctype}${htmlLimpo(documento).outerHTML}`;
}

/** Um documento inteiro solto (testes, simulação), já preparado como a prévia. */
export function criarDocumentoInteiroSolto(texto: string, css: string | null = null): Document {
  const documento = new DOMParser().parseFromString(texto, "text/html");
  prepararDocumentoInteiro(documento, css);
  return documento;
}
