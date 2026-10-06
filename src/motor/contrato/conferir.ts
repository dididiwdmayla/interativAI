/*
 * As checagens dos dados de um contrato (o testar:conteudo roda): o cliente
 * do kit, o briefing e o documento com cara de cliente de verdade (dentro dos
 * limites), os cartões (pedidos de verdade ligados às partes, distrações e
 * lacunas), a mudança de pedido (parte nova que existe, troca de uma parte
 * antiga) e a entrega. A simulação do contrato inteiro (o antes e o depois
 * da mudança) mora em src/conteudo/checagens.ts (jogarContrato).
 */
import { cenaDaFase } from "../composicao";
import { ehIdCliente } from "./clientes";
import { programaParaLevar } from "./levarProMundo";
import { ehExpressaoCliente } from "./expressoes";
import { type FalaCliente, type FaseContrato, idsDasNovas, MARCA_LACUNA } from "./modelo";

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const LIMITES_CONTRATO = {
  fala: 160,
  projeto: 40,
  tituloDocumento: 60,
  paragrafo: 320,
  cartao: 110,
  porque: 160,
  briefing: [2, 8],
  paragrafos: [1, 8],
  mensagem: [1, 4],
  reacao: [1, 4],
  reais: 2,
  sobras: 2,
  opcoes: [2, 4],
  cartoes: 12,
} as const;

function conferirFalas(falas: readonly FalaCliente[], onde: string, [minimo, maximo]: readonly [number, number]): string[] {
  const problemas: string[] = [];
  if (falas.length < minimo || falas.length > maximo) problemas.push(`${onde}: ${falas.length} fala(s) (de ${minimo} a ${maximo})`);
  falas.forEach((fala, indice) => {
    if (!fala.texto.trim()) problemas.push(`${onde} ${indice + 1}: fala vazia`);
    if (fala.texto.length > LIMITES_CONTRATO.fala) problemas.push(`${onde} ${indice + 1}: fala com ${fala.texto.length} caracteres (máximo ${LIMITES_CONTRATO.fala})`);
    if (!ehExpressaoCliente(fala.expressao)) problemas.push(`${onde} ${indice + 1}: expressão "${String(fala.expressao)}" não existe (feliz, pensativo, preocupado, empolgado, satisfeito)`);
  });
  return problemas;
}

export function conferirContrato(fase: FaseContrato): string[] {
  const { contrato } = fase;
  const problemas: string[] = [];
  const partes = new Map(fase.partes.map((parte) => [parte.id, parte]));
  const novas = idsDasNovas(contrato);

  if (!ehIdCliente(contrato.cliente)) problemas.push(`o cliente "${String(contrato.cliente)}" não existe no kit (src/motor/contrato/clientes.ts)`);
  if (!contrato.projeto.trim() || contrato.projeto.length > LIMITES_CONTRATO.projeto) problemas.push(`projeto "${contrato.projeto}": de 1 a ${LIMITES_CONTRATO.projeto} caracteres`);
  problemas.push(...conferirFalas(contrato.briefing, "briefing", LIMITES_CONTRATO.briefing));
  problemas.push(...conferirFalas(contrato.mudanca.mensagem, "mudanca.mensagem", LIMITES_CONTRATO.mensagem));
  problemas.push(...conferirFalas(contrato.entrega.reacao, "entrega.reacao", LIMITES_CONTRATO.reacao));

  const { documento } = contrato;
  if (!documento.titulo.trim() || documento.titulo.length > LIMITES_CONTRATO.tituloDocumento) problemas.push(`documento.titulo: de 1 a ${LIMITES_CONTRATO.tituloDocumento} caracteres`);
  const [minParagrafos, maxParagrafos] = LIMITES_CONTRATO.paragrafos;
  if (documento.paragrafos.length < minParagrafos || documento.paragrafos.length > maxParagrafos) problemas.push(`documento: ${documento.paragrafos.length} parágrafo(s) (de ${minParagrafos} a ${maxParagrafos})`);
  for (const [indice, paragrafo] of [...documento.paragrafos, contrato.mudanca.adendo].entries()) {
    const onde = indice < documento.paragrafos.length ? `documento.paragrafos[${indice}]` : "mudanca.adendo";
    if (!paragrafo.trim()) problemas.push(`${onde}: vazio`);
    if (paragrafo.length > LIMITES_CONTRATO.paragrafo) problemas.push(`${onde}: ${paragrafo.length} caracteres (máximo ${LIMITES_CONTRATO.paragrafo})`);
  }

  /* Os cartões */
  const { cartoes } = contrato.requisitos;
  const ids = new Set<string>();
  const partesComCartao = new Set<string>();
  if (cartoes.length > LIMITES_CONTRATO.cartoes) problemas.push(`${cartoes.length} cartões (máximo ${LIMITES_CONTRATO.cartoes}: cabe no celular)`);
  for (const cartao of cartoes) {
    const onde = `cartão "${cartao.id}"`;
    if (!KEBAB.test(cartao.id)) problemas.push(`${onde}: id fora de kebab-case`);
    if (ids.has(cartao.id)) problemas.push(`${onde}: id repetido`);
    ids.add(cartao.id);
    const lacunas = cartao.lacunas ?? [];
    const marcas = cartao.texto.split(MARCA_LACUNA).length - 1;
    if (marcas !== lacunas.length) problemas.push(`${onde}: ${marcas} lacuna(s) no texto (${MARCA_LACUNA}) e ${lacunas.length} em lacunas`);
    const maisLongo = cartao.texto.replaceAll(MARCA_LACUNA, "").length + lacunas.reduce((soma, lacuna) => soma + Math.max(0, ...lacuna.opcoes.map((opcao) => opcao.length)), 0);
    if (maisLongo > LIMITES_CONTRATO.cartao) problemas.push(`${onde}: texto com até ${maisLongo} caracteres preenchido (máximo ${LIMITES_CONTRATO.cartao})`);
    lacunas.forEach((lacuna, indice) => {
      const [minimo, maximo] = LIMITES_CONTRATO.opcoes;
      if (lacuna.opcoes.length < minimo || lacuna.opcoes.length > maximo) problemas.push(`${onde}: a lacuna ${indice + 1} tem ${lacuna.opcoes.length} opções (de ${minimo} a ${maximo})`);
      if (new Set(lacuna.opcoes).size !== lacuna.opcoes.length) problemas.push(`${onde}: a lacuna ${indice + 1} tem opções repetidas`);
      if (!Number.isInteger(lacuna.correta) || lacuna.correta < 0 || lacuna.correta >= lacuna.opcoes.length) problemas.push(`${onde}: a lacuna ${indice + 1} tem correta fora das opções`);
    });
    if (!cartao.porque.trim() || cartao.porque.length > LIMITES_CONTRATO.porque) problemas.push(`${onde}: porque de 1 a ${LIMITES_CONTRATO.porque} caracteres`);
    if (cartao.sobra) {
      if (cartao.parte) problemas.push(`${onde}: distração (sobra) não aponta parte`);
      if (lacunas.length) problemas.push(`${onde}: distração não tem lacuna`);
      continue;
    }
    if (!cartao.parte) {
      problemas.push(`${onde}: cartão de verdade precisa da parte que ele vira (ou sobra: true)`);
      continue;
    }
    if (!partes.has(cartao.parte)) problemas.push(`${onde}: a parte "${cartao.parte}" não existe`);
    else if (novas.has(cartao.parte)) problemas.push(`${onde}: a parte "${cartao.parte}" só existe depois da mudança (cartões são do pedido do começo)`);
    if (partesComCartao.has(cartao.parte)) problemas.push(`${onde}: outro cartão já vira a parte "${cartao.parte}"`);
    partesComCartao.add(cartao.parte);
  }
  const reais = cartoes.filter((cartao) => !cartao.sobra).length;
  const sobras = cartoes.length - reais;
  if (reais < LIMITES_CONTRATO.reais) problemas.push(`${reais} cartão(ões) de verdade (pelo menos ${LIMITES_CONTRATO.reais})`);
  if (sobras < LIMITES_CONTRATO.sobras) problemas.push(`${sobras} distração(ões) (pelo menos ${LIMITES_CONTRATO.sobras}: é o que faz o aluno pensar "o que ele pediu de verdade?")`);
  if (!cartoes.some((cartao) => cartao.lacunas?.length)) problemas.push("nenhum cartão tem lacuna: complete pelo menos uma coisa que o aluno acha lendo o documento");

  /* A mudança de pedido */
  const { mudanca } = contrato;
  if (!mudanca.depoisDe.length) problemas.push("mudanca.depoisDe vazio: a mensagem chega depois de alguma parte pronta");
  for (const id of mudanca.depoisDe) {
    if (!partes.has(id)) problemas.push(`mudanca.depoisDe: a parte "${id}" não existe`);
    else if (novas.has(id)) problemas.push(`mudanca.depoisDe: a parte "${id}" só existe depois da mudança`);
  }
  if (!mudanca.novas.length) problemas.push("mudanca.novas vazio: a mudança precisa de pelo menos uma parte nova (ou que troca uma antiga)");
  const trocadas = new Set<string>();
  for (const nova of mudanca.novas) {
    if (!partes.has(nova.parte)) problemas.push(`mudanca.novas: a parte "${nova.parte}" não existe em partes`);
    if (nova.substitui !== undefined) {
      if (!partes.has(nova.substitui)) problemas.push(`mudanca.novas: "${nova.parte}" substitui "${nova.substitui}", que não existe`);
      else if (novas.has(nova.substitui)) problemas.push(`mudanca.novas: "${nova.parte}" substitui "${nova.substitui}", que também é nova`);
      if (trocadas.has(nova.substitui)) problemas.push(`mudanca.novas: "${nova.substitui}" é substituída duas vezes`);
      trocadas.add(nova.substitui);
    }
  }
  // As novas vêm no fim das partes: a meta (o "depois") aplica as soluções em ordem e termina com o código da mudança.
  const ultimaOriginal = fase.partes.reduce((ultima, parte, indice) => (novas.has(parte.id) ? ultima : indice), -1);
  const primeiraNova = fase.partes.findIndex((parte) => novas.has(parte.id));
  if (primeiraNova >= 0 && primeiraNova < ultimaOriginal) problemas.push("as partes novas (da mudança) vêm depois de todas as do começo, no fim de partes");

  /* As perguntas do colega e o Levar pro mundo */
  for (const parte of fase.partes) {
    if (!parte.pergunta?.trim()) problemas.push(`parte "${parte.id}": num contrato, toda parte tem a pergunta do colega de trabalho`);
    else if (parte.pergunta.length > LIMITES_CONTRATO.fala) problemas.push(`parte "${parte.id}": pergunta com ${parte.pergunta.length} caracteres (máximo ${LIMITES_CONTRATO.fala})`);
  }
  if (contrato.levarProMundo) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*\.js$/.test(contrato.levarProMundo.arquivo)) problemas.push(`levarProMundo.arquivo "${contrato.levarProMundo.arquivo}": nome em kebab-case terminando em .js`);
    if (!fase.programa?.snippet) problemas.push("levarProMundo precisa de programa.snippet (é o código do aluno que sai do jogo)");
    // O arquivo leva todos os aparelhos da cena: um que o exportador não sabe levar tira o botão (guia, seção 31.8).
    try {
      programaParaLevar({ contrato, cena: cenaDaFase(fase), codigo: fase.programa?.snippet?.codigoInicial ?? "" });
    } catch (erro) {
      problemas.push(`levarProMundo: ${erro instanceof Error ? erro.message : String(erro)} Sem isso, o contrato não oferece o botão (tire o levarProMundo).`);
    }
  }
  return problemas;
}
