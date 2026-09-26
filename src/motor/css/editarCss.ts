/*
 * Edições no texto de uma folha de estilo, sem bagunçar a formatação de
 * quem escreveu. Cada função recebe o texto e devolve o texto novo (ou null
 * quando não dá). O painel Estilos, as ações declarativas e os testes usam
 * as mesmas funções.
 *
 * Desligar uma declaração é igual ao Chrome: ela vira um comentário
 * (`/* color: red; *\/`), e ligar tira o comentário
 * (devtools-frontend, CSSProperty.setDisabled).
 */
import { analisarCss, type Declaracao, type FolhaAnalisada, type Regra } from "./analisarCss";
import { normalizarSeletor } from "./cascata";

/** Onde uma declaração mora: a regra (pela posição na folha) e a declaração dentro dela. */
export type RefDeclaracao = { indiceRegra: number; indiceDeclaracao: number };

function trocar(texto: string, inicio: number, fim: number, novo: string): string {
  return texto.slice(0, inicio) + novo + texto.slice(fim);
}

/** A primeira regra com esse seletor (comparado sem ligar para espaços). */
export function acharRegra(folha: FolhaAnalisada, seletorRegra: string): { regra: Regra; indice: number } | null {
  const alvo = normalizarSeletor(seletorRegra);
  const indice = folha.regras.findIndex((regra) => normalizarSeletor(regra.seletor) === alvo);
  return indice >= 0 ? { regra: folha.regras[indice], indice } : null;
}

/** A última declaração de uma propriedade na regra (a que vale, se houver repetida). */
export function acharDeclaracao(regra: Regra, propriedade: string, opcoes: { ativa?: boolean } = {}): number {
  const nome = propriedade.startsWith("--") ? propriedade : propriedade.toLowerCase();
  for (let i = regra.declaracoes.length - 1; i >= 0; i--) {
    const declaracao = regra.declaracoes[i];
    if (declaracao.propriedade !== nome) continue;
    if (opcoes.ativa !== undefined && declaracao.ativa !== opcoes.ativa) continue;
    return i;
  }
  return -1;
}

function declaracaoDe(folha: FolhaAnalisada, ref: RefDeclaracao): Declaracao | null {
  return folha.regras[ref.indiceRegra]?.declaracoes[ref.indiceDeclaracao] ?? null;
}

/** Recuo das declarações da regra (o da primeira, ou dois espaços). */
function recuoDaRegra(texto: string, regra: Regra): string {
  const primeira = regra.declaracoes[0];
  if (!primeira) return "  ";
  const inicioLinha = texto.lastIndexOf("\n", primeira.inicio - 1) + 1;
  const antes = texto.slice(inicioLinha, primeira.inicio);
  return /^\s*$/.test(antes) ? antes : "  ";
}

/** Troca o valor (bruto: pode vir com !important). Valor vazio não serve. */
export function trocarValor(texto: string, ref: RefDeclaracao, novoValor: string): string | null {
  const folha = analisarCss(texto);
  const declaracao = declaracaoDe(folha, ref);
  const valor = novoValor.trim();
  if (!declaracao || !declaracao.ativa || valor.length === 0) return null;
  return trocar(texto, declaracao.inicioValor, declaracao.fimValor, valor);
}

/** Troca o nome da propriedade. */
export function trocarNome(texto: string, ref: RefDeclaracao, novoNome: string): string | null {
  const folha = analisarCss(texto);
  const declaracao = declaracaoDe(folha, ref);
  const nome = novoNome.trim();
  if (!declaracao || !declaracao.ativa || !/^-{0,2}[a-zA-Z_][a-zA-Z0-9_-]*$/.test(nome)) return null;
  return trocar(texto, declaracao.inicioNome, declaracao.fimNome, nome);
}

/** Liga ou desliga a declaração (comentário, como a checkbox do Chrome). */
export function alternarDeclaracaoNoTexto(texto: string, ref: RefDeclaracao): string | null {
  const folha = analisarCss(texto);
  const declaracao = declaracaoDe(folha, ref);
  if (!declaracao) return null;
  const nome = texto.slice(declaracao.inicioNome, declaracao.fimNome);
  const valor = texto.slice(declaracao.inicioValor, declaracao.fimValor);
  const linha = `${nome}: ${valor};`;
  return trocar(texto, declaracao.inicio, declaracao.fim, declaracao.ativa ? `/* ${linha} */` : linha);
}

/** Apaga a declaração (e a linha dela, se ficar vazia). */
export function removerDeclaracao(texto: string, ref: RefDeclaracao): string | null {
  const folha = analisarCss(texto);
  const declaracao = declaracaoDe(folha, ref);
  if (!declaracao) return null;
  const inicioLinha = texto.lastIndexOf("\n", declaracao.inicio - 1) + 1;
  const fimLinha = texto.indexOf("\n", declaracao.fim);
  const antes = texto.slice(inicioLinha, declaracao.inicio);
  const depois = texto.slice(declaracao.fim, fimLinha < 0 ? texto.length : fimLinha);
  if (/^\s*$/.test(antes) && /^\s*$/.test(depois)) {
    return trocar(texto, inicioLinha, fimLinha < 0 ? texto.length : fimLinha + 1, "");
  }
  return trocar(texto, declaracao.inicio, declaracao.fim, "").replace(/[ \t]{2,}/g, " ");
}

/**
 * Acrescenta `propriedade: valor;` no fim da regra (numa linha nova, com o
 * recuo das outras). Devolve o texto e a referência da declaração nova.
 */
export function adicionarDeclaracaoNoTexto(
  texto: string,
  indiceRegra: number,
  propriedade: string,
  valor: string,
): { texto: string; ref: RefDeclaracao } | null {
  const folha = analisarCss(texto);
  const regra = folha.regras[indiceRegra];
  const nome = propriedade.trim();
  if (!regra || !/^-{0,2}[a-zA-Z_][a-zA-Z0-9_-]*$/.test(nome) || valor.trim().length === 0) return null;
  const recuo = recuoDaRegra(texto, regra);
  const ultima = regra.declaracoes[regra.declaracoes.length - 1];
  let novo = texto;
  let posicao: number;
  if (ultima) {
    posicao = ultima.fim;
    if (ultima.ativa && !ultima.temPontoEVirgula) {
      novo = trocar(novo, ultima.fim, ultima.fim, ";");
      posicao += 1;
    }
  } else {
    posicao = regra.inicioCorpo;
  }
  const linha = `\n${recuo}${nome}: ${valor.trim()};`;
  novo = trocar(novo, posicao, posicao, linha);
  // O } fica na linha dele.
  const fechamento = posicao + linha.length;
  const resto = novo.slice(fechamento);
  const soEspacoAteChave = /^[ \t]*\}/.exec(resto);
  if (soEspacoAteChave) novo = trocar(novo, fechamento, fechamento + soEspacoAteChave[0].length - 1, "\n");
  const indiceDeclaracao = regra.declaracoes.length;
  return { texto: novo, ref: { indiceRegra, indiceDeclaracao } };
}

/** Acrescenta uma regra nova no fim da folha. Devolve o texto e o índice dela. */
export function adicionarRegraNoTexto(
  texto: string,
  seletor: string,
  declaracoes: readonly { propriedade: string; valor: string }[] = [],
): { texto: string; indiceRegra: number } | null {
  const alvo = seletor.trim();
  if (alvo.length === 0 || /[{}]/.test(alvo)) return null;
  const corpo = declaracoes.map((item) => `  ${item.propriedade.trim()}: ${item.valor.trim()};\n`).join("");
  const base = texto.replace(/\s+$/, "");
  const separador = base.length > 0 ? "\n\n" : "";
  const novo = `${base}${separador}${alvo} {\n${corpo}}\n`;
  return { texto: novo, indiceRegra: analisarCss(novo).regras.length - 1 };
}

/**
 * Define uma propriedade numa regra, como a edição do painel: se a regra
 * já tem a propriedade ligada, troca o valor da última; se não, acrescenta.
 */
export function definirPropriedadeNoTexto(texto: string, seletorRegra: string, propriedade: string, valor: string): string | null {
  const folha = analisarCss(texto);
  const achada = acharRegra(folha, seletorRegra);
  if (!achada) return null;
  const indiceDeclaracao = acharDeclaracao(achada.regra, propriedade, { ativa: true });
  if (indiceDeclaracao >= 0) return trocarValor(texto, { indiceRegra: achada.indice, indiceDeclaracao }, valor);
  return adicionarDeclaracaoNoTexto(texto, achada.indice, propriedade, valor)?.texto ?? null;
}

/** Liga ou desliga a (última) declaração da propriedade na regra. */
export function alternarPropriedadeNoTexto(texto: string, seletorRegra: string, propriedade: string): string | null {
  const folha = analisarCss(texto);
  const achada = acharRegra(folha, seletorRegra);
  if (!achada) return null;
  const indiceDeclaracao = acharDeclaracao(achada.regra, propriedade);
  if (indiceDeclaracao < 0) return null;
  return alternarDeclaracaoNoTexto(texto, { indiceRegra: achada.indice, indiceDeclaracao });
}

/**
 * O seletor que o Chrome sugere para uma regra nova do elemento
 * (devtools-frontend, DOMNode.simpleSelector): tag#id; senão
 * tag.classe1.classe2 (sem o "div" na frente); senão só a tag.
 */
export function seletorSimples(elemento: Element): string {
  const tag = elemento.tagName.toLowerCase();
  const escapar = (texto: string) => texto.replace(/([^a-zA-Z0-9_\- -￿])/g, "\\$1");
  const tipo = elemento.getAttribute("type");
  const id = elemento.getAttribute("id");
  const classes = (elemento.getAttribute("class") ?? "")
    .trim()
    .split(/\s+/)
    .filter((classe) => classe.length > 0 && !classe.startsWith("__web-inspector"));
  if (tag === "input" && tipo && !id && classes.length === 0) return `${tag}[type="${tipo}"]`;
  if (id) return `${tag}#${escapar(id)}`;
  if (classes.length > 0) return `${tag === "div" ? "" : tag}.${classes.map(escapar).join(".")}`;
  return tag;
}

/** Escreve CSS no começo ou no fim da folha (o que o jogador digitaria no editor). */
export function escreverNoTexto(texto: string, posicao: "inicio" | "fim", trecho: string): string {
  const novo = trecho.trim();
  if (posicao === "inicio") return `${novo}\n\n${texto.replace(/^\s+/, "")}`;
  const base = texto.replace(/\s+$/, "");
  return `${base}${base.length > 0 ? "\n\n" : ""}${novo}\n`;
}

/**
 * Edita o texto de um atributo style com as mesmas funções da folha: o
 * estilo vira o corpo de uma regra de mentirinha, a função mexe nela, e o
 * corpo volta numa linha só. `editar` recebe o CSS embrulhado (a regra é
 * a de índice 0).
 */
export function editarEstiloInlineNoTexto(estilo: string, editar: (css: string) => string | null): string | null {
  const envolto = `x{${estilo}}`;
  const novo = editar(envolto);
  if (novo === null) return null;
  const regra = analisarCss(novo).regras[0];
  if (!regra) return null;
  return novo
    .slice(regra.inicioCorpo, regra.fimCorpo)
    .replace(/\s*\n\s*/g, " ")
    .trim();
}
