/*
 * Interpretador dos validadores declarativos (src/conteudo/tipos.ts).
 * Funciona com o documento vivo do iframe, com um Document solto
 * (DOMParser) e com o jsdom dos testes: só usa APIs comuns de DOM.
 */
import { VALIDADORES_CUSTOM } from "@/conteudo/validadoresCustom";
import type { Acao, Fase, FaseDesafio, FaseProjetoPonte, OperadorContagem, Validador, ViaSelecao } from "@/conteudo/tipos";
import { elementoDoNo } from "@/lib/arvore";
import { textoVerdadeiro } from "@/lib/documentoSiteAlvo";
import { estaEscondido } from "@/lib/esconder";
import { calcularCascata, folhasDoDocumento, leitorDeValores, normalizarSeletor, type OpcoesCascata, valorEfetivo } from "./css/cascata";
import type { Tela } from "./css/midia";
import { auditar } from "./auditoria";
import { conferirDadosEstruturados, motivoNoindex, resultadoNaBusca } from "./busca";
import { type DadosCampanha, type EstadoCampanha, simularCampanha, valorDaMetrica } from "./campanha";
import { conferirLinkRastreavel } from "./medicao";
import { type EstadoDispositivo, medidasNaTela, orientacaoDe, telaDaLargura } from "./dispositivos";
import { ehAtalho } from "./css/propriedades";
import { abrirAtalho, lerCor, valoresDaPropriedadeIguais } from "./css/valores";
import type { EventoFase } from "./eventos";
import { NOME_DO_PORTAO, portoesUsados, tabelaVerdade, type Circuito } from "./circuito/modelo";
import { chaveFuncaoPassa, type EstadoPrograma, type ResumoExecucao, variavelGlobal } from "./programa";
import { textoDoEsperado, textoPrevia, valorIgual } from "./executor/formatar";
import { DADOS_DO_CONTROLE, normalizarExpressao } from "./depurador";
import { conferirOrdem, type DadosOrdenar, type EstadoOrdenar, ondeEsta } from "./ordenar/modelo";
import { planoDosComentarios } from "./plano/comentarios";
import { casaComExigido, type DadosCasos, type EstadoCasos, lerCaso, textoDoExigido } from "./casos/modelo";
import { ehArvore, formaPelasContagens, somarContagens } from "./estruturas";
import { chaveMedicao, textoDePassos } from "./desempenho";

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
  /**
   * A tela da prévia agora (o modo dispositivo muda). Sem ela, vale a da
   * janela do documento ou, num documento solto, a padrão (1280 x 800).
   */
  tela?: Tela;
  /** O modo dispositivo agora (null ou ausente: a fase não tem a barra). */
  dispositivo?: EstadoDispositivo | null;
  /** (Simulador de campanha) Os dados da fase e a campanha configurada agora. */
  campanha?: { dados: DadosCampanha; estado: EstadoCampanha };
  /** (Fase de programa) A memória depois da última execução e os testes de função. */
  programa?: EstadoPrograma;
  /** (Circuito lógico) O circuito de agora. */
  circuito?: Circuito;
  /** (Ordenar passos) Os dados do quadro e onde está cada cartão agora. */
  ordenar?: { dados: DadosOrdenar; estado: EstadoOrdenar };
  /** (Fase com Snippet) O texto do Snippet agora (o que está escrito, rodado ou não). */
  snippet?: string;
  /** (Fase composta, área testes) A função dos casos e os casos do aluno agora, com os resultados da última rodada. */
  casos?: { dados: DadosCasos; estado: EstadoCasos };
};

/** As execuções desde que o objetivo começou (eventos `executouCodigo`). */
function execucoesDoObjetivo(contexto: ContextoValidacao): ResumoExecucao[] {
  return contexto.eventos.flatMap((evento) => (evento.tipo === "executouCodigo" ? [evento.execucao] : []));
}

/** A tela de um validador de CSS: a `larguraTela` dele ou a da prévia. */
function opcoesDaTela(validador: { larguraTela?: number; alturaTela?: number }, contexto: ContextoValidacao): OpcoesCascata {
  if (validador.larguraTela !== undefined) return { tela: telaDaLargura(validador.larguraTela, validador.alturaTela) };
  return contexto.tela ? { tela: contexto.tela } : {};
}

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
  return elementos.map((elemento) => normalizarTexto(textoVerdadeiro(elemento)));
}

function lista(itens: readonly string[]): string {
  return itens.length === 0 ? "nenhum" : itens.map((item) => `"${item}"`).join(", ");
}

/** Descrição curta de um validador, em PT-BR. */
function naTela(validador: { larguraTela?: number }): string {
  return validador.larguraTela !== undefined ? ` numa tela de ${validador.larguraTela} px` : "";
}

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
    case "tituloDaAba":
      return validador.valor !== undefined ? `título da aba igual a "${validador.valor}"` : "a aba tem título";
    case "valorEfetivo":
      return `${validador.propriedade} de ${validador.seletor} vale "${validador.valor}"${naTela(validador)}`;
    case "declaracao":
      return `a regra ${validador.seletorRegra} tem ${validador.propriedade}${validador.valor !== undefined ? `: ${validador.valor}` : ""}${
        validador.ativa === undefined ? "" : validador.ativa ? " (ligada)" : " (desligada)"
      }`;
    case "regraExiste":
      return `existe a regra ${validador.seletorRegra}`;
    case "riscada":
      return `${validador.propriedade} de ${validador.seletorRegra} riscada em ${validador.seletor}${naTela(validador)}`;
    case "variavelCss":
      return `a variável ${validador.nome}${validador.seletor ? ` em ${validador.seletor}` : ""} ${
        validador.valor !== undefined ? `vale "${validador.valor}"` : validador.diferenteDoInicial ? "mudou de valor" : "tem valor"
      }`;
    case "temaSalvo":
      return "salvou o Meu tema";
    case "notaAuditoria":
      return `nota de ${validador.categoria} na auditoria pelo menos ${validador.minimo}`;
    case "temMediaQuery":
      return `o CSS tem pelo menos ${validador.minimo ?? 1} @media`;
    case "cabeNaTela":
      return `a página cabe numa tela de ${validador.largura} px sem rolar de lado`;
    case "semProblema":
      return `a auditoria não acha "${validador.regra}"`;
    case "dispositivo":
      return `modo dispositivo ligado${validador.largura !== undefined ? ` com ${validador.largura} px de largura` : ""}${
        validador.orientacao ? ` (${validador.orientacao === "retrato" ? "em pé" : "deitado"})` : ""
      }`;
    case "resultadoBusca":
      return `${validador.campo === "titulo" ? "o título" : "a descrição"} na busca vem da página${
        validador.contem !== undefined ? ` e tem "${validador.contem}"` : ""
      }${validador.semCorte ? ", sem corte" : ""}`;
    case "indexavel":
      return validador.valor ? "a página pode aparecer na busca" : "a página está fora da busca (noindex)";
    case "dadosEstruturados":
      return `dados estruturados ${validador.tipoSchema}${validador.campos.length > 0 ? ` com ${validador.campos.join(", ")}` : ""}`;
    case "eventoMedido":
      return `a medição recebeu o evento "${validador.nome}"`;
    case "linkRastreavel": {
      const pedidos = Object.entries(validador.utm).map(([chave, valor]) => `utm_${chave}=${valor}`);
      return `${validador.seletor} é um link rastreável${pedidos.length > 0 ? ` (${pedidos.join(", ")})` : ""}`;
    }
    case "simulacao":
      return `campanha simulada: ${validador.metrica} ${validador.op} ${validador.valor}`;
    case "valorVariavel":
      return `a variável ${validador.nome} vale ${textoDoEsperado(validador.valor)}`;
    case "respostaDoConsole":
      return `o Console respondeu ${textoDoEsperado(validador.valor)}`;
    case "saida":
      return `o console mostrou ${[
        validador.contem !== undefined ? `uma linha com "${validador.contem}"` : "",
        validador.igual ? `exatamente ${validador.igual.map((linha) => `"${linha}"`).join(", ")}` : "",
      ]
        .filter(Boolean)
        .join(" e ")}`;
    case "semErro":
      return "rodou sem erro";
    case "erroDoTipo":
      return `deu ${validador.nome}`;
    case "usouSintaxe":
      return `o código rodado usa ${validador.sintaxe}`;
    case "funcaoPassa":
      return `a função ${validador.nome} devolve o certo em ${validador.casos.length} caso(s)`;
    case "circuitoTabela":
      return `o circuito dá a tabela verdade pedida (${validador.esperado.length} linha(s))`;
    case "usouPortao":
      return `usou pelo menos ${validador.minimo ?? 1} portão ${NOME_DO_PORTAO[validador.portao]} ligado`;
    case "pontoDeParada":
      return `tem ponto de parada na linha ${validador.linha}`;
    case "pausouNaLinha":
      return `o depurador pausou na linha ${validador.linha}`;
    case "observou":
      return `o Observar tem ${validador.expressao}${validador.valor !== undefined ? ` e ela mostrou ${textoDoEsperado(validador.valor)} pausado` : ""}`;
    case "usouControle":
      return `usou ${DADOS_DO_CONTROLE[validador.controle].nome} pelo menos ${validador.minimo ?? 1} vez(es)`;
    case "ordemValida":
      return "o plano vale (todos os passos, nenhum que sobra, dependências respeitadas)";
    case "passoNoPlano":
      return `o passo ${validador.passo} está no plano${validador.grupo ? ` dentro de ${validador.grupo}` : ""}`;
    case "passoAntes":
      return `${validador.passo} vem antes de ${validador.antesDe} no plano`;
    case "semSobras":
      return "nenhum passo que sobra está no plano";
    case "planoComentado":
      return "o plano está no código como comentários, na ordem certa";
    case "casosDoAluno":
      return `pelo menos ${validador.minimo} caso(s) de teste do aluno${validador.passando ? " passando" : ""}${validador.incluir?.length ? `, incluindo ${validador.incluir.map((exigido) => textoDoExigido(null, exigido)).join(" e ")}` : ""}`;
    case "passosNoMaximo":
      return validador.tamanho === undefined
        ? `a última execução deu no máximo ${validador.valor} passos`
        : `${validador.funcao ?? "a função medida"} dá no máximo ${validador.valor} passos com ${validador.tamanho} itens`;
    case "formaDaEstrutura":
      return `${validador.nome} é ${validador.forma === "arvore" ? "uma árvore" : `usada como ${validador.forma}`}`;
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
      if (validador.comTexto) elementos = elementos.filter((elemento) => normalizarTexto(textoVerdadeiro(elemento)).length > 0);
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
    case "tituloDaAba": {
      // O que a aba mostra é o <title> (document.title junta os espaços).
      const titulo = documento.querySelector("title");
      const texto = titulo ? normalizarTexto(textoVerdadeiro(titulo)) : "";
      const passou = validador.valor !== undefined ? texto === normalizarTexto(validador.valor) : texto.length > 0;
      return { passou, descricao, detalhe: titulo ? `título: "${texto}"` : "a página não tem <title>" };
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
        const cascata = calcularCascata(elemento, opcoesDaTela(validador, contexto));
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
    case "variavelCss":
      return avaliarVariavelCss(validador, contexto, descricao);
    case "temMediaQuery": {
      const minimo = validador.minimo ?? 1;
      const quantas = folhasDoDocumento(documento)
        .filter((folha) => folha.origem !== "navegador")
        .reduce((soma, folha) => soma + (folha.analisada.texto.match(/@media\b/gi)?.length ?? 0), 0);
      return { passou: quantas >= minimo, descricao, detalhe: `achou ${quantas}` };
    }
    case "cabeNaTela": {
      const motivos = motivosDeNaoCaber(documento, validador.largura);
      return { passou: motivos.length === 0, descricao, detalhe: motivos.length === 0 ? "cabe" : lista(motivos) };
    }
    case "notaAuditoria": {
      const { notas } = auditar(contexto.documento, contexto.tela ? { tela: contexto.tela } : {});
      return { passou: notas[validador.categoria] >= validador.minimo, descricao, detalhe: `nota ${notas[validador.categoria]}` };
    }
    case "semProblema": {
      const { problemas, naoSeAplicam } = auditar(contexto.documento, contexto.tela ? { tela: contexto.tela } : {});
      const achado = problemas.find((problema) => problema.regra === validador.regra);
      return {
        passou: achado === undefined,
        descricao,
        detalhe: achado
          ? `${Math.max(1, achado.elementos.length)} problema(s)${achado.detalhes.length ? `: ${lista(achado.detalhes)}` : ""}`
          : naoSeAplicam.includes(validador.regra)
            ? "não se aplica nesta página"
            : "nenhum problema",
      };
    }
    case "resultadoBusca": {
      const resultado = resultadoNaBusca(contexto.documento, "");
      const campo = validador.campo === "titulo" ? resultado.titulo : resultado.descricao;
      if (campo.declarado === null) {
        return { passou: false, descricao, detalhe: validador.campo === "titulo" ? "a página não tem <title>" : "a página não tem meta description" };
      }
      const temTrecho =
        validador.contem === undefined || normalizarTexto(campo.declarado).toLowerCase().includes(normalizarTexto(validador.contem).toLowerCase());
      const passou = temTrecho && !(validador.semCorte && campo.cortou);
      return { passou, descricao, detalhe: `"${campo.declarado}"${campo.cortou ? " (cortado na busca)" : ""}` };
    }
    case "indexavel": {
      const motivo = motivoNoindex(contexto.documento);
      return { passou: (motivo === null) === validador.valor, descricao, detalhe: motivo ?? "sem noindex" };
    }
    case "dadosEstruturados": {
      const { passou, detalhe } = conferirDadosEstruturados(contexto.documento, validador.tipoSchema, validador.campos);
      return { passou, descricao, detalhe };
    }
    case "eventoMedido": {
      const medidos = contexto.eventos.flatMap((evento) => (evento.tipo === "eventoMedido" ? [evento.nome] : []));
      return { passou: medidos.includes(validador.nome), descricao, detalhe: medidos.length > 0 ? `medidos: ${lista(medidos)}` : "nenhum evento medido" };
    }
    case "linkRastreavel": {
      const { passou, detalhe } = conferirLinkRastreavel(consultar(documento, validador.seletor), validador.utm);
      return { passou, descricao, detalhe };
    }
    case "valorVariavel": {
      if (!contexto.programa?.memoria) return { passou: false, descricao, detalhe: "nada rodou ainda" };
      const valor = variavelGlobal(contexto.programa.memoria, validador.nome);
      if (!valor) return { passou: false, descricao, detalhe: `não existe variável ${validador.nome}` };
      return { passou: valorIgual(valor, validador.valor), descricao, detalhe: `${validador.nome} vale ${textoPrevia(valor)}` };
    }
    case "respostaDoConsole": {
      const respostas = execucoesDoObjetivo(contexto).flatMap((execucao) => (execucao.resposta ? [execucao.resposta] : []));
      return {
        passou: respostas.some((resposta) => valorIgual(resposta, validador.valor)),
        descricao,
        detalhe: respostas.length ? `respostas: ${lista(respostas.slice(-6).map((r) => textoPrevia(r)))}` : "o Console ainda não respondeu nada",
      };
    }
    case "saida": {
      const execucoes = execucoesDoObjetivo(contexto);
      const linhas = execucoes.flatMap((execucao) => execucao.saidas);
      const contem = validador.contem === undefined || linhas.some((linha) => linha.includes(validador.contem as string));
      const igual =
        validador.igual === undefined ||
        execucoes.some((execucao) => execucao.saidas.length === validador.igual?.length && execucao.saidas.every((linha, i) => linha === validador.igual?.[i]));
      return { passou: contem && igual, descricao, detalhe: linhas.length ? `linhas: ${lista(linhas.slice(-8))}` : "o console não mostrou nada" };
    }
    case "semErro": {
      const execucoes = execucoesDoObjetivo(contexto);
      const ultima = execucoes[execucoes.length - 1];
      if (!ultima) return { passou: false, descricao, detalhe: "nada rodou desde o começo do objetivo" };
      return { passou: ultima.erro === null, descricao, detalhe: ultima.erro ? `${ultima.erro.nome}: ${ultima.erro.mensagem}` : "sem erro" };
    }
    case "erroDoTipo": {
      const erros = execucoesDoObjetivo(contexto).flatMap((execucao) => (execucao.erro ? [execucao.erro.nome || execucao.erro.tipo] : []));
      return { passou: erros.includes(validador.nome), descricao, detalhe: erros.length ? `erros: ${lista(erros)}` : "nenhum erro" };
    }
    case "usouSintaxe": {
      const usadas = new Set(execucoesDoObjetivo(contexto).flatMap((execucao) => execucao.sintaxes));
      return { passou: usadas.has(validador.sintaxe), descricao, detalhe: usadas.size ? `usou: ${[...usadas].join(", ")}` : "nada rodou" };
    }
    case "funcaoPassa": {
      const teste = contexto.programa?.testes[chaveFuncaoPassa(validador)];
      if (!teste) return { passou: false, descricao, detalhe: "a função ainda não foi testada (nada rodou)" };
      if (!teste.existe) return { passou: false, descricao, detalhe: `não existe função ${validador.nome}` };
      const falhas = teste.casos.filter((caso) => !caso.passou);
      const detalhe = falhas.length
        ? falhas
            .map(
              (caso) =>
                `${validador.nome}(${caso.args.map(textoDoEsperado).join(", ")}) devolveu ${caso.erro ? `${caso.erro.nome}: ${caso.erro.mensagem}` : caso.obtido ? textoPrevia(caso.obtido) : "nada"}, esperado ${textoDoEsperado(caso.esperado)}`,
            )
            .join("; ")
        : "todos os casos passaram";
      return { passou: teste.passou, descricao, detalhe };
    }
    case "circuitoTabela": {
      if (!contexto.circuito) return { passou: false, descricao, detalhe: "só numa fase com circuito" };
      const tabela = tabelaVerdade(contexto.circuito);
      const erradas: string[] = [];
      for (const linha of validador.esperado) {
        const achada = tabela.find((t) => Object.entries(linha.entradas).every(([nome, valor]) => t.entradas[nome] === valor));
        const combinacao = Object.entries(linha.entradas)
          .map(([nome, valor]) => `${nome}=${valor}`)
          .join(", ");
        if (!achada) {
          erradas.push(`${combinacao}: o circuito não tem essas entradas`);
          continue;
        }
        const nomes = Object.keys(achada.saidas);
        const esperado = typeof linha.saida === "boolean" ? (nomes.length === 1 ? { [nomes[0]]: linha.saida } : null) : linha.saida;
        if (!esperado) {
          erradas.push(`${combinacao}: o circuito tem ${nomes.length} saídas`);
          continue;
        }
        for (const [nome, valor] of Object.entries(esperado)) {
          if (achada.saidas[nome] !== valor) erradas.push(`${combinacao}: ${nome} deu ${achada.saidas[nome]}, esperado ${valor}`);
        }
      }
      return { passou: erradas.length === 0, descricao, detalhe: erradas.length ? erradas.slice(0, 4).join("; ") : "todas as linhas batem" };
    }
    case "usouPortao": {
      if (!contexto.circuito) return { passou: false, descricao, detalhe: "só numa fase com circuito" };
      const usados = portoesUsados(contexto.circuito, validador.portao);
      return { passou: usados >= (validador.minimo ?? 1), descricao, detalhe: `${usados} ligado(s)` };
    }
    case "pontoDeParada": {
      const pontos = contexto.programa?.depurador?.pontos ?? [];
      return { passou: pontos.includes(validador.linha), descricao, detalhe: pontos.length ? `pontos nas linhas ${pontos.join(", ")}` : "nenhum ponto de parada" };
    }
    case "pausouNaLinha": {
      const linhas = contexto.eventos.flatMap((evento) => (evento.tipo === "pausouNoDepurador" ? [evento.linha] : []));
      return { passou: linhas.includes(validador.linha), descricao, detalhe: linhas.length ? `pausou nas linhas ${linhas.join(", ")}` : "não pausou" };
    }
    case "observou": {
      const alvo = normalizarExpressao(validador.expressao);
      const lista = contexto.programa?.depurador?.observacoes ?? [];
      const naLista = lista.some((expressao) => normalizarExpressao(expressao) === alvo);
      if (validador.valor === undefined) return { passou: naLista, descricao, detalhe: lista.length ? `Observar: ${lista.join(", ")}` : "o Observar está vazio" };
      const vistos = contexto.eventos.flatMap((evento) => (evento.tipo === "observouValor" && normalizarExpressao(evento.expressao) === alvo ? [evento.valor] : []));
      const esperado = validador.valor;
      const passou = vistos.some((valor) => valor !== null && valorIgual(valor, esperado));
      return { passou, descricao, detalhe: vistos.length ? `mostrou ${vistos.map((v) => (v ? textoPrevia(v) : "<indisponível>")).join(", ")}` : "não foi vista pausada" };
    }
    case "usouControle": {
      const vezes = contexto.eventos.filter((evento) => evento.tipo === "usouControleDepurador" && evento.controle === validador.controle).length;
      return { passou: vezes >= (validador.minimo ?? 1), descricao, detalhe: `usou ${vezes} vez(es)` };
    }
    case "ordemValida": {
      if (!contexto.ordenar) return { passou: false, descricao, detalhe: "só numa fase ordenar-passos" };
      const conferencia = conferirOrdem(contexto.ordenar.dados, contexto.ordenar.estado);
      return { passou: conferencia.valida, descricao, detalhe: conferencia.valida ? "o plano vale" : conferencia.motivo };
    }
    case "passoNoPlano": {
      if (!contexto.ordenar) return { passou: false, descricao, detalhe: "só numa fase ordenar-passos" };
      const onde = ondeEsta(contexto.ordenar.estado, validador.passo);
      const passou = onde !== null && (validador.grupo === undefined || onde.destino === validador.grupo);
      return { passou, descricao, detalhe: onde ? `está em ${onde.destino}, posição ${onde.posicao + 1}` : "está fora do plano" };
    }
    case "passoAntes": {
      if (!contexto.ordenar) return { passou: false, descricao, detalhe: "só numa fase ordenar-passos" };
      const { dados, estado } = contexto.ordenar;
      const ordem = [...(dados.modo === "agrupar" ? (dados.grupos ?? []).map((g) => g.id) : ["plano"])].flatMap((d) => estado.listas[d] ?? []);
      const a = ordem.indexOf(validador.passo);
      const b = ordem.indexOf(validador.antesDe);
      return { passou: a >= 0 && b >= 0 && a < b, descricao, detalhe: a < 0 || b < 0 ? "algum dos dois está fora do plano" : `posições ${a + 1} e ${b + 1}` };
    }
    case "planoComentado": {
      if (!contexto.ordenar) return { passou: false, descricao, detalhe: "só numa fase com a área plano" };
      if (contexto.snippet === undefined) return { passou: false, descricao, detalhe: "só numa fase com o Snippet" };
      const { estado, achados } = planoDosComentarios(contexto.ordenar.dados, contexto.snippet);
      if (achados === 0) return { passou: false, descricao, detalhe: "nenhum passo do plano está no código como comentário" };
      const conferencia = conferirOrdem(contexto.ordenar.dados, estado);
      return { passou: conferencia.valida, descricao, detalhe: conferencia.valida ? "o plano está no código, na ordem certa" : `nos comentários do código: ${conferencia.motivo}` };
    }
    case "casosDoAluno": {
      if (!contexto.casos) return { passou: false, descricao, detalhe: "só numa fase com a área testes" };
      const { dados, estado } = contexto.casos;
      const lidos = estado.casos.flatMap((caso) => {
        const lido = lerCaso(caso);
        return lido.ok ? [{ ...lido, id: caso.id }] : [];
      });
      const contam = validador.passando ? lidos.filter((caso) => estado.resultados[caso.id]?.passou) : lidos;
      const faltam = (validador.incluir ?? []).filter((exigido) => !contam.some((caso) => casaComExigido(caso, exigido)));
      const partes = [`${lidos.length} caso(s) válido(s)${validador.passando ? `, ${contam.length} passando` : ""}`];
      if (lidos.length < estado.casos.length) partes.push(`${estado.casos.length - lidos.length} que não dá para ler`);
      if (faltam.length) partes.push(`falta ${faltam.map((exigido) => textoDoExigido(dados, exigido)).join(" e ")}`);
      return { passou: contam.length >= validador.minimo && faltam.length === 0, descricao, detalhe: partes.join("; ") };
    }
    case "semSobras": {
      if (!contexto.ordenar) return { passou: false, descricao, detalhe: "só numa fase ordenar-passos" };
      const sobrando = conferirOrdem(contexto.ordenar.dados, contexto.ordenar.estado).sobrando;
      return { passou: sobrando.length === 0, descricao, detalhe: sobrando.length ? `sobrando: ${sobrando.join(", ")}` : "nenhum" };
    }
    case "passosNoMaximo": {
      if (validador.tamanho === undefined) {
        const execucoes = execucoesDoObjetivo(contexto);
        const ultima = execucoes[execucoes.length - 1];
        if (!ultima) return { passou: false, descricao, detalhe: "nada rodou desde o começo do objetivo" };
        return { passou: !ultima.erro && ultima.totalPassos <= validador.valor, descricao, detalhe: `${textoDePassos(ultima.totalPassos)} passos${ultima.erro ? `, com ${ultima.erro.nome || "erro"}` : ""}` };
      }
      const medicao = contexto.programa?.medicoes?.[chaveMedicao(validador.funcao ?? "", validador.tamanho)];
      if (!medicao) return { passou: false, descricao, detalhe: "ainda não mediu (nada rodou ou a função não existe)" };
      if (medicao.erro) return { passou: false, descricao, detalhe: medicao.erro };
      return {
        passou: !medicao.passouDoLimite && medicao.passos <= validador.valor,
        descricao,
        detalhe: medicao.passouDoLimite ? `passou de ${textoDePassos(medicao.passos)} passos (travaria)` : `${textoDePassos(medicao.passos)} passos`,
      };
    }
    case "formaDaEstrutura": {
      if (validador.forma === "arvore") {
        const passou = ehArvore(contexto.programa?.memoria ?? null, validador.nome);
        return { passou, descricao, detalhe: passou ? "objeto com filhos objetos" : `${validador.nome} não é um objeto com filhos objetos` };
      }
      const contagem = somarContagens(execucoesDoObjetivo(contexto).flatMap((execucao) => (execucao.estruturas[validador.nome] ? [execucao.estruturas[validador.nome]] : [])));
      const forma = formaPelasContagens(contagem);
      return {
        passou: forma === validador.forma,
        descricao,
        detalhe: `entrou ${contagem.entraramFim} no fim e ${contagem.entraramInicio} no começo; saiu ${contagem.sairamFim} do fim e ${contagem.sairamInicio} do começo`,
      };
    }
    case "simulacao": {
      if (!contexto.campanha) return { passou: false, descricao, detalhe: "só numa fase simulador-campanha" };
      const resultado = simularCampanha(contexto.campanha.dados, contexto.campanha.estado, documento);
      const valor = valorDaMetrica(resultado, validador.metrica);
      if (valor === null) return { passou: false, descricao, detalhe: "sem nenhum cliente, não dá para calcular o custo por cliente" };
      return { passou: comparar(valor, validador.op, validador.valor), descricao, detalhe: `${validador.metrica} = ${valor}` };
    }
    case "dispositivo": {
      const estado = contexto.dispositivo ?? null;
      if (!estado?.ligado) return { passou: false, descricao, detalhe: "a barra de dispositivo está desligada" };
      const { largura, altura } = medidasNaTela(estado);
      const orientacao = orientacaoDe(estado);
      const passou =
        (validador.largura === undefined || validador.largura === largura) && (validador.orientacao === undefined || validador.orientacao === orientacao);
      return { passou, descricao, detalhe: `${largura} x ${altura}, ${orientacao}` };
    }
    case "temaSalvo": {
      const vezes = contexto.eventos.filter((evento) => evento.tipo === "temaSalvo").length;
      return { passou: vezes > 0, descricao, detalhe: `salvou ${vezes} vez(es)` };
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
    const efetivos = valorEfetivo(elemento, propriedade, opcoesDaTela(validador, contexto));
    return Object.entries(esperado).every(([longa, valor]) => {
      const efetivo = efetivos[longa];
      if (!efetivo || efetivo.tipo !== "valor") {
        encontrados.push(`${longa}: ${efetivo?.tipo === "invalido" ? "inválido" : "incerto"} (${efetivo?.motivo ?? "sem valor"})`);
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

/** O valor de uma variável no primeiro elemento do seletor (padrão: o <html>), ou o motivo de não ter. */
function valorDaVariavel(documento: Document, nome: string, seletor: string | undefined, opcoes: OpcoesCascata): { valor: string } | { motivo: string } {
  const elemento = seletor ? consultar(documento, seletor)[0] : documento.documentElement;
  if (!elemento) return { motivo: "o seletor não achou nenhum elemento" };
  const efetivo = valorEfetivo(elemento, nome, opcoes)[nome];
  if (!efetivo || efetivo.tipo !== "valor") return { motivo: efetivo?.motivo ?? "sem valor" };
  return { valor: efetivo.valor };
}

/** Duas cores (em qualquer formato) iguais, ou textos iguais normalizados. */
function valoresDeVariavelIguais(a: string, b: string): boolean {
  const corA = lerCor(a);
  const corB = lerCor(b);
  if (corA && corB) return corA.every((canal, indice) => Math.abs(canal - corB[indice]) < 0.01);
  return normalizarTexto(a).toLowerCase() === normalizarTexto(b).toLowerCase();
}

function avaliarVariavelCss(
  validador: Extract<Validador, { tipo: "variavelCss" }>,
  contexto: ContextoValidacao,
  descricao: string,
): ResultadoValidador {
  const nome = validador.nome.trim();
  const opcoes = contexto.tela ? { tela: contexto.tela } : {};
  const agora = valorDaVariavel(contexto.documento, nome, validador.seletor, opcoes);
  if ("motivo" in agora) return { passou: false, descricao, detalhe: agora.motivo };
  let passou = true;
  if (validador.valor !== undefined) passou = valoresDeVariavelIguais(agora.valor, validador.valor);
  let detalhe = `vale ${agora.valor}`;
  if (passou && validador.diferenteDoInicial) {
    const antes = valorDaVariavel(contexto.inicial, nome, validador.seletor, opcoes);
    passou = "motivo" in antes || !valoresDeVariavelIguais(agora.valor, antes.valor);
    detalhe += "motivo" in antes ? " (não existia no começo)" : ` (no começo: ${antes.valor})`;
  }
  return { passou, descricao, detalhe };
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
    case "temaSalvo":
    case "eventoMedido":
    case "saida":
    case "respostaDoConsole":
    case "semErro":
    case "erroDoTipo":
    case "usouSintaxe":
    case "pausouNaLinha":
    case "usouControle":
      return true;
    case "passosNoMaximo":
      return validador.tamanho === undefined;
    case "formaDaEstrutura":
      return validador.forma !== "arvore";
    case "observou":
      return validador.valor !== undefined;
    case "todos":
    case "algum":
      return validador.validadores.some(validadorTravado);
    case "nao":
      return validadorTravado(validador.validador);
    default:
      return false;
  }
}

/** Px de um valor como "420px" (null se não é px). */
function emPx(valor: string): number | null {
  const achado = /^(-?\d*\.?\d+)px$/i.exec(valor.trim());
  return achado ? Number(achado[1]) : null;
}

/**
 * Por que a página não cabe numa tela dessa largura (vazio: cabe). Pelo
 * motor, sem layout: meta viewport e medidas fixas em px (width,
 * min-width e colunas de grid) maiores que a tela, com as @media dela.
 */
export function motivosDeNaoCaber(documento: Document, largura: number): string[] {
  const motivos: string[] = [];
  const viewport = documento.querySelector('meta[name="viewport" i]');
  if (!viewport || !/width|initial-scale/i.test(viewport.getAttribute("content") ?? "")) {
    motivos.push("sem meta viewport (o celular desenharia em 980 px e encolheria tudo)");
  }
  const ler = leitorDeValores(documento, { tela: telaDaLargura(largura) });
  for (const elemento of Array.from(documento.body?.querySelectorAll("*") ?? [])) {
    if (elemento.closest("script, style, template, [hidden]")) continue;
    const rotulo = `<${elemento.tagName.toLowerCase()}${elemento.id ? `#${elemento.id}` : elemento.classList[0] ? `.${elemento.classList[0]}` : ""}>`;
    for (const propriedade of ["width", "min-width"]) {
      const efetivo = ler(elemento, propriedade);
      const px = efetivo.tipo === "valor" ? emPx(efetivo.valor) : null;
      if (px !== null && px > largura) motivos.push(`${rotulo} tem ${propriedade}: ${px}px`);
    }
    const colunas = ler(elemento, "grid-template-columns");
    if (colunas.tipo === "valor") {
      const soma = colunas.valor
        .split(/\s+/)
        .map(emPx)
        .reduce<number>((total, px) => total + (px ?? 0), 0);
      if (soma > largura) motivos.push(`${rotulo} tem colunas de grid somando ${soma}px`);
    }
  }
  return motivos;
}

/** Um item de checklist: parte do desafio ou requisito do projeto-ponte. */
export type ItemChecklist = { id: string; descricao: string; validador: Validador; solucaoDeTeste: readonly Acao[] };

/** Os itens do checklist da fase (partes do desafio, requisitos do projeto), ou null na prática. */
export function itensDoChecklist(fase: Fase): readonly ItemChecklist[] | null {
  if (fase.tipo === "desafio") return fase.partes;
  if (fase.tipo === "projeto-ponte") return fase.requisitos;
  return null;
}

/**
 * Desafio e projeto-ponte: recalcula quais itens estão marcados no
 * checklist. Os travados (`validadorTravado`) continuam marcados para
 * sempre, uma vez que passem; os demais são conferidos de novo a cada
 * checagem.
 */
export function recalcularPartesFeitas(
  fase: FaseDesafio | FaseProjetoPonte,
  partesFeitas: readonly string[],
  contexto: ContextoValidacao,
): string[] {
  return (itensDoChecklist(fase) ?? [])
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
