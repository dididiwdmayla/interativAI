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
import {
  DISPOSITIVO_INICIAL,
  type EstadoDispositivo,
  girarDispositivo,
  medidasNaTela,
  orientacaoDe,
  telaDoDispositivo,
  trocarModelo,
} from "./dispositivos";
import { materializarSiteAlvo } from "./siteDoJogo";
import { avaliarDetalhado, type ContextoValidacao, type ResultadoValidador } from "./validadores";

/**
 * O documento inicial da fase, solto (fora da tela): o head fixo com o
 * body ou, no modo documento, o documento inteiro já preparado como a
 * prévia (estilos do jogo e simulação dos acentos).
 */
export function documentoSoltoDaFase(fase: Fase): Document {
  // Site-alvo "jogo" (E5) sem folha: as cores do Doce (a fase aberta no jogo já vem pronta).
  const siteAlvo = materializarSiteAlvo(fase.siteAlvo);
  const css = siteAlvo.css ?? null;
  return fase.modoDocumento
    ? criarDocumentoInteiroSolto(documentoInteiroInicial(siteAlvo.head, siteAlvo.body), css)
    : criarDocumentoSolto(siteAlvo.head, siteAlvo.body, css);
}

export function criarSimulacao(fase: Fase) {
  const documento = documentoSoltoDaFase(fase);
  const inicial = documentoSoltoDaFase(fase);
  let eventos: EventoFase[] = [];
  let previsaoAtual: Previsao | null = null;
  let respostaPrevisao: number | null = null;
  // A barra de dispositivo, só nas fases que têm a ferramenta.
  let dispositivo: EstadoDispositivo = DISPOSITIVO_INICIAL;
  const comDispositivo = fase.usaFerramentas.includes("modo-dispositivo");
  const avisarDispositivo = () => {
    const { largura, altura } = medidasNaTela(dispositivo);
    eventos.push({ tipo: "trocouDispositivo", ligado: dispositivo.ligado, modelo: dispositivo.modelo, largura, altura });
  };

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
    // Salvar o tema fora da tela: só o evento (o progresso de verdade não é tocado).
    salvarTema:
      fase.siteAlvo.tipo === "jogo"
        ? () => {
            eventos.push({ tipo: "temaSalvo", paresRuins: 0 });
            return true;
          }
        : undefined,
    dispositivo: comDispositivo
      ? {
          trocar: (modelo, largura) => {
            dispositivo = trocarModelo(dispositivo, modelo, largura);
            avisarDispositivo();
          },
          girar: () => {
            dispositivo = girarDispositivo(dispositivo);
            eventos.push({ tipo: "girou", orientacao: orientacaoDe(dispositivo) });
          },
          desligar: () => {
            dispositivo = { ...dispositivo, ligado: false };
            avisarDispositivo();
          },
        }
      : undefined,
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
      dispositivo: comDispositivo ? dispositivo : null,
      tela: (comDispositivo ? telaDoDispositivo(dispositivo, documento) : null) ?? undefined,
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
    /** O modo dispositivo agora (nas fases com a ferramenta). */
    dispositivo: () => dispositivo,
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
