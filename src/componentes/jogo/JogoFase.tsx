"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BarraSuperior } from "@/componentes/layout/BarraSuperior";
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
import { atualizarProgresso, obterProgresso, useProgresso } from "@/lib/armazemProgresso";
import { tocarSom } from "@/lib/som";
import { desbloquearTema, escolherTema } from "@/lib/tema";
import type { Aba } from "@/motor/abas";
import { criarBarramento } from "@/motor/barramento";
import type { Fala, Fase } from "@/motor/tipos";
import { SeletorVista } from "./SeletorVista";
import { TelaConclusao } from "./TelaConclusao";
import { useMotorFase } from "./useMotorFase";
import { usePainelElementos } from "./usePainelElementos";
import { useSiteAlvo } from "./useSiteAlvo";
import { useTutor } from "./useTutor";

type Props = {
  fase: Fase;
  aoRecomecar: () => void;
};

const FALA_PENSANDO: Fala = { texto: "Hmm, deixa eu pensar...", expressao: "pensativo" };

const PALAVRA_SECRETA = "curioso";

function telaPequena(): boolean {
  return window.matchMedia("(max-width: 1023.98px)").matches;
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

export function JogoFase({ fase, aoRecomecar }: Props) {
  const [salvo] = useState(() => obterProgresso().fasesEmAndamento[fase.id]);
  const [bodyInicial] = useState(() => salvo?.htmlAtual ?? fase.bodyInicial);
  const [barramento] = useState(criarBarramento);
  const [aba, setAba] = useState<Aba>("elementos");
  const [quebrarLinhas, setQuebrarLinhas] = useState(true);
  const [vistaMovel, setVistaMovel] = useState<"painel" | "tela">("painel");
  const progresso = useProgresso();

  const {
    editorRef,
    previewRef,
    arvore,
    htmlAtual,
    aoEditarCodigo,
    aoCarregarDocumento,
    obterDocumento,
    editarDocumento,
    substituirHtml,
  } = useSiteAlvo(bodyInicial);

  const {
    caminhoSelecionado,
    recolhidos,
    realce,
    inspecionando,
    destaque,
    destacarNaArvore,
    selecionar,
    alternarRecolhido,
    realcar,
    alternarInspecao,
    apontarNaTela,
    escolherNaTela,
    rolarTela,
    editarTexto,
    editarAtributo,
    aoRecarregarDocumento,
  } = usePainelElementos({ editorRef, obterDocumento, editarDocumento, aoEvento: barramento.emitir });

  const {
    estado,
    objetivo,
    pulsarInspecionar,
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
    selecionarCaminho: selecionar,
    editarTextoCaminho: editarTexto,
    substituirHtml,
    destacarNaArvore,
  });

  const tutor = useTutor({
    faseId: fase.id,
    objetivo: objetivo ? { id: objetivo.id, enunciado: objetivo.enunciado } : null,
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

  // Em telas pequenas, painel e tela são abas: o modo inspecionar mostra a tela.
  const alternarInspecaoResponsiva = () => {
    tocarSom("clique");
    if (!inspecionando && telaPequena()) setVistaMovel("tela");
    alternarInspecao();
  };
  const escolherNaTelaResponsiva = (x: number, y: number) => {
    escolherNaTela(x, y);
    if (telaPequena()) setVistaMovel("painel");
  };

  const aoEditarNoEditor = useCallback(
    (texto: string) => {
      aoEditarCodigo(texto);
      barramento.emitir({ tipo: "editouCodigo" });
    },
    [aoEditarCodigo, barramento],
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

  const acoesConversa = (() => {
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
      return <BotaoAjuda degrau={estado.degrau} desativado={false} aoAjudar={comClique(ajudar)} />;
    }
    return (
      <Botao variante="secundario" onClick={comClique(abrirConclusao)} className="ml-auto">
        Ver conclusão
      </Botao>
    );
  })();

  const objetivoAtivo = estado.etapa === "objetivos" ? estado.objetivoAtual : null;
  const falaNaTela = tutor.pendente !== null ? FALA_PENSANDO : estado.fala;
  const perguntaDaFala =
    tutor.pendente ?? (tutor.ultima && tutor.ultima.fala === estado.fala ? tutor.ultima.pergunta : null);

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <BarraSuperior
        trilha={[fase.ilha, fase.zona, `Fase ${fase.numero}`]}
        estrelas={estado.estrelas}
        logo={<Mascote tamanho={34} />}
        acoes={<BotaoRecomecar aoRecomecar={aoRecomecar} />}
      />
      <div className="flex shrink-0 justify-center px-3 pt-3 lg:hidden">
        <SeletorVista vista={vistaMovel} aoTrocar={setVistaMovel} />
      </div>
      <main className="flex min-h-0 flex-1 gap-4 p-3 lg:p-4">
        <section
          id="vista-painel"
          aria-label="Painel"
          className={`${vistaMovel === "painel" ? "flex" : "hidden"} min-h-0 w-full min-w-0 flex-col lg:flex lg:w-[45%]`}
        >
          <Painel
            abaAtiva={aba}
            abasDesbloqueadas={fase.abasDesbloqueadas}
            aoTrocarAba={setAba}
            ferramentas={
              <BotaoInspecionar
                ativo={inspecionando}
                pulsando={pulsarInspecionar && !inspecionando}
                aoAlternar={alternarInspecaoResponsiva}
              />
            }
          >
            <PainelDividido
              rotulo="Redimensionar árvore e editor"
              proporcaoInicial={0.5}
              cima={
                <ArvoreElementos
                  raiz={arvore}
                  recolhidos={recolhidos}
                  caminhoSelecionado={caminhoSelecionado}
                  destaque={destaque}
                  aoSelecionar={selecionar}
                  aoAlternar={alternarRecolhido}
                  aoPassarMouse={realcar}
                  aoEditarTexto={editarTexto}
                  aoEditarAtributo={editarAtributo}
                />
              }
              baixo={
                <div className="flex h-full min-h-0 flex-col">
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
                      rotulo="Editor do código HTML do corpo da página"
                    />
                  </div>
                </div>
              }
            />
          </Painel>
        </section>
        <section
          id="vista-tela"
          aria-label="Tela do site"
          className={`${vistaMovel === "tela" ? "flex" : "hidden"} min-h-0 min-w-0 flex-1 flex-col lg:flex`}
        >
          <JanelaNavegador url={fase.urlSiteAlvo}>
            <PreviewSiteAlvo
              ref={previewRef}
              head={fase.headSiteAlvo}
              bodyInicial={bodyInicial}
              titulo={fase.tituloSiteAlvo}
              aoCarregar={aoCarregar}
            >
              <SobreposicaoInspecao realce={realce} />
              <CamadaInspecao
                ativa={inspecionando}
                aoApontar={apontarNaTela}
                aoEscolher={escolherNaTelaResponsiva}
                aoSair={() => realcar(null)}
                aoRolar={rolarTela}
              />
            </PreviewSiteAlvo>
          </JanelaNavegador>
        </section>
      </main>
      <AreaMascote
        mascote={
          <Mascote expressao={falaNaTela.expressao} tamanho={112} className="h-auto w-16 sm:w-20 lg:w-28" />
        }
        conversa={
          <>
            {objetivoAtivo !== null && (
              <p className="mb-1 line-clamp-1 text-xs font-bold text-texto-suave lg:hidden">
                Objetivo {objetivoAtivo + 1} de {fase.objetivos.length}: {fase.objetivos[objetivoAtivo].enunciado}
              </p>
            )}
            <BalaoFala fala={falaNaTela} pergunta={perguntaDaFala}>
              {acoesConversa}
            </BalaoFala>
            <CampoTutor
              carregando={tutor.carregando}
              desativado={naIntroducao}
              motivoDesativado="Primeiro, termine a conversa inicial"
              aoEnviar={tutor.enviar}
            />
          </>
        }
        objetivos={
          <ListaObjetivos objetivos={fase.objetivos} concluidos={estado.concluidos} ativo={objetivoAtivo} />
        }
      />
      <TelaConclusao
        aberta={estado.etapa === "concluida" && estado.conclusaoAberta}
        fase={fase}
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
    </div>
  );
}
