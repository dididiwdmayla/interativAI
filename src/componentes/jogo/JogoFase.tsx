"use client";

import { tocarEfeito } from "@/audio/motor";
import type { IdEfeito } from "@/audio/efeitos";
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlvoFerramenta } from "@/componentes/ferramentas/AlvoFerramenta";
import { ApresentacaoFerramenta } from "@/componentes/ferramentas/ApresentacaoFerramenta";
import { BotaoFerramentas } from "@/componentes/ferramentas/BotaoFerramentas";
import { CaixaFerramentas } from "@/componentes/ferramentas/CaixaFerramentas";
import { useApresentacoes } from "@/componentes/ferramentas/useApresentacoes";
import { IconeAviso } from "@/componentes/icones/IconeAviso";
import type { ApiLab, ItemLab } from "@/componentes/lab/tipos";
import { BarraSuperior } from "@/componentes/layout/BarraSuperior";
import { BarraSuperiorMovel } from "@/componentes/layout/BarraSuperiorMovel";
import { BotaoMapa } from "@/componentes/layout/BotaoMapa";
import { BotaoRecomecar } from "@/componentes/layout/BotaoRecomecar";
import { AjustesSom } from "@/componentes/layout/AjustesSom";
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
import { type AbaEditor, CabecalhoEditor } from "@/componentes/painel/editor/CabecalhoEditor";
import { EditorCodigo } from "@/componentes/painel/editor/EditorCodigo";
import { Painel } from "@/componentes/painel/Painel";
import { PainelDividido } from "@/componentes/painel/PainelDividido";
import { PainelLadoALado } from "@/componentes/painel/PainelLadoALado";
import { PainelCalculado } from "@/componentes/painel/estilos/PainelCalculado";
import { PainelEstilos } from "@/componentes/painel/estilos/PainelEstilos";
import type { AcoesEstilos, DestaqueEstilos } from "@/componentes/painel/estilos/tipos";
import { CamadaInspecao } from "@/componentes/preview/CamadaInspecao";
import { JanelaNavegador } from "@/componentes/preview/JanelaNavegador";
import { PreviewSiteAlvo } from "@/componentes/preview/PreviewSiteAlvo";
import { SobreposicaoInspecao } from "@/componentes/preview/SobreposicaoInspecao";
import { Botao } from "@/componentes/ui/Botao";
import { SeletorSegmentado } from "@/componentes/ui/SeletorSegmentado";
import { faseDoId, type LocalDaFase, proximaFase } from "@/conteudo";
import type { Fala, Fase, PainelElementos } from "@/conteudo/tipos";
import type { IdFerramenta } from "@/ferramentas/ids";
import { FERRAMENTAS, type Ferramenta } from "@/ferramentas/registro";
import { sinalizarUso } from "@/ferramentas/uso";
import { atualizarProgresso, obterProgresso, useProgresso } from "@/lib/armazemProgresso";
import { elementoDoNo } from "@/lib/arvore";
import { caminhoDoNo, raizDaArvore } from "@/lib/dom";
import { lerAtributosDigitados } from "@/lib/atributosDigitados";
import { documentoInteiroInicial } from "@/lib/documentoSiteAlvo";
import { elementosDaRegra } from "@/lib/elementosDaRegra";
import { falaDoLink } from "@/lib/linksPrevia";
import { faseAbreComMeta } from "@/lib/metaDaUnidade";
import { type EstadoFaseSalvo, PROPORCAO_PREVIA } from "@/lib/progresso";
import { useToque } from "@/lib/useConsultaMidia";
import type { Aba } from "@/motor/abas";
import { criarBarramento } from "@/motor/barramento";
import type { EventoFase } from "@/motor/eventos";
import { enunciadoDe, FALA_DESAFIO, falaFinalDe, type ModoJogo } from "@/motor/estadoMotor";
import { viaDaOrigem } from "@/motor/nucleoPainel";
import { avaliarDetalhado } from "@/motor/validadores";
import { analisarCss } from "@/motor/css/analisarCss";
import { acharDeclaracao, acharRegra } from "@/motor/css/editarCss";
import { NOME_FOLHA_DO_JOGO } from "@/motor/css/cascata";
import { AcoesConversa } from "./AcoesConversa";
import {
  atalhoHistorico,
  FALA_PENSANDO,
  FERRAMENTAS_DA_ARVORE,
  FERRAMENTAS_DO_CALCULADO,
  FERRAMENTAS_DOS_ESTILOS,
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

/**
 * Som de cada ferramenta do DevTools, tocado pelo evento do painel (vale
 * para o jogador, para as soluções e para os momentos roteirizados).
 */
const SOM_DO_EVENTO: Partial<Record<EventoFase["tipo"], IdEfeito>> = {
  editouTexto: "editar",
  editouAtributo: "editar",
  adicionouAtributo: "editar",
  escondeu: "esconder",
  mostrou: "esconder",
  apagou: "apagar",
  duplicou: "duplicar",
  desfez: "desfazer",
  refez: "refazer",
  renomeouTag: "renomear-tag",
  editouPropriedade: "editar",
  alternouDeclaracao: "esconder",
  adicionouRegra: "duplicar",
};

/** Por enquanto toda fase é da zona Elementos: só essa aba abre. */
const ABAS_DESBLOQUEADAS: readonly Aba[] = ["elementos"];

/** CSS para abrir a fase (null sem folha editável): o salvo, ou o de antes do momento roteirizado. */
function cssParaAbrir(fase: Fase, salvo: EstadoFaseSalvo | undefined): string | null {
  if (fase.siteAlvo.css === undefined) return null;
  if (!salvo) return fase.siteAlvo.css;
  const objetivo = fase.tipo === "pratica" ? fase.objetivos[salvo.objetivoAtual] : undefined;
  if (salvo.introducaoVista && objetivo?.eventoAoComecar && salvo.cssInicioObjetivo !== null) {
    return salvo.cssInicioObjetivo;
  }
  return salvo.cssAtual ?? fase.siteAlvo.css;
}

/** O texto inicial do editor: o body ou, no modo documento, o documento inteiro. */
function htmlInicialDaFase(fase: Fase): string {
  return fase.modoDocumento ? documentoInteiroInicial(fase.siteAlvo.head, fase.siteAlvo.body) : fase.siteAlvo.body;
}

/**
 * O computadorzinho explica a simulação dos acentos (modo documento sem
 * meta charset). A prévia usa srcdoc, que já é texto, então a quebra não
 * aconteceria sozinha: ver src/lib/codificacao.ts.
 */
const FALA_ACENTOS: Fala = {
  texto:
    "Isto é uma simulação: sem <meta charset=\"utf-8\"> no head, um navegador de verdade pode ler os acentos errado e mostrar CartÃ£o no lugar de Cartão. Com essa linha no head, tudo volta ao normal.",
  expressao: "curioso",
};

/** HTML para abrir a fase: o salvo, ou o de antes do momento roteirizado do objetivo atual. */
function bodyParaAbrir(fase: Fase, salvo: EstadoFaseSalvo | undefined): string {
  if (!salvo) return htmlInicialDaFase(fase);
  const objetivo = fase.tipo === "pratica" ? fase.objetivos[salvo.objetivoAtual] : undefined;
  if (salvo.introducaoVista && objetivo?.eventoAoComecar && salvo.htmlInicioObjetivo !== null) {
    return salvo.htmlInicioObjetivo;
  }
  return salvo.htmlAtual ?? htmlInicialDaFase(fase);
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
  const [cssInicial] = useState(() => cssParaAbrir(fase, salvo));
  const temCss = cssInicial !== null;
  const [abaEditor, setAbaEditor] = useState<AbaEditor>("html");
  const [barramento] = useState(criarBarramento);
  const [aba, setAba] = useState<Aba>("elementos");
  const [quebrarLinhas, setQuebrarLinhas] = useState(true);
  const [segmento, setSegmento] = useState<"arvore" | "estilos" | "codigo">("arvore");
  /** Sub-painéis de Elementos liberados na fase (Estilos, Calculado). */
  const paineis = fase.paineisElementos ?? [];
  const comEstilos = paineis.length > 0;
  const [subAbaElementos, setSubAbaElementos] = useState<PainelElementos>("estilos");
  const [destaqueEstilos, setDestaqueEstilos] = useState<DestaqueEstilos | null>(null);
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
    editorCssRef,
    previewRef,
    arvore,
    htmlAtual,
    cssAtual,
    versaoDocumento,
    versaoCss,
    versaoCssCalma,
    aoEditarCodigo,
    aoEditarCss,
    editarCss,
    previsualizarCss,
    aoCarregarDocumento,
    obterDocumento,
    editarDocumento,
    tituloAba,
    simulandoAcentos,
    doctype,
  } = useSiteAlvo(bodyInicial, cssInicial, fase.modoDocumento === true);

  const {
    caminhoSelecionado,
    recolhidos,
    realce,
    realcesExtras,
    realcarVarios,
    realceCaixa,
    realcarCamada,
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
    adicionarAtributos,
    alternarEsconder,
    apagar,
    duplicar,
    renomearTag,
    clicarLink,
    inserirHtml,
    desfazer,
    refazer,
    antesDeEditarCodigo,
    lerCss,
    definirPropriedade,
    editarDeclaracao,
    alternarDeclaracao,
    alternarPropriedade,
    adicionarDeclaracao,
    adicionarRegra,
    escreverCss,
    editarEstiloInline,
    aoRecarregarDocumento,
  } = usePainelElementos({
    editorRef,
    obterDocumento,
    editarDocumento,
    editarCss,
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
      const documento = obterDocumento();
      const raiz = documento?.body ? raizDaArvore(documento) : null;
      const caminho = raiz ? caminhoDoNo(raiz, link) : null;
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
      adicionarAtributos,
      alternarEsconder,
      apagar,
      duplicar,
      renomearTag,
      clicarLink: clicarLinkNaTela,
      inserirHtml,
      desfazer,
      definirPropriedade,
      alternarPropriedade,
      adicionarRegra,
      escreverCss,
      lerCss,
    }),
    [
      definirPropriedade,
      alternarPropriedade,
      adicionarRegra,
      escreverCss,
      lerCss,
      obterDocumento,
      noSelecionado,
      selecionar,
      editarTexto,
      editarAtributo,
      adicionarAtributos,
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

  /** Mostra o editor CSS (a aba CSS; no celular, o Código). */
  const mostrarEditorCss = useCallback(() => {
    setAbaEditor("css");
    setSegmento("codigo");
  }, []);

  /** Degrau 3 no CSS: abre a aba CSS e pisca as linhas da regra (ou da declaração). */
  const destacarNoCss = useCallback(
    (seletorRegra: string, propriedade?: string) => {
      const texto = lerCss();
      if (texto === null) return;
      const achada = acharRegra(analisarCss(texto), seletorRegra);
      if (!achada) return;
      const { regra } = achada;
      const indice = propriedade ? acharDeclaracao(regra, propriedade) : -1;
      const declaracao = indice >= 0 ? regra.declaracoes[indice] : null;
      const primeira = declaracao ? declaracao.linha : regra.linha;
      const ultima = declaracao ? declaracao.linha : texto.slice(0, regra.fim).split("\n").length;
      mostrarEditorCss();
      requestAnimationFrame(() =>
        editorCssRef.current?.destacarLinhas(Array.from({ length: ultima - primeira + 1 }, (_, deslocamento) => primeira + deslocamento)),
      );
    },
    [editorCssRef, lerCss, mostrarEditorCss],
  );
  const limparDestaqueCss = useCallback(() => editorCssRef.current?.destacarLinhas([]), [editorCssRef]);

  /** Degrau 3 no painel Estilos: mostra o painel (no celular, o segmento Estilos) e pisca a regra. */
  const destacarNoEstilos = useCallback(
    (novo: DestaqueEstilos | null) => {
      setDestaqueEstilos(novo);
      if (novo) setSubAbaElementos("estilos");
      if (novo && movel) setSegmento("estilos");
    },
    [movel],
  );

  /** O link "estilo.css:12" do painel: abre a folha no editor CSS, na regra. */
  const irParaFonte = useCallback(
    (posicao: number) => {
      mostrarEditorCss();
      requestAnimationFrame(() => {
        editorCssRef.current?.irParaPosicao(posicao);
        const texto = lerCss();
        if (texto !== null) editorCssRef.current?.destacarLinhas([texto.slice(0, posicao).split("\n").length]);
      });
    },
    [editorCssRef, lerCss, mostrarEditorCss],
  );

  const motor = useMotorFase({
    fase,
    modo,
    mostrarMeta,
    salvo,
    barramento,
    htmlAtual,
    cssAtual,
    editorRef,
    obterDocumento,
    obterSelecao,
    painel,
    destacarNaArvore,
    destacarNoCss,
    limparDestaqueCss,
    destacarNoEstilos,
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

  // Na primeira vez que a prévia quebra os acentos, o computadorzinho explica (quando não atrapalha).
  const explicouAcentos = useRef(false);
  useEffect(() => {
    if (!simulandoAcentos || explicouAcentos.current) return;
    if (estado.etapa !== "objetivos" || estado.pausa !== null || previsaoPendente || estado.roteiro !== null) return;
    explicouAcentos.current = true;
    falar(FALA_ACENTOS);
  }, [simulandoAcentos, estado.etapa, estado.pausa, estado.roteiro, previsaoPendente, falar]);
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
  const trocarSegmento = (novo: "arvore" | "estilos" | "codigo") => {
    setSegmento(novo);
    if (novo !== "estilos") realcarCamada(null);
    if (novo === "codigo") requestAnimationFrame(() => destacarNoEditor(true));
  };

  /** Troca Estilos | Calculado; sair do Calculado apaga a camada acesa na prévia. */
  const trocarSubAba = (nova: PainelElementos) => {
    setSubAbaElementos(nova);
    if (nova !== "calculado") realcarCamada(null);
  };

  /** Deixa o alvo da apresentação visível: no celular, abre ou fecha o balão e troca Árvore | Código. */
  const prepararAlvo = (ferramenta: Ferramenta) => {
    if (FERRAMENTAS_DO_CALCULADO.includes(ferramenta.id)) trocarSubAba("calculado");
    else if (FERRAMENTAS_DOS_ESTILOS.includes(ferramenta.id)) trocarSubAba("estilos");
    if (!movel) return;
    setBalaoAberto(ferramenta.id === "me-ajuda" || ferramenta.id === "tutor");
    if (FERRAMENTAS_DA_ARVORE.includes(ferramenta.id)) trocarSegmento("arvore");
    if (FERRAMENTAS_DOS_ESTILOS.includes(ferramenta.id)) trocarSegmento("estilos");
    if (ferramenta.id === "editor" || ferramenta.id === "sincronia" || ferramenta.id === "editor-css") trocarSegmento("codigo");
  };

  // O que o jogador faz no painel também conta como "usou a ferramenta".
  useEffect(
    () =>
      barramento.assinar((evento) => {
        const som = SOM_DO_EVENTO[evento.tipo];
        if (som) tocarEfeito(som);
        if (evento.tipo === "respondeuPrevisao") tocarEfeito(evento.acertou ? "acerto" : "erro");
        if (evento.tipo === "selecionou" && (evento.origem === "arvore" || evento.origem === "teclado")) {
          if (evento.origem === "arvore") tocarEfeito("clique");
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
        } else if (evento.tipo === "adicionouAtributo") {
          sinalizarUso("adicionar-atributo");
        } else if (evento.tipo === "editouCss") {
          sinalizarUso("editor-css");
        } else if (evento.tipo === "editouPropriedade") {
          sinalizarUso("editar-valor-css");
        } else if (evento.tipo === "alternouDeclaracao") {
          sinalizarUso("ligar-desligar-declaracao");
        } else if (evento.tipo === "adicionouRegra") {
          sinalizarUso("nova-regra");
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
    cssAtual,
    falar,
    interceptar: (pergunta) => responderSegredo(pergunta, falar),
  });

  // Sons: acerto a cada objetivo, fanfarra na conclusão, aviso antes da solução.
  const acertosAnteriores = useRef(estado.acertos);
  useEffect(() => {
    if (estado.acertos > acertosAnteriores.current) tocarEfeito("acerto");
    acertosAnteriores.current = estado.acertos;
  }, [estado.acertos]);
  useEffect(() => {
    if (estado.etapa === "concluida" && estado.conclusaoAberta && estado.indiceFala === 0) {
      tocarEfeito("fase-concluida");
    }
  }, [estado.etapa, estado.conclusaoAberta, estado.indiceFala]);
  useEffect(() => {
    if (estado.confirmandoSolucao) tocarEfeito("aviso");
  }, [estado.confirmandoSolucao]);
  useEffect(() => {
    if (estado.comemoracoesSozinho > 0) tocarEfeito("fez-sozinho");
  }, [estado.comemoracoesSozinho]);
  useEffect(() => {
    if (estado.roteiro === "esbarrao") tocarEfeito("esbarrao");
  }, [estado.roteiro]);

  const comClique = (acao: () => void) => () => {
    tocarEfeito("clique");
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
    tocarEfeito(inspecionando ? "clique" : "inspecionar");
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
      antesDeEditarCodigo("html");
      aoEditarCodigo(texto);
      barramento.emitir({ tipo: "editouCodigo" });
    },
    [antesDeEditarCodigo, aoEditarCodigo, barramento],
  );

  /** Tecla no editor CSS: foto para o Desfazer do painel, prévia na hora e o evento. */
  const aoEditarNoEditorCss = useCallback(
    (texto: string) => {
      antesDeEditarCodigo("css");
      aoEditarCss(texto);
      barramento.emitir({ tipo: "editouCss" });
    },
    [antesDeEditarCodigo, aoEditarCss, barramento],
  );

  /** Cursor no editor CSS: acende na prévia todas as peças que a regra do cursor pega. */
  const aoMoverCursorCss = useCallback(
    (posicao: number) => {
      sinalizarUso("editor-css");
      const texto = lerCss();
      const documento = obterDocumento();
      if (texto === null || !documento) return;
      const regra = analisarCss(texto).regras.find((item) => posicao >= item.inicio && posicao <= item.fim);
      realcarVarios(regra ? elementosDaRegra(documento, regra.seletor) : []);
    },
    [lerCss, obterDocumento, realcarVarios],
  );

  const trocarAbaEditor = (aba: AbaEditor) => {
    tocarEfeito("clique");
    setAbaEditor(aba);
    if (aba === "html") realcarVarios([]);
  };

  const { verificar, aoDocumentoPronto } = motor;

  // CSS mudou (editor, painel, desfazer): confere os objetivos um pouco depois.
  const verificarAtual = useRef(verificar);
  useEffect(() => {
    verificarAtual.current = verificar;
  }, [verificar]);
  useEffect(() => {
    if (versaoCssCalma > 0) verificarAtual.current();
  }, [versaoCssCalma]);
  const aoCarregar = useCallback(
    (documento: Document) => {
      aoCarregarDocumento(documento);
      aoRecarregarDocumento(documento);
      verificar();
      aoDocumentoPronto();
    },
    [aoCarregarDocumento, aoRecarregarDocumento, verificar, aoDocumentoPronto],
  );

  /** O elemento selecionado (o dono, se a seleção é um texto): o painel Estilos mostra as regras dele. */
  const elementoSelecionado = caminhoSelecionado ? elementoDoNo(noSelecionado()) : null;

  /** Caminho de um elemento da página na árvore (a raiz é o body ou, no modo documento, o html). */
  const caminhoDoElemento = useCallback(
    (elemento: Element): number[] | null => {
      const documento = obterDocumento();
      const raiz = documento?.body ? raizDaArvore(documento) : null;
      return raiz ? (elemento === raiz ? [] : caminhoDoNo(raiz, elemento)) : null;
    },
    [obterDocumento],
  );

  const acoesEstilos = useMemo<AcoesEstilos>(
    () => ({
      editarDeclaracao,
      alternarDeclaracao,
      adicionarDeclaracao,
      adicionarRegra: (seletor) => adicionarRegra(seletor),
      editarInline: (elemento, estilo, detalhe) => {
        const caminho = caminhoDoElemento(elemento);
        return caminho ? editarEstiloInline(caminho, estilo, detalhe) : false;
      },
      previsualizarCss,
      irParaFonte,
      realcar: realcarVarios,
      selecionarElemento: (elemento) => {
        const caminho = caminhoDoElemento(elemento);
        if (caminho) selecionar(caminho, "arvore");
      },
    }),
    [
      adicionarDeclaracao,
      adicionarRegra,
      alternarDeclaracao,
      caminhoDoElemento,
      editarDeclaracao,
      editarEstiloInline,
      irParaFonte,
      previsualizarCss,
      realcarVarios,
      selecionar,
    ],
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
    tocarEfeito("clique");
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
        aoResponderPrevisao={motor.responderPrevisao}
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
              <SeletorTema />
              <div data-manter-menu className="border-t-2 border-borda pt-2">
                <AjustesSom />
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
                      aoDesfazer={desfazer}
                      aoRefazer={refazer}
                    />
                  </AlvoFerramenta>
                </>
              }
            >
              {movel && (
                <div className="flex shrink-0 border-b-2 border-borda bg-painel px-2 py-1.5">
                  <SeletorSegmentado
                    rotulo="Mostrar no painel"
                    opcoes={
                      comEstilos
                        ? [
                            { id: "arvore", rotulo: "Árvore" },
                            { id: "estilos", rotulo: "Estilos" },
                            { id: "codigo", rotulo: "Código" },
                          ]
                        : [
                            { id: "arvore", rotulo: "Árvore" },
                            { id: "codigo", rotulo: "Código" },
                          ]
                    }
                    valor={segmento}
                    aoTrocar={trocarSegmento}
                    className="w-full"
                  />
                </div>
              )}
              <PainelDividido
                rotulo="Redimensionar árvore e editor"
                proporcaoInicial={comEstilos ? 0.58 : 0.5}
                mostrar={movel ? (segmento === "codigo" ? "baixo" : "cima") : "ambas"}
                cima={
                  <PainelLadoALado
                    rotulo="Redimensionar árvore e painel Estilos"
                    mostrar={!comEstilos ? "esquerda" : layout === "retrato" ? (segmento === "estilos" ? "direita" : "esquerda") : "ambas"}
                    esquerda={
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
                        aoAdicionarAtributos={
                          fase.usaFerramentas.includes("adicionar-atributo")
                            ? (caminho, texto) => adicionarAtributos(caminho, lerAtributosDigitados(texto))
                            : undefined
                        }
                        doctype={doctype}
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
                    direita={
                      comEstilos ? (
                        <AlvoFerramenta
                          ids={[
                            "painel-estilos",
                            "editar-valor-css",
                            "ligar-desligar-declaracao",
                            "setas-numericas",
                            "seletor-de-cor",
                            ...(paineis.includes("calculado") ? (["painel-calculado", "modelo-de-caixa"] as const) : []),
                          ]}
                          marcador={subAbaElementos === "calculado" ? "painel-calculado" : "painel-estilos"}
                          aoAbrirCard={abrirCard}
                          classeMarcador="right-2 top-1.5"
                          className="h-full min-h-0"
                        >
                          <PainelEstilos
                            elemento={elementoSelecionado}
                            versao={versaoDocumento * 100000 + versaoCss}
                            paineis={paineis}
                            temFolha={temCss}
                            toque={toque}
                            destaque={destaqueEstilos}
                            lerCss={lerCss}
                            acoes={acoesEstilos}
                            aba={subAbaElementos}
                            aoTrocarAba={trocarSubAba}
                            calculado={
                              paineis.includes("calculado") ? (
                                <PainelCalculado
                                  elemento={elementoSelecionado}
                                  versao={versaoDocumento * 100000 + versaoCss}
                                  toque={toque}
                                  camada={realceCaixa?.camada ?? null}
                                  aoRealcarCamada={realcarCamada}
                                  aoIrParaFonte={irParaFonte}
                                />
                              ) : undefined
                            }
                            aoAbrirCard={abrirCard}
                          />
                        </AlvoFerramenta>
                      ) : null
                    }
                  />
                }
                baixo={
                  <AlvoFerramenta
                    ids={temCss ? ["editor", "editor-css"] : ["editor"]}
                    marcador="editor"
                    aoAbrirCard={abrirCard}
                    classeMarcador="right-2 top-2"
                    className="flex h-full min-h-0 flex-col"
                  >
                    <CabecalhoEditor
                      quebrarLinhas={quebrarLinhas}
                      aoAlternarQuebra={() => setQuebrarLinhas((valor) => !valor)}
                      abas={temCss ? { ativa: abaEditor, aoTrocar: trocarAbaEditor, nomeCss: NOME_FOLHA_DO_JOGO } : undefined}
                      documentoInteiro={fase.modoDocumento === true}
                    />
                    <div className={`min-h-0 flex-1 ${abaEditor === "html" ? "" : "hidden"}`}>
                      <EditorCodigo
                        ref={editorRef}
                        textoInicial={bodyInicial}
                        aoMudar={aoEditarNoEditor}
                        quebrarLinhas={quebrarLinhas}
                        aoMoverCursor={aoMoverCursor}
                        aoFocar={aoFocarEditor}
                        rotulo={fase.modoDocumento ? "Editor do código HTML da página inteira" : "Editor do código HTML do corpo da página"}
                      />
                    </div>
                    {cssInicial !== null && (
                      <div className={`min-h-0 flex-1 ${abaEditor === "css" ? "" : "hidden"}`} data-editor-css>
                        <EditorCodigo
                          ref={editorCssRef}
                          linguagem="css"
                          textoInicial={cssInicial}
                          aoMudar={aoEditarNoEditorCss}
                          quebrarLinhas={quebrarLinhas}
                          aoMoverCursorPosicao={aoMoverCursorCss}
                          aoFocar={aoFocarEditor}
                          rotulo={`Editor do CSS da página (${NOME_FOLHA_DO_JOGO})`}
                        />
                      </div>
                    )}
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
            <JanelaNavegador
              url={fase.siteAlvo.url}
              compacta={movel}
              tituloAba={fase.modoDocumento ? tituloAba : undefined}
              aviso={
                simulandoAcentos ? (
                  <button
                    type="button"
                    data-aviso-acentos
                    onClick={() => falar(FALA_ACENTOS)}
                    className="absolute bottom-2 left-2 z-20 flex max-w-[calc(100%-1rem)] items-center gap-1.5 rounded-full border-2 border-alerta bg-superficie px-3 py-1 text-left text-xs font-bold text-texto shadow-[0_3px_0_var(--cor-sombra)] pointer-coarse:min-h-11"
                  >
                    <IconeAviso className="shrink-0 text-alerta" />
                    Acentos quebrados: simulação (sem meta charset)
                  </button>
                ) : undefined
              }
            >
              <PreviewSiteAlvo
                ref={previewRef}
                head={fase.siteAlvo.head}
                bodyInicial={bodyInicial}
                modoDocumento={fase.modoDocumento === true}
                cssInicial={cssInicial}
                titulo={fase.siteAlvo.titulo}
                aoCarregar={aoCarregar}
                aoClicarLink={aoClicarLink}
              >
                <SobreposicaoInspecao realce={realce} extras={realcesExtras} caixa={realceCaixa} />
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
