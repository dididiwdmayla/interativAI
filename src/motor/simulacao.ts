/*
 * Simulação de uma fase fora da tela: um Document solto (DOMParser), o
 * mesmo núcleo do painel que a interface usa e o executor de ações.
 *
 * Serve para os testes de conteúdo (jsdom), para as checagens do
 * /lab/fases (no navegador) e para gerar o "depois" da meta do desafio.
 */
import { montarArquivos } from "@/lib/exportarProjeto";
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
import { auditar } from "./auditoria";
import { type EstadoCampanha, estadoInicialDaCampanha } from "./campanha";
import { eventoDoClique, type Utm } from "./medicao";
import { caminhoDoNo, raizDaArvore } from "@/lib/dom";
import { materializarSiteAlvo } from "./siteDoJogo";
import { avaliarDetalhado, type ContextoValidacao, type ResultadoValidador } from "./validadores";
import { criarNucleoSincrono } from "./executor/fabrica";
import type { FotoMemoria, OrigemCodigo, ResultadoExecucao } from "./executor/tipos";
import { chaveFuncaoPassa, type EstadoPrograma, resumirExecucao, testesDeFuncaoDaFase } from "./programa";
import * as bancada from "./circuito/modelo";
import { circuitoDaFase } from "./tiposDeFase";

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
  // A origem da última visita simulada (medição) e a campanha (simulador).
  let visita: Utm | null = null;
  const campanhaDaFase = fase.tipo === "simulador-campanha" ? fase.campanha : null;
  let campanha: EstadoCampanha = campanhaDaFase ? estadoInicialDaCampanha(campanhaDaFase) : { orcamento: 0, palavra: "", lance: 0 };
  const avisarDispositivo = () => {
    const { largura, altura } = medidasNaTela(dispositivo);
    eventos.push({ tipo: "trocouDispositivo", ligado: dispositivo.ligado, modelo: dispositivo.modelo, largura, altura });
  };

  // Fase de programa: o executor síncrono (vm no Node, iframe no /lab e na meta), com a mesma lógica do jogo.
  const executor = fase.programa ? criarNucleoSincrono() : null;
  let snippet = fase.programa?.snippet?.codigoInicial ?? "";
  let ultimaExecucao: ResultadoExecucao | null = null;
  const estadoPrograma: EstadoPrograma = { memoria: null, testes: {} };
  const testesDaFase = fase.programa ? testesDeFuncaoDaFase(fase) : [];
  const rodarCodigo = (codigo: string, origem: OrigemCodigo, registrar = true) => {
    if (!executor) return;
    const resultado = executor.executar(codigo, origem);
    ultimaExecucao = resultado;
    estadoPrograma.memoria = resultado.memoriaFinal;
    for (const teste of testesDaFase) estadoPrograma.testes[chaveFuncaoPassa(teste)] = executor.testarFuncao(teste.nome, teste.casos);
    if (registrar) eventos.push({ tipo: "executouCodigo", execucao: resumirExecucao(resultado) });
  };
  if (fase.programa?.preparo) rodarCodigo(fase.programa.preparo, "console", false);

  // Circuito lógico: as mesmas funções do modelo que a bancada da tela usa.
  let circuito: bancada.Circuito | null = circuitoDaFase(fase)?.inicial ?? null;
  const mudarCircuito = (novo: bancada.Circuito | null): boolean => {
    if (!novo || !circuito) return false;
    circuito = novo;
    return true;
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
    // Levar pro mundo fora da tela: monta os arquivos de verdade (sem baixar) e avisa o evento.
    levarProMundo: fase.usaFerramentas.includes("levar-pro-mundo")
      ? () => {
          const arquivos = montarArquivos(serializarDocumentoInteiro(documento), lerCssDoDocumento(documento));
          eventos.push({ tipo: "exportouProjeto", arquivos: Object.keys(arquivos) });
        }
      : undefined,
    analisarAuditoria: fase.usaFerramentas.includes("lighthouse")
      ? () => {
          const { notas } = auditar(documento, comDispositivo && dispositivo.ligado ? { tela: telaDoDispositivo(dispositivo, documento) ?? undefined } : {});
          eventos.push({ tipo: "auditou", notas });
        }
      : undefined,
    // Medição simulada fora da tela: o mesmo evento que a prévia gera.
    clicarNaPrevia: fase.usaFerramentas.includes("medicao")
      ? (elemento) => {
          const medido = eventoDoClique(elemento);
          if (medido) eventos.push({ tipo: "eventoMedido", nome: medido.nome, origem: visita });
          const raiz = raizDaArvore(documento);
          const link = elemento.closest("a, area");
          const caminho = link && raiz ? caminhoDoNo(raiz, link) : null;
          if (caminho) nucleo.clicarLink(caminho);
        }
      : undefined,
    simularVisita: fase.usaFerramentas.includes("link-rastreavel")
      ? (utm) => {
          visita = utm;
          eventos.push({ tipo: "visitaSimulada", utm });
        }
      : undefined,
    configurarCampanha: campanhaDaFase
      ? (mudanca) => {
          campanha = {
            orcamento: mudanca.orcamento ?? campanha.orcamento,
            palavra: mudanca.palavra ?? campanha.palavra,
            lance: mudanca.lance ?? campanha.lance,
          };
          eventos.push({ tipo: "configurouCampanha", ...campanha });
        }
      : undefined,
    programa: executor
      ? {
          executarNoConsole: (codigo) => rodarCodigo(codigo, "console"),
          definirSnippet: (codigo) => {
            snippet = codigo;
          },
          executarSnippet: () => rodarCodigo(snippet, "snippet"),
        }
      : undefined,
    circuito:
      circuito !== null
        ? {
            adicionarPortao: (portao, id, lugar) => {
              if (!circuito || circuito.pecas.some((p) => p.id === id)) return false;
              mudarCircuito(bancada.adicionarPortao(circuito, portao, id, lugar));
              eventos.push({ tipo: "mudouCircuito" });
              return true;
            },
            ligarFio: (de, para, porta) => {
              if (!circuito || !mudarCircuito(bancada.ligarFio(circuito, { de, para, porta }))) return false;
              eventos.push({ tipo: "mudouCircuito" });
              return true;
            },
            alternarEntrada: (entrada, ligada) => {
              const peca = circuito?.pecas.find((p) => p.id === entrada && p.tipo === "entrada");
              if (!circuito || !peca) return false;
              mudarCircuito(bancada.alternarEntrada(circuito, entrada, ligada));
              eventos.push({ tipo: "alternouEntrada", entrada, ligada: ligada ?? !peca.ligada });
              return true;
            },
            apagarPeca: (id) => {
              const peca = circuito?.pecas.find((p) => p.id === id);
              if (!circuito || !peca || peca.fixa) return false;
              mudarCircuito(bancada.apagarPeca(circuito, id));
              eventos.push({ tipo: "mudouCircuito" });
              return true;
            },
            verComoCodigo: () => {
              eventos.push({ tipo: "viuCodigoDoCircuito" });
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
      campanha: campanhaDaFase ? { dados: campanhaDaFase, estado: campanha } : undefined,
      programa: fase.programa ? estadoPrograma : undefined,
      circuito: circuito ?? undefined,
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
    /** (Fase de programa) A última execução e o texto do Snippet agora. */
    programa: () => ({ ultimaExecucao, snippet, disponivel: executor !== null }),
    /** (Circuito) O circuito agora. */
    circuito: () => circuito,
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

/**
 * (Desafio com circuito) O circuito antes (o que a fase traz) e depois das
 * soluções de todas as partes: a bancada da meta. Null sem circuito.
 */
export function circuitosDoDesafio(fase: FaseDesafio): { antes: bancada.Circuito; depois: bancada.Circuito } | null {
  if (!fase.circuito) return null;
  const simulacao = criarSimulacao(fase);
  for (const parte of fase.partes) {
    try {
      simulacao.executar(parte.solucaoDeTeste);
    } catch {
      // Conteúdo quebrado: npm run testar:conteudo mostra o motivo.
    }
  }
  return { antes: fase.circuito.inicial, depois: simulacao.circuito() ?? fase.circuito.inicial };
}

/**
 * (Desafio de programa) A memória antes (depois do preparo) e depois das
 * soluções de todas as partes: o palco da meta. Sem onde rodar, null.
 */
export function memoriasDoDesafio(fase: FaseDesafio): { antes: FotoMemoria | null; depois: FotoMemoria | null } {
  const simulacao = criarSimulacao(fase);
  const antes = simulacao.programa().ultimaExecucao?.memoriaFinal ?? null;
  for (const parte of fase.partes) {
    try {
      simulacao.executar(parte.solucaoDeTeste);
    } catch {
      // Conteúdo quebrado: npm run testar:conteudo mostra o motivo.
    }
  }
  return { antes, depois: simulacao.programa().ultimaExecucao?.memoriaFinal ?? null };
}
