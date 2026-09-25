"use client";

import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlvoFerramenta } from "@/componentes/ferramentas/AlvoFerramenta";
import { ApresentacaoFerramenta } from "@/componentes/ferramentas/ApresentacaoFerramenta";
import { BotaoFerramentas } from "@/componentes/ferramentas/BotaoFerramentas";
import { CaixaFerramentas } from "@/componentes/ferramentas/CaixaFerramentas";
import { useApresentacoes } from "@/componentes/ferramentas/useApresentacoes";
import type { ApiLab, ItemLab } from "@/componentes/lab/tipos";
import { BarraSuperior } from "@/componentes/layout/BarraSuperior";
import { BarraSuperiorMovel } from "@/componentes/layout/BarraSuperiorMovel";
import { BotaoMapa } from "@/componentes/layout/BotaoMapa";
import { BotaoRecomecar } from "@/componentes/layout/BotaoRecomecar";
import { BotaoSom } from "@/componentes/layout/BotaoSom";
import { SeletorTema } from "@/componentes/layout/SeletorTema";
import { AreaMascote } from "@/componentes/mascote/AreaMascote";
import { BalaoFala } from "@/componentes/mascote/BalaoFala";
import { BarraObjetivosMovel } from "@/componentes/mascote/BarraObjetivosMovel";
import { CampoTutor } from "@/componentes/mascote/CampoTutor";
import { ChecklistDesafio } from "@/componentes/mascote/ChecklistDesafio";
import { ListaObjetivos, type ObjetivoNaTela } from "@/componentes/mascote/ListaObjetivos";
import { ListaRever } from "@/componentes/mascote/ListaRever";
import { Mascote } from "@/componentes/mascote/Mascote";
import { MascoteFlutuante } from "@/componentes/mascote/MascoteFlutuante";
import { SeloSozinho } from "@/componentes/mascote/SeloSozinho";
import { Tropeco } from "@/componentes/mascote/Tropeco";
import { ArvoreElementos } from "@/componentes/painel/arvore/ArvoreElementos";
import { TrilhaElementos } from "@/componentes/painel/arvore/TrilhaElementos";
import { BotaoInspecionar } from "@/componentes/painel/BotaoInspecionar";
import { BotoesHistorico } from "@/componentes/painel/BotoesHistorico";
import { CabecalhoEditor } from "@/componentes/painel/editor/CabecalhoEditor";
import { EditorCodigo } from "@/componentes/painel/editor/EditorCodigo";
import { Painel } from "@/componentes/painel/Painel";
import { PainelDividido } from "@/componentes/painel/PainelDividido";
import { CamadaInspecao } from "@/componentes/preview/CamadaInspecao";
import { JanelaNavegador } from "@/componentes/preview/JanelaNavegador";
import { PreviewSiteAlvo } from "@/componentes/preview/PreviewSiteAlvo";
import { SobreposicaoInspecao } from "@/componentes/preview/SobreposicaoInspecao";
import { Botao } from "@/componentes/ui/Botao";
import { SeletorSegmentado } from "@/componentes/ui/SeletorSegmentado";
import { faseDoId, type LocalDaFase, proximaFase } from "@/conteudo";
import type { Fala, Fase } from "@/conteudo/tipos";
import type { IdFerramenta } from "@/ferramentas/ids";
import { FERRAMENTAS, type Ferramenta } from "@/ferramentas/registro";
import { sinalizarUso } from "@/ferramentas/uso";
import { atualizarProgresso, obterProgresso, useProgresso } from "@/lib/armazemProgresso";
import { caminhoDoNo } from "@/lib/dom";
import { falaDoLink } from "@/lib/linksPrevia";
import { faseAbreComMeta } from "@/lib/metaDaUnidade";
import { type EstadoFaseSalvo, PROPORCAO_PREVIA } from "@/lib/progresso";
import { tocarSom } from "@/lib/som";
import { useToque } from "@/lib/useConsultaMidia";
import type { Aba } from "@/motor/abas";
import { criarBarramento } from "@/motor/barramento";
import { enunciadoDe, FALA_DESAFIO, falaFinalDe, type ModoJogo } from "@/motor/estadoMotor";
import { viaDaOrigem } from "@/motor/nucleoPainel";
import { avaliarDetalhado } from "@/motor/validadores";
import { AcoesConversa } from "./AcoesConversa";
import {
  atalhoHistorico,
  FALA_PENSANDO,
  FERRAMENTAS_DA_ARVORE,
  focoTemDesfazerProprio,
  focoUsaEnter,
  RECADO_PAISAGEM,
  responderSegredo,
  tempoDeLeitura,
} from "./ajudantesJogo";
import { ComemoracaoSozinho } from "./ComemoracaoSozinho";
import { AlcaDivisoria } from "./movel/AlcaDivisoria";
import { useLayoutJogo, useViewportVisivel } from "./movel/useLayoutJogo";
import { TelaConclusao } from "./TelaConclusao";
import { TelaMeta } from "./TelaMeta";
import { useMotorFase } from "./useMotorFase";
import { usePainelElementos } from "./usePainelElementos";
import { useSiteAlvo } from "./useSiteAlvo";
import { useTutor } from "./useTutor";

type Props = {
  fase: Fase;
  local: LocalDaFase;
  aoRecomecar: () => void;
  /** "jogo" (normal), "revisao" (aberta pelo Rever do desafio) ou "lab" (/lab/fases). */
  modo?: ModoJogo;
  /** Abre outra fase (Próxima fase, dentro da mesma unidade). */
  aoIrParaFase?: (faseId: string) => void;
  /** Botão "Mapa": a ilha desta fase. Sem ele (lab), não aparece. */
  rotaDoMapa?: string;
  /** Depois da última fase da unidade: volta para a ilha, que comemora. */
  aoVoltarAIlha?: () => void;
  /** Desafio: abre a fase onde uma parte foi ensinada, em modo revisão. */
  aoRever?: (faseId: string) => void;
  /** Revisão: volta para o desafio. */
  aoVoltarAoDesafio?: () => void;
  /** Só no lab: a gaveta com os validadores ao vivo. */
  painelLab?: (api: ApiLab) => ReactNode;
};

/** Por enquanto toda fase é da zona Elementos: só essa aba abre. */
const ABAS_DESBLOQUEADAS: readonly Aba[] = ["elementos"];

/** HTML para abrir a fase: o salvo, ou o de antes do momento roteirizado do objetivo atual. */
function bodyParaAbrir(fase: Fase, salvo: EstadoFaseSalvo | undefined): string {
  if (!salvo) return fase.siteAlvo.body;
  const objetivo = fase.tipo === "pratica" ? fase.objetivos[salvo.objetivoAtual] : undefined;
  if (salvo.introducaoVista && objetivo?.eventoAoComecar && salvo.htmlInicioObjetivo !== null) {
    return salvo.htmlInicioObjetivo;
  }
  return salvo.htmlAtual ?? fase.siteAlvo.body;
}

export function JogoFase({
  fase,
  local,
  aoRecomecar,
  modo = "jogo",
  aoIrParaFase,
  rotaDoMapa,
  aoVoltarAIlha,
  aoRever,
  aoVoltarAoDesafio,
  painelLab,
}: Props) {
  const lab = modo === "lab";
  const revisao = modo === "revisao";
  const [salvo] = useState(() => (modo === "jogo" ? obterProgresso().fasesEmAndamento[fase.id] : undefined));
  const [bodyInicial] = useState(() => bodyParaAbrir(fase, salvo));
  const [barramento] = useState(criarBarramento);
  const [aba, setAba] = useState<Aba>("elementos");
  const [quebrarLinhas, setQuebrarLinhas] = useState(true);
  const [segmento, setSegmento] = useState<"arvore" | "codigo">("arvore");
  const [balaoAberto, setBalaoAberto] = useState(true);
  const [proporcaoArrastada, setProporcaoArrastada] = useState<number | null>(null);
  const [rascunhoTutor, setRascunhoTutor] = useState("");
  const [recado, setRecado] = useState<string | null>(null);
  const esperaRecado = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recipienteMovel = useRef<HTMLElement>(null);
  const layout = useLayoutJogo();
  const movel = layout !== "desktop";
  const viewport = useViewportVisivel();
  const [caixa, setCaixa] = useState<{
    aberta: boolean;
    foco: IdFerramenta | null;
  }>({ aberta: false, foco: null });
  const progresso = useProgresso();
  const toque = useToque();

  // A meta (antes/depois) abre o desafio e, uma vez só, a entrada da unidade
  // (ver faseAbreComMeta). Decidido ao abrir a fase, com o progresso de então.
  const desafioDaUnidade = local.unidade.meta.desafioId ? faseDoId(local.unidade.meta.desafioId) : undefined;
  const desafioParaMeta = desafioDaUnidade?.tipo === "desafio" ? desafioDaUnidade : null;
  const [mostrarMeta] = useState(
    () => modo === "jogo" && desafioParaMeta !== null && faseAbreComMeta(fase, local.unidade, obterProgresso()),
  );
  // "Próxima fase" só dentro da unidade; depois da última, o caminho é voltar para a ilha.
  const seguinte = modo === "jogo" && aoIrParaFase ? proximaFase(fase) : null;
  const proxima = seguinte && seguinte.unidadeId === fase.unidadeId ? seguinte : null;

  const {
    editorRef,
    previewRef,
    arvore,
    htmlAtual,
    aoEditarCodigo,
    aoCarregarDocumento,
    obterDocumento,
    editarDocumento,
  } = useSiteAlvo(bodyInicial);

  const {
    caminhoSelecionado,
    recolhidos,
    realce,
    inspecionando,
    destaque,
    destacarNaArvore,
    selecionar,
    selecionarPeloCodigo,
    destacarNoEditor,
    alternarRecolhido,
    realcar,
    alternarInspecao,
    apontarNaTela,
    escolherNaTela,
    rolarTela,
    noSelecionado,
    selecao,
    historico,
    editarTexto,
    editarAtributo,
    alternarEsconder,
    apagar,
    duplicar,
    renomearTag,
    clicarLink,
    inserirHtml,
    desfazer,
    refazer,
    antesDeEditarCodigo,
    aoRecarregarDocumento,
  } = usePainelElementos({
    editorRef,
    obterDocumento,
    editarDocumento,
    aoEvento: barramento.emitir,
  });

  /** Quem fala sobre o link clicado (ligado ao motor mais abaixo). */
  const falarSobreLink = useRef<(fala: Fala) => void>(() => {});

  /**
   * Clique num link da prévia (à mão ou pela ação clicarLink): a prévia não
   * navega; âncora rola até o alvo, "#" volta ao topo, e o computadorzinho
   * conta para onde o link levaria (externo, quebrado ou vazio).
   */
  const clicarLinkNaTela = useCallback(
    (caminho: number[]) => {
      const resultado = clicarLink(caminho);
      if (!resultado) return null;
      const janela = obterDocumento()?.defaultView;
      const comportamento: ScrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      if (janela && resultado.destino === "ancora" && resultado.alvo) {
        janela.scrollTo({ top: resultado.alvo.getBoundingClientRect().top + janela.scrollY, behavior: comportamento });
      } else if (janela && resultado.href === "#") {
        janela.scrollTo({ top: 0, behavior: comportamento });
      }
      const fala = falaDoLink(resultado);
      if (fala) falarSobreLink.current(fala);
      return resultado;
    },
    [clicarLink, obterDocumento],
  );

  const aoClicarLink = useCallback(
    (link: Element) => {
      const body = obterDocumento()?.body;
      const caminho = body ? caminhoDoNo(body, link) : null;
      if (caminho) clicarLinkNaTela(caminho);
    },
    [clicarLinkNaTela, obterDocumento],
  );

  /** As mesmas funções que a interface usa; soluções e roteiros passam por elas. */
  const painel = useMemo(
    () => ({
      obterDocumento,
      noSelecionado,
      selecionar,
      editarTexto,
      editarAtributo,
      alternarEsconder,
      apagar,
      duplicar,
      renomearTag,
      clicarLink: clicarLinkNaTela,
      inserirHtml,
      desfazer,
    }),
    [
      obterDocumento,
      noSelecionado,
      selecionar,
      editarTexto,
      editarAtributo,
      alternarEsconder,
      apagar,
      duplicar,
      renomearTag,
      clicarLinkNaTela,
      inserirHtml,
      desfazer,
    ],
  );

  const obterSelecao = useCallback(() => {
    const atual = selecao();
    const no = noSelecionado();
    return atual && no ? { no, via: viaDaOrigem(atual.origem) } : null;
  }, [noSelecionado, selecao]);

  const motor = useMotorFase({
    fase,
    modo,
    mostrarMeta,
    salvo,
    barramento,
    htmlAtual,
    editorRef,
    obterDocumento,
    obterSelecao,
    painel,
    destacarNaArvore,
    toque,
  });
  const { estado, objetivo, previsaoPendente, pulsarFerramenta, falar } = motor;

  // A fala do link só entra quando não atrapalha: fora da conversa, da
  // pausa, do card de previsão e dos momentos roteirizados.
  useEffect(() => {
    const livre =
      (estado.etapa === "objetivos" && estado.pausa === null && !previsaoPendente && estado.roteiro === null) ||
      (estado.etapa === "concluida" && !estado.conclusaoAberta);
    falarSobreLink.current = livre ? falar : () => {};
  }, [estado.etapa, estado.pausa, estado.roteiro, estado.conclusaoAberta, previsaoPendente, falar]);
  const desafio = fase.tipo === "desafio" ? fase : null;

  const apresentacoes = useApresentacoes({
    fase,
    etapa: estado.etapa,
    objetivoAtual: estado.objetivoAtual,
    pausa: estado.pausa,
    bloqueada:
      lab ||
      caixa.aberta ||
      estado.roteiro !== null ||
      previsaoPendente ||
      (estado.etapa === "concluida" && estado.conclusaoAberta),
  });
  const ferramentaEmCena = apresentacoes.atual ? FERRAMENTAS[apresentacoes.atual] : null;

  const abrirCard = useCallback((id: IdFerramenta | null) => setCaixa({ aberta: true, foco: id }), []);

  /** Mostra o trecho do selecionado quando o código aparece de novo. */
  const trocarSegmento = (novo: "arvore" | "codigo") => {
    setSegmento(novo);
    if (novo === "codigo") requestAnimationFrame(() => destacarNoEditor(true));
  };

  /** Deixa o alvo da apresentação visível: no celular, abre ou fecha o balão e troca Árvore | Código. */
  const prepararAlvo = (ferramenta: Ferramenta) => {
    if (!movel) return;
    setBalaoAberto(ferramenta.id === "me-ajuda" || ferramenta.id === "tutor");
    if (FERRAMENTAS_DA_ARVORE.includes(ferramenta.id)) trocarSegmento("arvore");
    if (ferramenta.id === "editor" || ferramenta.id === "sincronia") trocarSegmento("codigo");
  };

  // O que o jogador faz no painel também conta como "usou a ferramenta".
  useEffect(
    () =>
      barramento.assinar((evento) => {
        if (evento.tipo === "selecionou" && (evento.origem === "arvore" || evento.origem === "teclado")) {
          sinalizarUso("arvore");
        } else if (evento.tipo === "selecionou" && evento.origem === "codigo") {
          sinalizarUso("sincronia");
        } else if (evento.tipo === "inspecionou") {
          sinalizarUso("inspecionar");
        } else if (evento.tipo === "editouCodigo") {
          sinalizarUso("editor");
        } else if (evento.tipo === "trilha") {
          sinalizarUso("trilha");
        } else if (evento.tipo === "escondeu" || evento.tipo === "mostrou") {
          sinalizarUso("esconder");
        } else if (evento.tipo === "apagou") {
          sinalizarUso("apagar");
        } else if (evento.tipo === "duplicou") {
          sinalizarUso("duplicar");
        } else if (evento.tipo === "desfez" || evento.tipo === "refez") {
          sinalizarUso("desfazer");
        } else if (evento.tipo === "renomeouTag") {
          sinalizarUso("renomear-tag");
        }
      }),
    [barramento],
  );

  // Lab: a gaveta se redesenha a cada evento do painel.
  const [versaoLab, setVersaoLab] = useState(0);
  useEffect(() => {
    if (!lab) return;
    return barramento.assinar(() => setVersaoLab((versao) => versao + 1));
  }, [barramento, lab]);

  const apiLab: ApiLab = {
    versao: versaoLab,
    avaliarItens: (): ItemLab[] => {
      const contexto = motor.contextoValidacao();
      if (fase.tipo === "desafio") {
        return fase.partes.map((parte, indice) => ({
          id: parte.id,
          rotulo: `${indice + 1}. ${parte.id}`,
          etiqueta: `parte, rever em ${parte.revisarEm}`,
          situacao: estado.partesFeitas.includes(parte.id) ? "feito" : "atual",
          resultado: contexto ? avaliarDetalhado(parte.validador, contexto) : null,
        }));
      }
      return fase.objetivos.map((item, indice) => ({
        id: item.id,
        rotulo: `${indice + 1}. ${item.id}`,
        etiqueta: `${item.modo}${item.tipo === "previsao" ? ", previsão" : ""}`,
        situacao:
          indice < estado.concluidos
            ? "feito"
            : indice === estado.objetivoAtual && estado.etapa === "objetivos"
              ? "atual"
              : "futuro",
        resultado: contexto ? avaliarDetalhado(item.validador, contexto) : null,
      }));
    },
    aplicarSolucaoAtual: motor.aplicarSolucaoDeTeste,
  };

  const tutor = useTutor({
    faseId: fase.id,
    objetivo: desafio
      ? { id: "desafio", enunciado: FALA_DESAFIO.texto }
      : objetivo
        ? { id: objetivo.id, enunciado: objetivo.enunciado.mouse }
        : null,
    degrau: estado.degrau,
    htmlAtual,
    falar,
    interceptar: (pergunta) => responderSegredo(pergunta, falar),
  });

  // Sons: acerto a cada objetivo, fanfarra na conclusão, aviso antes da solução.
  const acertosAnteriores = useRef(estado.acertos);
  useEffect(() => {
    if (estado.acertos > acertosAnteriores.current) tocarSom("acerto");
    acertosAnteriores.current = estado.acertos;
  }, [estado.acertos]);
  useEffect(() => {
    if (estado.etapa === "concluida" && estado.conclusaoAberta && estado.indiceFala === 0) {
      tocarSom("conclusao");
    }
  }, [estado.etapa, estado.conclusaoAberta, estado.indiceFala]);
  useEffect(() => {
    if (estado.confirmandoSolucao) tocarSom("aviso");
  }, [estado.confirmandoSolucao]);
  useEffect(() => {
    if (estado.comemoracoesSozinho > 0) tocarSom("conclusao");
  }, [estado.comemoracoesSozinho]);

  const comClique = (acao: () => void) => () => {
    tocarSom("clique");
    acao();
  };

  useEffect(
    () => () => {
      if (esperaRecado.current !== null) clearTimeout(esperaRecado.current);
    },
    [],
  );

  /** Deitado, digitar é apertado: o mascote dá a dica, sem bloquear nada. */
  const aoFocarEditor = () => {
    if (layout !== "paisagem") return;
    setBalaoAberto(false);
    setRecado(RECADO_PAISAGEM);
    if (esperaRecado.current !== null) clearTimeout(esperaRecado.current);
    esperaRecado.current = setTimeout(() => setRecado(null), 4500);
  };

  // No celular a prévia está sempre visível; só o balão sai da frente.
  const alternarInspecaoResponsiva = () => {
    tocarSom("clique");
    if (!inspecionando && movel) setBalaoAberto(false);
    alternarInspecao();
  };

  const aoMoverCursor = useCallback(
    (alvo: Parameters<typeof selecionarPeloCodigo>[0]) => {
      sinalizarUso("editor");
      selecionarPeloCodigo(alvo);
    },
    [selecionarPeloCodigo],
  );

  const aoPassarMouseArvore = useCallback(
    (no: Node | null) => {
      realcar(no);
      if (no) sinalizarUso("arvore");
    },
    [realcar],
  );

  const aoEditarNoEditor = useCallback(
    (texto: string) => {
      antesDeEditarCodigo();
      aoEditarCodigo(texto);
      barramento.emitir({ tipo: "editouCodigo" });
    },
    [antesDeEditarCodigo, aoEditarCodigo, barramento],
  );

  const { verificar, aoDocumentoPronto } = motor;
  const aoCarregar = useCallback(
    (documento: Document) => {
      aoCarregarDocumento(documento);
      aoRecarregarDocumento(documento);
      verificar();
      aoDocumentoPronto();
    },
    [aoCarregarDocumento, aoRecarregarDocumento, verificar, aoDocumentoPronto],
  );

  // Enter avança a conversa quando o foco não está num campo ou botão.
  const atalhoEnter = useRef<() => void>(() => {});
  useEffect(() => {
    atalhoEnter.current = () => {
      if (estado.etapa === "introducao" || estado.etapa === "meta") comClique(motor.avancarFala)();
      else if (estado.pausa !== null) comClique(motor.seguir)();
    };
  });
  useEffect(() => {
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key !== "Enter" || evento.defaultPrevented || focoUsaEnter(evento.target)) return;
      atalhoEnter.current();
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, []);

  const reverParte = (parteId: string) => {
    tocarSom("clique");
    const alvo = motor.rever(parteId);
    if (alvo) aoRever?.(alvo);
  };

  const naIntroducao = estado.etapa === "introducao" || estado.etapa === "meta";
  const emObjetivo = estado.etapa === "objetivos" && estado.pausa === null;
  const ultimaPausa = estado.pausa === "desafioConcluido" || estado.concluidos >= motor.total;

  const sobrecargaNaTela = tutor.repetir !== null && tutor.repetir.fala === estado.fala && !tutor.carregando;
  const botaoTentarDeNovo = sobrecargaNaTela ? (
    <Botao variante="secundario" onClick={comClique(tutor.tentarDeNovo)}>
      Tentar de novo
    </Botao>
  ) : null;

  const acoesConversa = (
    <>
      {botaoTentarDeNovo}
      <AcoesConversa
        estado={estado}
        totalIntroducao={fase.introducao.length}
        ultimaPausa={ultimaPausa}
        previsao={objetivo?.tipo === "previsao" ? objetivo.previsao : null}
        degrauMaximo={motor.degrauMaximo}
        desafio={desafio !== null}
        listaRever={
          desafio && (
            <ListaRever
              pendentes={desafio.partes.filter((parte) => !estado.partesFeitas.includes(parte.id))}
              tituloDaFase={(id) => faseDoId(id)?.titulo ?? id}
              aoRever={reverParte}
              aoFechar={comClique(motor.fecharListaRever)}
            />
          )
        }
        aoAvancar={comClique(motor.avancarFala)}
        aoSeguir={comClique(motor.seguir)}
        aoAjudar={() => {
          sinalizarUso("me-ajuda");
          comClique(motor.ajudar)();
        }}
        aoCancelarSolucao={comClique(motor.cancelarSolucao)}
        aoConfirmarSolucao={motor.confirmarSolucao}
        aoResponderPrevisao={(opcao) => {
          tocarSom("clique");
          motor.responderPrevisao(opcao);
        }}
        aoAbrirConclusao={comClique(motor.abrirConclusao)}
        aoAbrirCard={abrirCard}
      />
    </>
  );

  const objetivoAtivo = estado.etapa === "objetivos" && !desafio ? estado.objetivoAtual : null;
  const objetivosNaTela: ObjetivoNaTela[] = (fase.tipo === "pratica" ? fase.objetivos : []).map((item) => ({
    id: item.id,
    enunciado: enunciadoDe(item, toque),
    sozinho: item.modo === "sozinho",
  }));
  const enviarAoTutor = (pergunta: string) => {
    sinalizarUso("tutor");
    void tutor.enviar(pergunta);
  };
  const falaNaTela = tutor.pendente !== null ? FALA_PENSANDO : estado.fala;

  // No celular, fala nova abre o balão sozinha.
  const [falaConhecida, setFalaConhecida] = useState(estado.fala);
  if (falaConhecida !== estado.fala) {
    setFalaConhecida(estado.fala);
    if (!balaoAberto) setBalaoAberto(true);
  }

  const proporcaoPrevia = viewport.tecladoAberto
    ? PROPORCAO_PREVIA.minima
    : (proporcaoArrastada ?? progresso.proporcaoPrevia);
  const perguntaDaFala =
    tutor.pendente ?? (tutor.ultima && tutor.ultima.fala === estado.fala ? tutor.ultima.pergunta : null);

  const checklist = desafio ? <ChecklistDesafio partes={desafio.partes} feitas={estado.partesFeitas} /> : null;
  const objetivoDaLinha = objetivoAtivo !== null ? objetivosNaTela[objetivoAtivo] : null;

  const conversa = (
    <>
      {movel && objetivoDaLinha && (
        <p className="line-clamp-2 px-1 text-xs font-bold text-texto-suave">
          {objetivoDaLinha.sozinho && <SeloSozinho compacto className="mr-1 align-middle" />}
          Objetivo {estado.objetivoAtual + 1} de {objetivosNaTela.length}: {objetivoDaLinha.enunciado}
        </p>
      )}
      {layout === "retrato" && desafio && estado.etapa === "objetivos" && (
        <p className="px-1 text-xs font-bold text-texto-suave">
          Desafio: {estado.partesFeitas.length} de {desafio.partes.length} partes feitas
        </p>
      )}
      {layout === "paisagem" && desafio && estado.etapa === "objetivos" && (
        <div className="max-h-40 shrink-0">
          <ChecklistDesafio partes={desafio.partes} feitas={estado.partesFeitas} />
        </div>
      )}
      <BalaoFala fala={falaNaTela} pergunta={perguntaDaFala} rabo={movel ? "baixo-direita" : "esquerda"}>
        {acoesConversa}
      </BalaoFala>
      <AlvoFerramenta ids={["tutor"]} marcador="tutor" aoAbrirCard={abrirCard} classeMarcador="-top-2 right-10">
        <CampoTutor
          texto={rascunhoTutor}
          aoMudarTexto={setRascunhoTutor}
          carregando={tutor.carregando}
          desativado={naIntroducao}
          motivoDesativado="Primeiro, termine a conversa inicial"
          aoEnviar={enviarAoTutor}
        />
      </AlvoFerramenta>
    </>
  );

  const rotuloFase = fase.tipo === "desafio" ? "Desafio" : `Fase ${local.numero}`;
  const botaoMapa = rotaDoMapa && !lab ? <BotaoMapa href={rotaDoMapa} compacto={movel} /> : null;
  const botaoVoltar = revisao ? (
    <Botao tamanho={movel ? "m" : "p"} onClick={comClique(() => aoVoltarAoDesafio?.())} className="min-h-9">
      Voltar ao desafio
    </Botao>
  ) : null;

  const classesMain = {
    desktop: "flex min-h-0 flex-1 gap-4 p-3 lg:p-4",
    retrato: "flex min-h-0 flex-1 flex-col px-2 pb-2 pt-2",
    paisagem: "flex min-h-0 flex-1 gap-2 p-1.5 pr-14",
  }[layout];
  const classesPainel = {
    desktop: "w-[45%]",
    retrato: "order-3 flex-1",
    paisagem: "w-1/2",
  }[layout];
  const classesTela = {
    desktop: "flex-1",
    retrato: "order-1 flex-none",
    paisagem: "w-1/2",
  }[layout];

  return (
    <div
      className="flex h-dvh flex-col overflow-hidden"
      data-layout={layout}
      style={movel && viewport.altura ? { height: viewport.altura } : undefined}
    >
      {movel ? (
        <BarraSuperiorMovel
          titulo={`Unidade ${local.unidade.numero} › ${rotuloFase}`}
          estrelas={revisao ? null : estado.estrelas}
          fina={layout === "paisagem"}
          inicio={botaoMapa}
          acaoFixa={botaoVoltar}
          menu={
            <>
              <BotaoFerramentas aoAbrir={() => abrirCard(null)} />
              <div className="flex items-center justify-between gap-2">
                <SeletorTema />
                <BotaoSom />
              </div>
              {!revisao && <BotaoRecomecar aoRecomecar={aoRecomecar} noMenu />}
            </>
          }
        />
      ) : (
        <BarraSuperior
          caminho={[local.unidade.ilha, local.unidade.zona, `Unidade ${local.unidade.numero}`, rotuloFase]}
          estrelas={revisao ? null : estado.estrelas}
          logo={<Mascote tamanho={34} />}
          acoes={
            <>
              {botaoVoltar}
              {botaoMapa}
              <BotaoFerramentas aoAbrir={() => abrirCard(null)} />
              {!revisao && <BotaoRecomecar aoRecomecar={aoRecomecar} />}
            </>
          }
        />
      )}
      {layout === "retrato" && !viewport.tecladoAberto && (
        <BarraObjetivosMovel
          objetivos={objetivosNaTela}
          concluidos={estado.concluidos}
          ativo={objetivoAtivo}
          checklist={
            desafio && checklist
              ? {
                  total: desafio.partes.length,
                  resumo: estado.etapa === "concluida" ? "Desafio completo!" : "Checklist do desafio",
                  lista: checklist,
                }
              : undefined
          }
        />
      )}
      <AlvoFerramenta ids={["sincronia"]} as="main" className={classesMain} ref={recipienteMovel}>
        <section
          aria-label="Painel"
          className={`flex min-h-0 min-w-0 flex-col ${classesPainel}`}
          onKeyDown={(evento) => {
            const atalho = atalhoHistorico(evento);
            if (!atalho || evento.defaultPrevented || focoTemDesfazerProprio(evento.target)) return;
            evento.preventDefault();
            if (atalho === "desfazer") desfazer();
            else refazer();
          }}
        >
          <AlvoFerramenta
            ids={["painel"]}
            marcador="painel"
            aoAbrirCard={abrirCard}
            classeMarcador="right-2 top-3"
            className="flex min-h-0 flex-1 flex-col"
          >
            <Painel
              abaAtiva={aba}
              abasDesbloqueadas={ABAS_DESBLOQUEADAS}
              aoTrocarAba={setAba}
              ferramentas={
                <>
                  <AlvoFerramenta
                    ids={["inspecionar"]}
                    marcador="inspecionar"
                    aoAbrirCard={abrirCard}
                    classeMarcador="-right-2 -top-1.5"
                    as="span"
                    className="inline-flex"
                  >
                    <BotaoInspecionar
                      ativo={inspecionando}
                      pulsando={pulsarFerramenta === "inspecionar" && !inspecionando}
                      aoAlternar={alternarInspecaoResponsiva}
                    />
                  </AlvoFerramenta>
                  <AlvoFerramenta
                    ids={["desfazer"]}
                    marcador="desfazer"
                    aoAbrirCard={abrirCard}
                    classeMarcador="-right-2 -top-1.5"
                    as="span"
                    className="ml-1 inline-flex"
                  >
                    <BotoesHistorico
                      podeDesfazer={historico.podeDesfazer}
                      podeRefazer={historico.podeRefazer}
                      aoDesfazer={() => {
                        tocarSom("clique");
                        desfazer();
                      }}
                      aoRefazer={() => {
                        tocarSom("clique");
                        refazer();
                      }}
                    />
                  </AlvoFerramenta>
                </>
              }
            >
              {movel && (
                <div className="flex shrink-0 border-b-2 border-borda bg-painel px-2 py-1.5">
                  <SeletorSegmentado
                    rotulo="Mostrar no painel"
                    opcoes={[
                      { id: "arvore", rotulo: "Árvore" },
                      { id: "codigo", rotulo: "Código" },
                    ]}
                    valor={segmento}
                    aoTrocar={trocarSegmento}
                    className="w-full"
                  />
                </div>
              )}
              <PainelDividido
                rotulo="Redimensionar árvore e editor"
                proporcaoInicial={0.5}
                mostrar={movel ? (segmento === "arvore" ? "cima" : "baixo") : "ambas"}
                cima={
                  <div className="flex h-full min-h-0 flex-col">
                    <AlvoFerramenta
                      ids={["arvore", "esconder", "apagar", "duplicar", "renomear-tag"]}
                      marcador="arvore"
                      aoAbrirCard={abrirCard}
                      classeMarcador="bottom-2 right-3"
                      className="min-h-0 flex-1"
                    >
                      <ArvoreElementos
                        raiz={arvore}
                        recolhidos={recolhidos}
                        caminhoSelecionado={caminhoSelecionado}
                        destaque={destaque}
                        toque={toque}
                        aoSelecionar={selecionar}
                        aoAlternar={alternarRecolhido}
                        aoPassarMouse={aoPassarMouseArvore}
                        aoEditarTexto={editarTexto}
                        aoEditarAtributo={editarAtributo}
                        aoEsconder={alternarEsconder}
                        aoApagar={apagar}
                        aoDuplicar={duplicar}
                        aoRenomearTag={renomearTag}
                        aoDesfazer={desfazer}
                        aoRefazer={refazer}
                        podeDesfazer={historico.podeDesfazer}
                        podeRefazer={historico.podeRefazer}
                        aoComecarEdicao={() => sinalizarUso("editar-duplo-clique")}
                      />
                    </AlvoFerramenta>
                    <AlvoFerramenta ids={["trilha"]} marcador="trilha" aoAbrirCard={abrirCard} classeMarcador="right-2 -top-2.5">
                      <TrilhaElementos
                        raiz={arvore}
                        caminhoSelecionado={caminhoSelecionado}
                        aoSelecionar={(caminho) => selecionar(caminho, "trilha")}
                        recuoDireita={layout === "retrato"}
                      />
                    </AlvoFerramenta>
                  </div>
                }
                baixo={
                  <AlvoFerramenta
                    ids={["editor"]}
                    marcador="editor"
                    aoAbrirCard={abrirCard}
                    classeMarcador="right-2 top-2"
                    className="flex h-full min-h-0 flex-col"
                  >
                    <CabecalhoEditor
                      quebrarLinhas={quebrarLinhas}
                      aoAlternarQuebra={() => setQuebrarLinhas((valor) => !valor)}
                    />
                    <div className="min-h-0 flex-1">
                      <EditorCodigo
                        ref={editorRef}
                        textoInicial={bodyInicial}
                        aoMudar={aoEditarNoEditor}
                        quebrarLinhas={quebrarLinhas}
                        aoMoverCursor={aoMoverCursor}
                        aoFocar={aoFocarEditor}
                        rotulo="Editor do código HTML do corpo da página"
                      />
                    </div>
                  </AlvoFerramenta>
                }
              />
            </Painel>
          </AlvoFerramenta>
        </section>
        {layout === "retrato" && (
          <AlcaDivisoria
            recipiente={recipienteMovel}
            proporcao={proporcaoPrevia}
            minimo={PROPORCAO_PREVIA.minima}
            maximo={PROPORCAO_PREVIA.maxima}
            aoMudar={setProporcaoArrastada}
            aoSoltar={(valor) => {
              setProporcaoArrastada(null);
              atualizarProgresso((atual) => ({ ...atual, proporcaoPrevia: valor }));
            }}
            className="order-2"
          />
        )}
        <section
          aria-label="Tela do site"
          data-previa
          className={`flex min-h-0 min-w-0 flex-col ${classesTela}`}
          style={layout === "retrato" ? { flexBasis: `${proporcaoPrevia * 100}%` } : undefined}
        >
          <AlvoFerramenta
            ids={["previa"]}
            marcador="previa"
            aoAbrirCard={abrirCard}
            classeMarcador="right-3 top-3"
            className="flex min-h-0 flex-1 flex-col"
          >
            <JanelaNavegador url={fase.siteAlvo.url} compacta={movel}>
              <PreviewSiteAlvo
                ref={previewRef}
                head={fase.siteAlvo.head}
                bodyInicial={bodyInicial}
                titulo={fase.siteAlvo.titulo}
                aoCarregar={aoCarregar}
                aoClicarLink={aoClicarLink}
              >
                <SobreposicaoInspecao realce={realce} />
                <CamadaInspecao
                  ativa={inspecionando}
                  toque={toque}
                  aoApontar={apontarNaTela}
                  aoEscolher={escolherNaTela}
                  aoSair={() => realcar(null)}
                  aoRolar={rolarTela}
                />
              </PreviewSiteAlvo>
            </JanelaNavegador>
          </AlvoFerramenta>
        </section>
      </AlvoFerramenta>
      {movel ? (
        <MascoteFlutuante
          expressao={falaNaTela.expressao}
          aberto={balaoAberto}
          aoAlternar={setBalaoAberto}
          mini={layout === "paisagem"}
          recado={recado}
          tropecando={estado.roteiro === "esbarrao"}
          chaveFala={falaNaTela.texto}
          fecharDepoisDe={
            layout === "paisagem" &&
            emObjetivo &&
            !estado.confirmandoSolucao &&
            !previsaoPendente &&
            !estado.listaRever &&
            !tutor.carregando &&
            !sobrecargaNaTela
              ? tempoDeLeitura(falaNaTela.texto)
              : null
          }
        >
          {conversa}
        </MascoteFlutuante>
      ) : (
        <AreaMascote
          mascote={
            <Tropeco ativo={estado.roteiro === "esbarrao"}>
              <Mascote expressao={falaNaTela.expressao} tamanho={112} className="h-auto w-16 sm:w-20 lg:w-28" />
            </Tropeco>
          }
          conversa={conversa}
          objetivos={
            checklist ?? (
              <ListaObjetivos objetivos={objetivosNaTela} concluidos={estado.concluidos} ativo={objetivoAtivo} />
            )
          }
        />
      )}
      {ferramentaEmCena && (
        <ApresentacaoFerramenta
          key={ferramentaEmCena.id}
          ferramenta={ferramentaEmCena}
          toque={toque}
          aoPreparar={prepararAlvo}
          aoConcluir={() => apresentacoes.concluir(ferramentaEmCena.id)}
        />
      )}
      <CaixaFerramentas
        aberta={caixa.aberta}
        foco={caixa.foco}
        vistas={apresentacoes.vistas}
        toque={toque}
        aoFechar={() => setCaixa((atual) => ({ ...atual, aberta: false }))}
        aoRever={(id) => {
          setCaixa({ aberta: false, foco: null });
          apresentacoes.rever(id);
        }}
      />
      {desafioParaMeta && (
        <TelaMeta
          aberta={estado.etapa === "meta"}
          unidade={local.unidade}
          desafio={desafioParaMeta}
          noDesafio={fase.tipo === "desafio"}
          aoComecar={comClique(motor.avancarFala)}
        />
      )}
      {!(estado.etapa === "concluida" && estado.conclusaoAberta) && <ComemoracaoSozinho vez={estado.comemoracoesSozinho} />}
      <TelaConclusao
        aberta={estado.etapa === "concluida" && estado.conclusaoAberta}
        local={local}
        modo={modo}
        falaFinal={falaFinalDe(fase)}
        estrelas={estado.estrelas}
        indiceFala={estado.indiceFala}
        fala={estado.fala}
        missaoFeita={progresso.missoesDeCampo[fase.id] ?? false}
        proxima={proxima ? `${proxima.tipo === "desafio" ? "Desafio: " : ""}${proxima.titulo}` : null}
        aoAlternarMissao={(feita) =>
          atualizarProgresso((atual) => ({
            ...atual,
            missoesDeCampo: { ...atual.missoesDeCampo, [fase.id]: feita },
          }))
        }
        aoAvancar={motor.avancarFala}
        aoFechar={motor.fecharConclusao}
        aoRecomecar={aoRecomecar}
        aoProxima={() => proxima && aoIrParaFase?.(proxima.id)}
        aoVoltarAIlha={modo === "jogo" && !proxima ? aoVoltarAIlha : undefined}
        aoVoltarAoDesafio={() => aoVoltarAoDesafio?.()}
      />
      {lab && painelLab?.(apiLab)}
    </div>
  );
}
