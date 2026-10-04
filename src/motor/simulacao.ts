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
import { chaveFuncaoPassa, type EstadoPrograma, medicoesDaFase, resumirExecucao, testesDeFuncaoDaFase } from "./programa";
import { chamadasDaMedicao } from "./desempenho";
import { ehArvore } from "./estruturas";
import * as bancada from "./circuito/modelo";
import { circuitoDaFase } from "./tiposDeFase";
import { casosDaFase, quadroDaFase, temArea } from "./composicao";
import * as casosDoAluno from "./casos/modelo";
import { codigoComPlano, linhaDoPasso } from "./plano/comentarios";
import * as quadro from "./ordenar/modelo";
import { alternarPonto, faseComDepurador, linhaDoPontoDeParada, normalizarExpressao, type PausaDepurador, primeiraPausa, proximaPausa } from "./depurador";

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
  let executor = fase.programa ? criarNucleoSincrono() : null;
  let snippet = fase.programa?.snippet?.codigoInicial ?? "";
  let ultimaExecucao: ResultadoExecucao | null = null;
  const estadoPrograma: EstadoPrograma = { memoria: null, testes: {} };
  const testesDaFase = fase.programa ? testesDeFuncaoDaFase(fase) : [];
  // Depurador da aba Fontes: as mesmas pausas da tela, sobre o rastro (src/motor/depurador.ts).
  const comDepurador = faseComDepurador(fase);
  const depurador = { pontos: [] as number[], observacoes: [] as string[] };
  if (comDepurador) estadoPrograma.depurador = depurador;
  let sessao: { resultado: ResultadoExecucao; pausa: PausaDepurador } | null = null;
  const medicoesPedidas = fase.programa ? medicoesDaFase(fase) : [];
  const concluir = (resultado: ResultadoExecucao, registrar: boolean) => {
    if (!executor) return;
    ultimaExecucao = resultado;
    estadoPrograma.memoria = resultado.memoriaFinal;
    for (const teste of testesDaFase) estadoPrograma.testes[chaveFuncaoPassa(teste)] = executor.testarFuncao(teste.nome, teste.casos);
    if (medicoesPedidas.length) {
      const medicoes: NonNullable<EstadoPrograma["medicoes"]> = {};
      for (const pedida of medicoesPedidas) medicoes[pedida.chave] = executor.medirPassos(pedida.funcao, [{ tamanho: pedida.tamanho, args: pedida.args }])[0];
      estadoPrograma.medicoes = medicoes;
    }
    if (registrar) eventos.push({ tipo: "executouCodigo", execucao: resumirExecucao(resultado) });
  };
  /** As expressões do Observar no momento pausado (o quadro de cima). */
  const observarNaPausa = (expressoes: readonly string[]) => {
    if (!executor || !sessao) return;
    const memoria = sessao.resultado.passos[sessao.pausa.indice].memoria;
    for (const r of executor.avaliarNaFoto(expressoes, memoria, memoria.quadros.length - 1)) {
      eventos.push({ tipo: "observouValor", expressao: r.expressao, valor: "valor" in r ? r.valor : null });
    }
  };
  const anunciarPausa = () => {
    if (!sessao) return;
    eventos.push({ tipo: "pausouNoDepurador", linha: sessao.pausa.linha, motivo: sessao.pausa.motivo });
    observarNaPausa(depurador.observacoes);
  };
  const terminarSessao = () => {
    if (!sessao) return;
    const { resultado } = sessao;
    sessao = null;
    concluir(resultado, true);
  };
  const rodarCodigo = (codigo: string, origem: OrigemCodigo, registrar = true) => {
    if (!executor) return;
    // Pausado: o Console responde no momento da pausa (sem mudar o programa).
    if (sessao && origem === "console") {
      observarNaPausa([codigo]);
      return;
    }
    terminarSessao();
    const resultado = executor.executar(codigo, origem);
    const pausa = comDepurador && origem === "snippet" && registrar ? primeiraPausa(resultado.passos, depurador.pontos) : null;
    if (pausa) {
      sessao = { resultado, pausa };
      anunciarPausa();
      return;
    }
    concluir(resultado, registrar);
  };
  if (fase.programa?.preparo) rodarCodigo(fase.programa.preparo, "console", false);

  // Circuito lógico: as mesmas funções do modelo que a bancada da tela usa.
  let circuito: bancada.Circuito | null = circuitoDaFase(fase)?.inicial ?? null;
  const mudarCircuito = (novo: bancada.Circuito | null): boolean => {
    if (!novo || !circuito) return false;
    circuito = novo;
    return true;
  };

  // Ordenar passos: as mesmas funções do modelo que o quadro da tela usa.
  const dadosOrdenar = quadroDaFase(fase);
  let ordenar: quadro.EstadoOrdenar | null = dadosOrdenar ? quadro.estadoInicialOrdenar(dadosOrdenar) : null;
  // Fase composta com a área testes: os casos do aluno, rodados contra a função do Snippet.
  const dadosCasos = casosDaFase(fase);
  let casos: casosDoAluno.EstadoCasos | null = dadosCasos ? casosDoAluno.estadoInicialCasos(dadosCasos) : null;
  // Fase composta com plano e Snippet: o plano vira comentários no código, e mexer no plano atualiza o bloco.
  const planoNoCodigo = temArea(fase, "plano") && temArea(fase, "snippet") && dadosOrdenar !== null;
  const acompanharPlano = () => {
    if (planoNoCodigo && dadosOrdenar && ordenar) snippet = codigoComPlano(snippet, dadosOrdenar, ordenar, false);
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
    depurador: comDepurador
      ? {
          alternarPontoDeParada: (linha) => {
            const alvo = linhaDoPontoDeParada(snippet, linha);
            depurador.pontos = alternarPonto(depurador.pontos, alvo);
            eventos.push({ tipo: "alternouPontoDeParada", linha: alvo, ativo: depurador.pontos.includes(alvo) });
          },
          controlar: (controle) => {
            if (!sessao) return false;
            eventos.push({ tipo: "usouControleDepurador", controle });
            const proxima = proximaPausa(sessao.resultado.passos, sessao.pausa.indice, controle, depurador.pontos);
            if (proxima) {
              sessao.pausa = proxima;
              anunciarPausa();
            } else terminarSessao();
            return true;
          },
          observar: (expressao) => {
            const limpa = expressao.trim();
            if (!limpa) return;
            if (!depurador.observacoes.some((e) => normalizarExpressao(e) === normalizarExpressao(limpa))) depurador.observacoes = [...depurador.observacoes, limpa];
            eventos.push({ tipo: "adicionouObservacao", expressao: limpa });
            observarNaPausa([limpa]);
          },
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
    ordenar: dadosOrdenar
      ? {
          porPasso: (passo, posicao, grupo) => {
            if (!ordenar) return false;
            const destino = grupo ?? (dadosOrdenar.modo === "agrupar" ? (dadosOrdenar.cartoes.find((c) => c.id === passo)?.grupo ?? "") : quadro.LISTA_DO_PLANO);
            const novo = quadro.porPasso(dadosOrdenar, ordenar, passo, destino, posicao);
            if (!novo) return false;
            ordenar = novo;
            acompanharPlano();
            eventos.push({ tipo: "moveuPasso", passo, destino, posicao: quadro.ondeEsta(novo, passo)?.posicao ?? 0 });
            return true;
          },
          tirarPasso: (passo) => {
            if (!ordenar || !dadosOrdenar.cartoes.some((c) => c.id === passo)) return false;
            ordenar = quadro.tirarPasso(ordenar, passo);
            acompanharPlano();
            eventos.push({ tipo: "moveuPasso", passo, destino: "fora", posicao: 0 });
            return true;
          },
          rodarPlano: () => {
            if (!ordenar || !dadosOrdenar.rodar || !executor) return false;
            // Cada ordem roda com a memória zerada, como na tela.
            executor = criarNucleoSincrono();
            if (fase.programa?.preparo) executor?.executar(fase.programa.preparo, "console", { gravar: false });
            rodarCodigo(quadro.codigoDoPlano(dadosOrdenar, ordenar), "snippet");
            return true;
          },
        }
      : undefined,
    plano: planoNoCodigo
      ? {
          levarProCodigo: () => {
            if (!dadosOrdenar || !ordenar) return false;
            snippet = codigoComPlano(snippet, dadosOrdenar, ordenar, true);
            eventos.push({ tipo: "levouPlanoProCodigo", passos: quadro.ordemDoPlano(dadosOrdenar, ordenar).length });
            return true;
          },
          verPassoNoCodigo: (passo) => {
            const linha = dadosOrdenar ? linhaDoPasso(dadosOrdenar, snippet, passo) : null;
            if (linha === null) return false;
            eventos.push({ tipo: "apontouPasso", passo, linha });
            return true;
          },
        }
      : undefined,
    casos:
      dadosCasos && casos
        ? {
            escrever: (entrada, esperado) => {
              if (!casos) return false;
              const novo = casosDoAluno.adicionarCaso(casos, entrada, esperado);
              if (novo === casos) return false;
              casos = novo;
              eventos.push({ tipo: "editouCasos", total: novo.casos.length });
              return true;
            },
            apagar: (indice) => {
              const caso = casos?.casos[indice];
              if (!casos || !caso) return false;
              casos = casosDoAluno.apagarCaso(casos, caso.id);
              eventos.push({ tipo: "editouCasos", total: casos.casos.length });
              return true;
            },
            rodar: () => {
              if (!casos || !executor) return false;
              // Como na tela: roda o código do Snippet e chama a função com cada caso.
              rodarCodigo(snippet, "snippet");
              const erro = ultimaExecucao?.erro;
              const erroDoCodigo = erro ? `${erro.nome ? `${erro.nome}: ` : ""}${erro.mensagem}` : null;
              const rodados = casosDoAluno.casosParaRodar(casos);
              const teste = erroDoCodigo || !executor ? null : executor.testarFuncao(dadosCasos.funcao, rodados.map((r) => r.caso));
              casos = casosDoAluno.resultadosDaRodada(casos, dadosCasos, rodados, teste, erroDoCodigo);
              const resultados = casos.resultados;
              eventos.push({ tipo: "rodouCasos", total: rodados.length, passaram: rodados.filter((r) => resultados[r.id]?.passou).length });
              return true;
            },
          }
        : undefined,
    estruturas: fase.programa
      ? {
          verComoArvore: fase.usaFerramentas.includes("arvore-palco")
            ? (nome) => {
                if (!ehArvore(estadoPrograma.memoria, nome)) return false;
                eventos.push({ tipo: "viuComoArvore", nome });
                return true;
              }
            : undefined,
          medirDesempenho:
            fase.usaFerramentas.includes("grafico-passos") && fase.programa.desempenho
              ? () => {
                  const config = fase.programa?.desempenho;
                  if (!config || !executor) return false;
                  const medicoes = config.funcoes.flatMap((funcao) => executor?.medirPassos(funcao.nome, chamadasDaMedicao(config, funcao)) ?? []);
                  eventos.push({ tipo: "mediuDesempenho", medicoes });
                  return true;
                }
              : undefined,
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
      ordenar: dadosOrdenar && ordenar ? { dados: dadosOrdenar, estado: ordenar } : undefined,
      snippet: fase.programa?.snippet ? snippet : undefined,
      casos: dadosCasos && casos ? { dados: dadosCasos, estado: casos } : undefined,
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
    /** (Fase de programa) A última execução e o texto do Snippet agora; com o depurador, a pausa de agora. */
    programa: () => ({ ultimaExecucao, snippet, disponivel: executor !== null, pausa: sessao?.pausa ?? null, depurador }),
    /** (Circuito) O circuito agora. */
    circuito: () => circuito,
    /** (Ordenar) Onde está cada cartão agora. */
    ordenar: () => ordenar,
    /** (Área testes) Os casos do aluno agora, com os resultados da última rodada. */
    casos: () => casos,
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

/** (Desafio composto) O que cada área mostra num momento: o plano, o código, os casos e a memória. */
export type RetratoComposicao = {
  /** Os passos do plano, na ordem (null: a fase não tem a área plano). */
  plano: string[] | null;
  /** O texto do Snippet (null: sem a área snippet). */
  codigo: string | null;
  /** Os casos do aluno, com o resultado da última rodada (null: sem a área testes). */
  casos: { chamada: string; esperado: string; passou: boolean | null }[] | null;
  /** A memória depois da última execução (null: nada rodou ou sem programa). */
  memoria: FotoMemoria | null;
};

function retratoDaComposicao(fase: Fase, simulacao: Simulacao): RetratoComposicao {
  const dados = quadroDaFase(fase);
  const estado = simulacao.ordenar();
  const dadosCasos = casosDaFase(fase);
  const casos = simulacao.casos();
  return {
    plano: dados && estado ? quadro.ordemDoPlano(dados, estado).map((id) => dados.cartoes.find((c) => c.id === id)?.texto ?? id) : null,
    codigo: temArea(fase, "snippet") ? simulacao.programa().snippet : null,
    casos:
      dadosCasos && casos
        ? casos.casos.map((caso) => ({ chamada: `${dadosCasos.funcao}(${caso.entrada})`, esperado: caso.esperado, passou: casos.resultados[caso.id]?.passou ?? null }))
        : null,
    memoria: simulacao.programa().ultimaExecucao?.memoriaFinal ?? null,
  };
}

/**
 * (Desafio composto) As áreas antes (o que a fase traz) e depois das soluções
 * de todas as partes: o plano montado, o código com o plano nos comentários e
 * os casos passando. É o antes e depois da meta.
 */
export function composicaoDoDesafio(fase: FaseDesafio): { antes: RetratoComposicao; depois: RetratoComposicao } {
  const simulacao = criarSimulacao(fase);
  const antes = retratoDaComposicao(fase, simulacao);
  for (const parte of fase.partes) {
    try {
      simulacao.executar(parte.solucaoDeTeste);
    } catch {
      // Conteúdo quebrado: npm run testar:conteudo mostra o motivo.
    }
  }
  return { antes, depois: retratoDaComposicao(fase, simulacao) };
}
