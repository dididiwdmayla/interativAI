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
import { BotaoSom } from "@/componentes/layout/BotaoSom";
import { SeletorTema } from "@/componentes/layout/SeletorTema";
import { BarraObjetivosMovel } from "@/componentes/mascote/BarraObjetivosMovel";
import { MascoteFlutuante } from "@/componentes/mascote/MascoteFlutuante";
import { BotaoRecomecar } from "@/componentes/layout/BotaoRecomecar";
import { AreaMascote } from "@/componentes/mascote/AreaMascote";
import { BalaoFala } from "@/componentes/mascote/BalaoFala";
import { BotaoAjuda } from "@/componentes/mascote/BotaoAjuda";
import { CampoTutor } from "@/componentes/mascote/CampoTutor";
import { ListaObjetivos } from "@/componentes/mascote/ListaObjetivos";
import { Mascote } from "@/componentes/mascote/Mascote";
import { ArvoreElementos } from "@/componentes/painel/arvore/ArvoreElementos";
import { BotaoInspecionar } from "@/componentes/painel/BotaoInspecionar";
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
import type { IdFerramenta } from "@/ferramentas/ids";
import { FERRAMENTAS, type Ferramenta } from "@/ferramentas/registro";
import { sinalizarUso } from "@/ferramentas/uso";
import { atualizarProgresso, obterProgresso, useProgresso } from "@/lib/armazemProgresso";
import { PROPORCAO_PREVIA } from "@/lib/progresso";
import { tocarSom } from "@/lib/som";
import { desbloquearTema, escolherTema } from "@/lib/tema";
import { useToque } from "@/lib/useConsultaMidia";
import type { LocalDaFase } from "@/conteudo";
import type { FasePratica } from "@/conteudo/tipos";
import type { Aba } from "@/motor/abas";
import { criarBarramento } from "@/motor/barramento";
import { enunciadoDe, falaFinalDe } from "@/motor/estadoMotor";
import { executarAcoes, type PainelDasAcoes } from "@/motor/executarAcao";
import { viaDaOrigem } from "@/motor/nucleoPainel";
import type { Fala } from "@/motor/tipos";
import { avaliarDetalhado } from "@/motor/validadores";
import { AlcaDivisoria } from "./movel/AlcaDivisoria";
import { useLayoutJogo, useViewportVisivel } from "./movel/useLayoutJogo";
import { TelaConclusao } from "./TelaConclusao";
import { useMotorFase } from "./useMotorFase";
import { usePainelElementos } from "./usePainelElementos";
import { useSiteAlvo } from "./useSiteAlvo";
import { useTutor } from "./useTutor";

type Props = {
  fase: FasePratica;
  local: LocalDaFase;
  aoRecomecar: () => void;
  /** "lab": o /lab/fases (começa no primeiro objetivo, não salva, sem apresentações). */
  modo?: "jogo" | "lab";
  /** Só no lab: a gaveta com os validadores ao vivo. */
  painelLab?: (api: ApiLab) => ReactNode;
};

/** Por enquanto toda fase é da zona Elementos: só essa aba abre. */
const ABAS_DESBLOQUEADAS: readonly Aba[] = ["elementos"];

const FALA_PENSANDO: Fala = {
  texto: "Hmm, deixa eu pensar...",
  expressao: "pensativo",
};

const PALAVRA_SECRETA = "curioso";

const RECADO_PAISAGEM = "Pra digitar, fica mais confortável com o celular em pé";

/** Tempo para ler uma fala antes do balão fechar sozinho (celular deitado). */
function tempoDeLeitura(texto: string): number {
  return 3500 + texto.length * 55;
}

/** Easter egg: a palavra do F12 libera o tema Segredo, sem chamar o Gemini. */
function responderSegredo(pergunta: string, falar: (fala: Fala) => void): Fala | null {
  if (pergunta.trim().toLowerCase() !== PALAVRA_SECRETA) return null;
  const jaTinha = obterProgresso().temasDesbloqueados.includes("segredo");
  desbloquearTema("segredo");
  escolherTema("segredo");
  tocarSom("conclusao");
  const fala: Fala = {
    texto: jaTinha
      ? "Olha só quem voltou para investigar! O tema Segredo já é seu. Troque quando quiser na paleta lá em cima."
      : "Você me achou pelo F12! Isso é investigar do jeitinho de quem programa. Liberei o tema Segredo pra você: já liguei, e dá pra trocar na paleta lá em cima.",
    expressao: "comemorando",
  };
  falar(fala);
  return fala;
}

/** Elementos que já usam Enter sozinhos; aí o atalho global não age. */
function focoUsaEnter(alvo: EventTarget | null): boolean {
  if (!(alvo instanceof HTMLElement)) return false;
  return Boolean(alvo.closest("input, textarea, button, a, select, [contenteditable], [role=tree], .cm-editor"));
}

export function JogoFase({ fase, local, aoRecomecar, modo = "jogo", painelLab }: Props) {
  const lab = modo === "lab";
  const [salvo] = useState(() => (lab ? undefined : obterProgresso().fasesEmAndamento[fase.id]));
  const [bodyInicial] = useState(() => salvo?.htmlAtual ?? fase.siteAlvo.body);
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
    editarTexto,
    editarAtributo,
    alternarEsconder,
    apagar,
    duplicar,
    inserirHtml,
    desfazer,
    antesDeEditarCodigo,
    aoRecarregarDocumento,
  } = usePainelElementos({
    editorRef,
    obterDocumento,
    editarDocumento,
    aoEvento: barramento.emitir,
  });

  /** As mesmas funções que a interface usa; a solução do "Me ajuda" passa por elas. */
  const painel = useMemo<PainelDasAcoes>(
    () => ({
      obterDocumento,
      noSelecionado,
      selecionar,
      editarTexto,
      editarAtributo,
      alternarEsconder,
      apagar,
      duplicar,
      inserirHtml,
      desfazer,
      responderPrevisao: () => {},
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
      inserirHtml,
      desfazer,
    ],
  );

  const obterSelecao = useCallback(() => {
    const atual = selecao();
    const no = noSelecionado();
    return atual && no ? { no, via: viaDaOrigem(atual.origem) } : null;
  }, [noSelecionado, selecao]);

  const {
    estado,
    objetivo,
    pulsarFerramenta,
    contextoValidacao,
    verificar,
    avancarFala,
    seguir,
    ajudar,
    cancelarSolucao,
    confirmarSolucao,
    falar,
    abrirConclusao,
    fecharConclusao,
  } = useMotorFase({
    fase,
    salvo,
    barramento,
    htmlAtual,
    editorRef,
    obterDocumento,
    obterSelecao,
    painel,
    destacarNaArvore,
    toque,
    modo,
  });

  const apresentacoes = useApresentacoes({
    fase,
    etapa: estado.etapa,
    objetivoAtual: estado.objetivoAtual,
    pausa: estado.pausa,
    bloqueada: lab || caixa.aberta || (estado.etapa === "concluida" && estado.conclusaoAberta),
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
    if (ferramenta.id === "arvore" || ferramenta.id === "editar-duplo-clique") trocarSegmento("arvore");
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
        }
      }),
    [barramento],
  );

  // Lab: a gaveta se redesenha a cada evento do painel e a cada recarga da página.
  const [versaoLab, setVersaoLab] = useState(0);
  useEffect(() => {
    if (!lab) return;
    return barramento.assinar(() => setVersaoLab((versao) => versao + 1));
  }, [barramento, lab]);

  const apiLab: ApiLab = {
    versao: versaoLab,
    avaliarItens: (): ItemLab[] => {
      const contexto = contextoValidacao();
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
    aplicarSolucaoAtual: () => {
      if (!objetivo || estado.pausa !== null) return "Nenhum objetivo ativo agora (pausa ou fase concluída).";
      try {
        executarAcoes(objetivo.solucaoDeTeste, painel);
        return null;
      } catch (erro) {
        return erro instanceof Error ? erro.message : String(erro);
      }
    },
  };

  const tutor = useTutor({
    faseId: fase.id,
    objetivo: objetivo ? { id: objetivo.id, enunciado: objetivo.enunciado.mouse } : null,
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

  const aoCarregar = useCallback(
    (documento: Document) => {
      aoCarregarDocumento(documento);
      aoRecarregarDocumento(documento);
      verificar();
    },
    [aoCarregarDocumento, aoRecarregarDocumento, verificar],
  );

  // Enter avança a conversa quando o foco não está num campo ou botão.
  const atalhoEnter = useRef<() => void>(() => {});
  useEffect(() => {
    atalhoEnter.current = () => {
      if (estado.etapa === "introducao") comClique(avancarFala)();
      else if (estado.pausa !== null) comClique(seguir)();
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

  const ultimoObjetivo = estado.concluidos >= fase.objetivos.length;
  const naIntroducao = estado.etapa === "introducao";
  const emObjetivo = estado.etapa === "objetivos" && estado.pausa === null;

  const sobrecargaNaTela = tutor.repetir !== null && tutor.repetir.fala === estado.fala && !tutor.carregando;
  const botaoTentarDeNovo = sobrecargaNaTela ? (
    <Botao variante="secundario" onClick={comClique(tutor.tentarDeNovo)}>
      Tentar de novo
    </Botao>
  ) : null;

  const acoesConversaRoteiro = (() => {
    if (naIntroducao) {
      const ultima = estado.indiceFala >= fase.introducao.length - 1;
      return (
        <>
          <span className="text-xs text-texto-suave">
            {estado.indiceFala + 1} de {fase.introducao.length}
          </span>
          <Botao onClick={comClique(avancarFala)} className="ml-auto">
            {ultima ? "Vamos lá!" : "Continuar"}
          </Botao>
        </>
      );
    }
    if (estado.pausa !== null) {
      return (
        <Botao onClick={comClique(seguir)} className="ml-auto">
          {ultimoObjetivo ? "Ver resultado" : "Próximo objetivo"}
        </Botao>
      );
    }
    if (emObjetivo && estado.confirmandoSolucao) {
      return (
        <>
          <Botao variante="secundario" onClick={comClique(cancelarSolucao)}>
            Não, vou tentar
          </Botao>
          <Botao onClick={confirmarSolucao}>Sim, mostrar a solução</Botao>
        </>
      );
    }
    if (emObjetivo) {
      return (
        <AlvoFerramenta
          ids={["me-ajuda"]}
          marcador="me-ajuda"
          aoAbrirCard={abrirCard}
          classeMarcador="-right-2 -top-2"
          as="span"
          className="inline-flex"
        >
          <BotaoAjuda
            degrau={estado.degrau}
            desativado={false}
            aoAjudar={() => {
              sinalizarUso("me-ajuda");
              comClique(ajudar)();
            }}
          />
        </AlvoFerramenta>
      );
    }
    return (
      <Botao variante="secundario" onClick={comClique(abrirConclusao)} className="ml-auto">
        Ver conclusão
      </Botao>
    );
  })();

  const acoesConversa = (
    <>
      {botaoTentarDeNovo}
      {acoesConversaRoteiro}
    </>
  );

  const objetivoAtivo = estado.etapa === "objetivos" ? estado.objetivoAtual : null;
  const objetivosNaTela = fase.objetivos.map((item) => ({
    id: item.id,
    enunciado: enunciadoDe(item, toque),
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

  const conversa = (
    <>
      {movel && objetivoAtivo !== null && (
        <p className="line-clamp-2 px-1 text-xs font-bold text-texto-suave">
          Objetivo {objetivoAtivo + 1} de {fase.objetivos.length}: {objetivosNaTela[objetivoAtivo].enunciado}
        </p>
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
          titulo={`${local.unidade.zona} › Fase ${local.numero}`}
          estrelas={estado.estrelas}
          fina={layout === "paisagem"}
          menu={
            <>
              <BotaoFerramentas aoAbrir={() => abrirCard(null)} />
              <div className="flex items-center justify-between gap-2">
                <SeletorTema />
                <BotaoSom />
              </div>
              <BotaoRecomecar aoRecomecar={aoRecomecar} noMenu />
            </>
          }
        />
      ) : (
        <BarraSuperior
          trilha={[local.unidade.ilha, local.unidade.zona, `Fase ${local.numero}`]}
          estrelas={estado.estrelas}
          logo={<Mascote tamanho={34} />}
          acoes={
            <>
              <BotaoFerramentas aoAbrir={() => abrirCard(null)} />
              <BotaoRecomecar aoRecomecar={aoRecomecar} />
            </>
          }
        />
      )}
      {layout === "retrato" && !viewport.tecladoAberto && (
        <BarraObjetivosMovel objetivos={objetivosNaTela} concluidos={estado.concluidos} ativo={objetivoAtivo} />
      )}
      <AlvoFerramenta ids={["sincronia"]} as="main" className={classesMain} ref={recipienteMovel}>
        <section aria-label="Painel" className={`flex min-h-0 min-w-0 flex-col ${classesPainel}`}>
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
                  <AlvoFerramenta
                    ids={["arvore"]}
                    marcador="arvore"
                    aoAbrirCard={abrirCard}
                    classeMarcador="bottom-2 right-3"
                    className="h-full"
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
                      aoComecarEdicao={() => sinalizarUso("editar-duplo-clique")}
                    />
                  </AlvoFerramenta>
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
          chaveFala={falaNaTela.texto}
          fecharDepoisDe={
            layout === "paisagem" && emObjetivo && !estado.confirmandoSolucao && !tutor.carregando && !sobrecargaNaTela
              ? tempoDeLeitura(falaNaTela.texto)
              : null
          }
        >
          {conversa}
        </MascoteFlutuante>
      ) : (
        <AreaMascote
          mascote={<Mascote expressao={falaNaTela.expressao} tamanho={112} className="h-auto w-16 sm:w-20 lg:w-28" />}
          conversa={conversa}
          objetivos={
            <ListaObjetivos objetivos={objetivosNaTela} concluidos={estado.concluidos} ativo={objetivoAtivo} />
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
      <TelaConclusao
        aberta={estado.etapa === "concluida" && estado.conclusaoAberta}
        local={local}
        falaFinal={falaFinalDe(fase)}
        estrelas={estado.estrelas}
        indiceFala={estado.indiceFala}
        fala={estado.fala}
        missaoFeita={progresso.missoesDeCampo[fase.id] ?? false}
        aoAlternarMissao={(feita) =>
          atualizarProgresso((atual) => ({
            ...atual,
            missoesDeCampo: { ...atual.missoesDeCampo, [fase.id]: feita },
          }))
        }
        aoAvancar={avancarFala}
        aoFechar={fecharConclusao}
        aoRecomecar={aoRecomecar}
      />
      {lab && painelLab?.(apiLab)}
    </div>
  );
}
