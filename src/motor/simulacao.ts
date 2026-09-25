/*
 * Simulação de uma fase fora da tela: um Document solto (DOMParser), o
 * mesmo núcleo do painel que a interface usa e o executor de ações.
 *
 * Serve para os testes de conteúdo (jsdom), para as checagens do
 * /lab/fases (no navegador) e para gerar o "depois" da meta do desafio.
 */
import type { Acao, Fase, FaseDesafio, Previsao, Validador } from "@/conteudo/tipos";
import {
  atualizarAcentos,
  criarDocumentoInteiroSolto,
  criarDocumentoSolto,
  documentoInteiroInicial,
  lerCssDoDocumento,
  serializarDocumentoInteiro,
} from "@/lib/documentoSiteAlvo";
import type { EventoFase } from "./eventos";
import { executarAcoes, type PainelDasAcoes } from "./executarAcao";
import { criarNucleoPainel, viaDaOrigem } from "./nucleoPainel";
import { avaliarDetalhado, type ContextoValidacao, type ResultadoValidador } from "./validadores";

/**
 * O documento inicial da fase, solto (fora da tela): o head fixo com o
 * body ou, no modo documento, o documento inteiro já preparado como a
 * prévia (estilos do jogo e simulação dos acentos).
 */
export function documentoSoltoDaFase(fase: Fase): Document {
  const css = fase.siteAlvo.css ?? null;
  return fase.modoDocumento
    ? criarDocumentoInteiroSolto(documentoInteiroInicial(fase.siteAlvo.head, fase.siteAlvo.body), css)
    : criarDocumentoSolto(fase.siteAlvo.head, fase.siteAlvo.body, css);
}

export function criarSimulacao(fase: Fase) {
  const documento = documentoSoltoDaFase(fase);
  const inicial = documentoSoltoDaFase(fase);
  let eventos: EventoFase[] = [];
  let previsaoAtual: Previsao | null = null;
  let respostaPrevisao: number | null = null;

  const nucleo = criarNucleoPainel({
    obterDocumento: () => documento,
    mutarDocumento: (mutar) => {
      const mudou = mutar(documento);
      // Como a prévia: o meta charset entrou ou saiu, os acentos acompanham.
      if (mudou && fase.modoDocumento) atualizarAcentos(documento);
      return mudou;
    },
    aoEvento: (evento) => eventos.push(evento),
  });

  const painel: PainelDasAcoes = {
    obterDocumento: () => documento,
    noSelecionado: nucleo.noSelecionado,
    selecionar: nucleo.selecionar,
    editarTexto: nucleo.editarTexto,
    editarAtributo: nucleo.editarAtributo,
    adicionarAtributos: nucleo.adicionarAtributos,
    alternarEsconder: nucleo.alternarEsconder,
    apagar: nucleo.apagar,
    duplicar: nucleo.duplicar,
    renomearTag: nucleo.renomearTag,
    clicarLink: nucleo.clicarLink,
    inserirHtml: nucleo.inserirHtml,
    desfazer: nucleo.desfazer,
    definirPropriedade: nucleo.definirPropriedade,
    alternarPropriedade: nucleo.alternarPropriedade,
    adicionarRegra: nucleo.adicionarRegra,
    escreverCss: nucleo.escreverCss,
    lerCss: nucleo.lerCss,
    responderPrevisao: (opcao) => {
      respostaPrevisao = opcao;
      eventos.push({ tipo: "respondeuPrevisao", opcao, acertou: previsaoAtual?.correta === opcao });
    },
  };

  const contexto = (): ContextoValidacao => {
    const selecao = nucleo.selecao();
    const no = nucleo.noSelecionado();
    return {
      documento,
      inicial,
      selecao: selecao && no ? { no, via: viaDaOrigem(selecao.origem) } : null,
      eventos,
    };
  };

  return {
    documento,
    nucleo,
    painel,
    /** Começa um objetivo novo: zera os eventos e a previsão. */
    comecarObjetivo(previsao: Previsao | null) {
      eventos = [];
      previsaoAtual = previsao;
      respostaPrevisao = null;
    },
    respostaPrevisao: () => respostaPrevisao,
    contexto,
    avaliar: (validador: Validador): ResultadoValidador => avaliarDetalhado(validador, contexto()),
    /** Executa ações pelo painel. Lança ErroAcao dizendo qual quebrou. */
    executar: (acoes: readonly Acao[]) => executarAcoes(acoes, painel),
    /** O texto do editor: o body ou, no modo documento, o documento inteiro. */
    htmlAtual: () => (fase.modoDocumento ? serializarDocumentoInteiro(documento) : documento.body.innerHTML),
    cssAtual: () => lerCssDoDocumento(documento),
  };
}

export type Simulacao = ReturnType<typeof criarSimulacao>;

/**
 * O body (e o CSS, se a fase tem) do desafio depois de aplicar as soluções
 * de todas as partes: é o "depois" da meta. Parte que falhar é pulada (os
 * testes acusam).
 */
export function estadoFinalDoDesafio(fase: FaseDesafio): { body: string; css: string | null } {
  const simulacao = criarSimulacao(fase);
  for (const parte of fase.partes) {
    try {
      simulacao.executar(parte.solucaoDeTeste);
    } catch {
      // Conteúdo quebrado: npm run testar:conteudo mostra o motivo.
    }
  }
  return { body: simulacao.htmlAtual(), css: simulacao.cssAtual() };
}
