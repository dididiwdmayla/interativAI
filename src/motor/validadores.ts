/*
 * Interpretador dos validadores declarativos (src/conteudo/tipos.ts).
 * Funciona com o documento vivo do iframe, com um Document solto
 * (DOMParser) e com o jsdom dos testes: só usa APIs comuns de DOM.
 */
import { VALIDADORES_CUSTOM } from "@/conteudo/validadoresCustom";
import type { FaseDesafio, OperadorContagem, Validador, ViaSelecao } from "@/conteudo/tipos";
import { elementoDoNo } from "@/lib/arvore";
import { estaEscondido } from "@/lib/esconder";
import type { EventoFase } from "./eventos";

/** O que um validador pode olhar. */
export type ContextoValidacao = {
  /** Documento atual do site-alvo. */
  documento: Document;
  /** Documento solto com o estado inicial da fase, para comparar. */
  inicial: Document;
  /** Nó selecionado e por onde foi escolhido. */
  selecao: { no: Node; via: ViaSelecao | null } | null;
  /** Eventos desde que o objetivo (ou o desafio) começou. */
  eventos: readonly EventoFase[];
};

export type ResultadoValidador = {
  passou: boolean;
  /** Frase curta do que foi conferido, para o /lab/fases e os testes. */
  descricao: string;
  /** O que foi encontrado, quando ajuda a entender uma falha. */
  detalhe?: string;
  filhos?: ResultadoValidador[];
};

/** Espaços nas pontas fora e espaços repetidos virando um só. */
export function normalizarTexto(texto: string | null | undefined): string {
  return (texto ?? "").replace(/\s+/g, " ").trim();
}

/** Elementos do seletor. Seletor inválido não acha nada (os testes acusam antes). */
export function consultar(raiz: Document | Element, seletor: string): Element[] {
  try {
    return Array.from(raiz.querySelectorAll(seletor));
  } catch {
    return [];
  }
}

function casa(elemento: Element, seletor: string): boolean {
  try {
    return elemento.matches(seletor);
  } catch {
    return false;
  }
}

function comparar(quantidade: number, op: OperadorContagem, valor: number): boolean {
  switch (op) {
    case "==":
      return quantidade === valor;
    case ">=":
      return quantidade >= valor;
    case "<=":
      return quantidade <= valor;
    case ">":
      return quantidade > valor;
    case "<":
      return quantidade < valor;
  }
}

function textosDe(elementos: readonly Element[]): string[] {
  return elementos.map((elemento) => normalizarTexto(elemento.textContent));
}

function lista(itens: readonly string[]): string {
  return itens.length === 0 ? "nenhum" : itens.map((item) => `"${item}"`).join(", ");
}

/** Descrição curta de um validador, em PT-BR. */
export function descreverValidador(validador: Validador): string {
  switch (validador.tipo) {
    case "existe":
      return `existe ${validador.seletor}`;
    case "naoExiste":
      return `não existe ${validador.seletor}`;
    case "contagem":
      return `quantidade de ${validador.seletor}${validador.comTexto ? " (com texto)" : ""} ${validador.op} ${validador.valor}`;
    case "textoIgual":
      return `texto de ${validador.seletor} igual a "${validador.valor}"`;
    case "textoDiferenteDoInicial":
      return `texto novo em ${validador.seletor}${validador.minimo && validador.minimo > 1 ? ` (pelo menos ${validador.minimo})` : ""}`;
    case "textoNaoVazio":
      return `${validador.seletor} tem texto`;
    case "atributo":
      return `${validador.seletor} tem ${validador.nome}${validador.valor !== undefined ? `="${validador.valor}"` : ""}`;
    case "escondido":
      return `${validador.seletor} escondido (mantendo o espaço)`;
    case "selecionado":
      return `selecionado ${validador.seletor}${validador.via ? ` pela via ${validador.via}` : ""}`;
    case "evento":
      return `evento ${validador.evento} pelo menos ${validador.minimo ?? 1} vez(es)`;
    case "todos":
      return "todos estes";
    case "algum":
      return "algum destes";
    case "nao":
      return "não pode acontecer";
    case "custom":
      return `validador custom "${validador.id}"`;
  }
}

/** Avalia um validador e explica o resultado (com os filhos, nos compostos). */
export function avaliarDetalhado(validador: Validador, contexto: ContextoValidacao): ResultadoValidador {
  const descricao = descreverValidador(validador);
  const { documento, inicial } = contexto;

  switch (validador.tipo) {
    case "existe": {
      const achados = consultar(documento, validador.seletor).length;
      return { passou: achados > 0, descricao, detalhe: `achou ${achados}` };
    }
    case "naoExiste": {
      const achados = consultar(documento, validador.seletor).length;
      return { passou: achados === 0, descricao, detalhe: `achou ${achados}` };
    }
    case "contagem": {
      let elementos = consultar(documento, validador.seletor);
      if (validador.comTexto) elementos = elementos.filter((elemento) => normalizarTexto(elemento.textContent).length > 0);
      const quantidade = elementos.length;
      return { passou: comparar(quantidade, validador.op, validador.valor), descricao, detalhe: `achou ${quantidade}` };
    }
    case "textoIgual": {
      const textos = textosDe(consultar(documento, validador.seletor));
      const alvo = normalizarTexto(validador.valor);
      return { passou: textos.includes(alvo), descricao, detalhe: `textos: ${lista(textos)}` };
    }
    case "textoDiferenteDoInicial": {
      const antes = new Set(textosDe(consultar(inicial, validador.seletor)));
      const novos = new Set(
        textosDe(consultar(documento, validador.seletor)).filter((texto) => texto.length > 0 && !antes.has(texto)),
      );
      return {
        passou: novos.size >= (validador.minimo ?? 1),
        descricao,
        detalhe: `textos novos: ${lista([...novos])}`,
      };
    }
    case "textoNaoVazio": {
      const textos = textosDe(consultar(documento, validador.seletor));
      return { passou: textos.some((texto) => texto.length > 0), descricao, detalhe: `textos: ${lista(textos)}` };
    }
    case "atributo": {
      const elementos = consultar(documento, validador.seletor);
      const valores = elementos
        .map((elemento) => elemento.getAttribute(validador.nome))
        .filter((valor): valor is string => valor !== null);
      const passou =
        validador.valor === undefined
          ? valores.length > 0
          : valores.some((valor) => valor.trim() === validador.valor?.trim());
      return { passou, descricao, detalhe: `valores: ${lista(valores)}` };
    }
    case "escondido": {
      const elementos = consultar(documento, validador.seletor);
      const escondidos = elementos.filter(estaEscondido).length;
      return {
        passou: escondidos > 0,
        descricao,
        detalhe: `achou ${elementos.length}, escondidos ${escondidos}`,
      };
    }
    case "selecionado": {
      const selecao = contexto.selecao;
      const elemento = elementoDoNo(selecao?.no ?? null);
      const nome = elemento ? elemento.tagName.toLowerCase() : "nada";
      const passouSeletor = elemento !== null && casa(elemento, validador.seletor);
      const passouVia = validador.via === undefined || selecao?.via === validador.via;
      return {
        passou: passouSeletor && passouVia,
        descricao,
        detalhe: `selecionado: ${nome}${selecao ? ` pela via ${selecao.via ?? "sistema"}` : ""}`,
      };
    }
    case "evento": {
      const vezes = contexto.eventos.filter((evento) => evento.tipo === validador.evento).length;
      return { passou: vezes >= (validador.minimo ?? 1), descricao, detalhe: `aconteceu ${vezes} vez(es)` };
    }
    case "todos": {
      const filhos = validador.validadores.map((filho) => avaliarDetalhado(filho, contexto));
      return { passou: filhos.every((filho) => filho.passou), descricao, filhos };
    }
    case "algum": {
      const filhos = validador.validadores.map((filho) => avaliarDetalhado(filho, contexto));
      return { passou: filhos.some((filho) => filho.passou), descricao, filhos };
    }
    case "nao": {
      const filho = avaliarDetalhado(validador.validador, contexto);
      return { passou: !filho.passou, descricao, filhos: [filho] };
    }
    case "custom": {
      const funcao = VALIDADORES_CUSTOM[validador.id];
      if (!funcao) return { passou: false, descricao, detalhe: "não registrado" };
      let passou = false;
      try {
        passou = funcao(contexto);
      } catch {
        passou = false;
      }
      return { passou, descricao };
    }
  }
}

export function avaliarValidador(validador: Validador, contexto: ContextoValidacao): boolean {
  return avaliarDetalhado(validador, contexto).passou;
}

/**
 * Uma parte do desafio TRAVA (fica marcada mesmo desfazendo) quando o
 * validador depende de seleção ou de evento: são momentos, não estado da
 * página, e o motor não tem como "voltar" para eles. As demais (existe,
 * naoExiste, escondido, contagem, atributo, texto...) são AVALIADAS AO VIVO:
 * se o jogador desfizer a ação, a parte desmarca. Ver docs/PROJETO.md.
 */
export function validadorTravado(validador: Validador): boolean {
  switch (validador.tipo) {
    case "selecionado":
    case "evento":
      return true;
    case "todos":
    case "algum":
      return validador.validadores.some(validadorTravado);
    case "nao":
      return validadorTravado(validador.validador);
    default:
      return false;
  }
}

/**
 * Desafio: recalcula quais partes estão marcadas no checklist. As partes
 * travadas (`validadorTravado`) continuam marcadas para sempre, uma vez que
 * passem; as demais são conferidas de novo a cada checagem.
 */
export function recalcularPartesFeitas(
  desafio: FaseDesafio,
  partesFeitas: readonly string[],
  contexto: ContextoValidacao,
): string[] {
  return desafio.partes
    .filter((parte) => {
      const passaAgora = avaliarValidador(parte.validador, contexto);
      if (validadorTravado(parte.validador)) return partesFeitas.includes(parte.id) || passaAgora;
      return passaAgora;
    })
    .map((parte) => parte.id);
}

/** Texto de várias linhas explicando um resultado (mensagens de teste). */
export function explicarResultado(resultado: ResultadoValidador, recuo = ""): string {
  const marca = resultado.passou ? "[ok]" : "[x]";
  const linha = `${recuo}${marca} ${resultado.descricao}${resultado.detalhe ? ` (${resultado.detalhe})` : ""}`;
  const filhos = (resultado.filhos ?? []).map((filho) => explicarResultado(filho, `${recuo}  `));
  return [linha, ...filhos].join("\n");
}
