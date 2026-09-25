/*
 * Interpretador dos validadores declarativos (src/conteudo/tipos.ts).
 * Funciona com o documento vivo do iframe, com um Document solto
 * (DOMParser) e com o jsdom dos testes: só usa APIs comuns de DOM.
 */
import { VALIDADORES_CUSTOM } from "@/conteudo/validadoresCustom";
import type { FaseDesafio, OperadorContagem, Validador, ViaSelecao } from "@/conteudo/tipos";
import { elementoDoNo } from "@/lib/arvore";
import { estaEscondido } from "@/lib/esconder";
import { calcularCascata, folhasDoDocumento, normalizarSeletor, valorEfetivo } from "./css/cascata";
import { ehAtalho } from "./css/propriedades";
import { abrirAtalho, valoresDaPropriedadeIguais } from "./css/valores";
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
      return `evento ${validador.evento}${validador.href !== undefined ? ` com href "${validador.href}"` : ""} pelo menos ${validador.minimo ?? 1} vez(es)`;
    case "tag":
      return `${validador.seletor} é <${validador.nome}>`;
    case "valorEfetivo":
      return `${validador.propriedade} de ${validador.seletor} vale "${validador.valor}"`;
    case "declaracao":
      return `a regra ${validador.seletorRegra} tem ${validador.propriedade}${validador.valor !== undefined ? `: ${validador.valor}` : ""}${
        validador.ativa === undefined ? "" : validador.ativa ? " (ligada)" : " (desligada)"
      }`;
    case "regraExiste":
      return `existe a regra ${validador.seletorRegra}`;
    case "riscada":
      return `${validador.propriedade} de ${validador.seletorRegra} riscada em ${validador.seletor}`;
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
      const vezes = contexto.eventos.filter(
        (evento) =>
          evento.tipo === validador.evento &&
          (validador.href === undefined || (evento.tipo === "clicouLink" && evento.href === validador.href)),
      ).length;
      return { passou: vezes >= (validador.minimo ?? 1), descricao, detalhe: `aconteceu ${vezes} vez(es)` };
    }
    case "tag": {
      const tags = consultar(documento, validador.seletor).map((elemento) => elemento.tagName.toLowerCase());
      return { passou: tags.includes(validador.nome.toLowerCase()), descricao, detalhe: `tags: ${lista(tags)}` };
    }
    case "valorEfetivo":
      return avaliarValorEfetivo(validador, contexto, descricao);
    case "declaracao": {
      const alvo = normalizarSeletor(validador.seletorRegra);
      const regras = folhasDoDocumento(documento)
        .filter((folha) => folha.origem !== "navegador")
        .flatMap((folha) => folha.analisada.regras)
        .filter((regra) => normalizarSeletor(regra.seletor) === alvo);
      const declaracoes = regras.flatMap((regra) => regra.declaracoes).filter((item) => item.propriedade === nomeDaPropriedade(validador.propriedade));
      const passou = declaracoes.some(
        (item) =>
          (validador.ativa === undefined || item.ativa === validador.ativa) &&
          (validador.valor === undefined || valoresDaPropriedadeIguais(item.propriedade, item.valor, validador.valor)),
      );
      const achadas = declaracoes.map((item) => `${item.ativa ? "" : "(desligada) "}${item.propriedade}: ${item.valor}`);
      return {
        passou,
        descricao,
        detalhe: regras.length === 0 ? "a regra não existe" : `declarações: ${lista(achadas)}`,
      };
    }
    case "regraExiste": {
      const alvo = normalizarSeletor(validador.seletorRegra);
      const seletores = folhasDoDocumento(documento)
        .filter((folha) => folha.origem !== "navegador")
        .flatMap((folha) => folha.analisada.regras.map((regra) => regra.seletor));
      return {
        passou: seletores.some((seletor) => normalizarSeletor(seletor) === alvo),
        descricao,
        detalhe: `regras: ${lista(seletores)}`,
      };
    }
    case "riscada": {
      const alvo = normalizarSeletor(validador.seletorRegra);
      const propriedade = nomeDaPropriedade(validador.propriedade);
      const situacoes: string[] = [];
      const passou = consultar(documento, validador.seletor).some((elemento) => {
        const cascata = calcularCascata(elemento);
        const blocos = [...cascata.proprios, ...cascata.herdados.flatMap((grupo) => grupo.blocos)];
        return blocos.some((bloco) => {
          if (bloco.folha?.origem === "navegador") return false;
          const seletor = bloco.tipo === "inline" ? "element.style" : normalizarSeletor(bloco.regra?.seletor ?? "");
          if (seletor !== alvo) return false;
          return bloco.declaracoes.some((item) => {
            if (item.declaracao.propriedade !== propriedade) return false;
            situacoes.push(item.situacao);
            return item.situacao === "perdeu";
          });
        });
      });
      return { passou, descricao, detalhe: situacoes.length === 0 ? "a declaração não vale nesse elemento" : `situação: ${lista(situacoes)}` };
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

function nomeDaPropriedade(propriedade: string): string {
  const nome = propriedade.trim();
  return nome.startsWith("--") ? nome : nome.toLowerCase();
}

/** valorEfetivo: basta um elemento do seletor ter o valor (cada longa, se for atalho). */
function avaliarValorEfetivo(
  validador: Extract<Validador, { tipo: "valorEfetivo" }>,
  contexto: ContextoValidacao,
  descricao: string,
): ResultadoValidador {
  const propriedade = nomeDaPropriedade(validador.propriedade);
  const esperado: Record<string, string> | null = ehAtalho(propriedade)
    ? abrirAtalho(propriedade, validador.valor).longas
    : { [propriedade]: validador.valor };
  if (!esperado) {
    return { passou: false, descricao, detalhe: `o motor não sabe separar o valor esperado "${validador.valor}" de ${propriedade}` };
  }
  const encontrados: string[] = [];
  const elementos = consultar(contexto.documento, validador.seletor);
  const passou = elementos.some((elemento) => {
    const efetivos = valorEfetivo(elemento, propriedade);
    return Object.entries(esperado).every(([longa, valor]) => {
      const efetivo = efetivos[longa];
      if (!efetivo || efetivo.tipo === "incerto") {
        encontrados.push(`${longa}: incerto (${efetivo?.motivo ?? "sem valor"})`);
        return false;
      }
      encontrados.push(`${longa}: ${efetivo.valor}`);
      return valoresDaPropriedadeIguais(longa, efetivo.valor, valor);
    });
  });
  return {
    passou,
    descricao,
    detalhe: elementos.length === 0 ? "o seletor não achou nenhum elemento" : `achou: ${lista([...new Set(encontrados)])}`,
  };
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
