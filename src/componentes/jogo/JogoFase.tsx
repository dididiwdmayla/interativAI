"use client";

import { semPagina, temObjetivos } from "@/motor/tiposDeFase";
import { tocarEfeito } from "@/audio/motor";
import type { IdEfeito } from "@/audio/efeitos";
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlvoFerramenta } from "@/componentes/ferramentas/AlvoFerramenta";
import { ApresentacaoFerramenta } from "@/componentes/ferramentas/ApresentacaoFerramenta";
import { BotaoFerramentas } from "@/componentes/ferramentas/BotaoFerramentas";
import { CaixaFerramentas } from "@/componentes/ferramentas/CaixaFerramentas";
import { BotaoGlossario } from "@/componentes/explorar/BotaoGlossario";
import { useApresentacoes } from "@/componentes/ferramentas/useApresentacoes";
import { comecarPendencia, usePendencias } from "@/lib/pendencias";
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
import { PainelConsole } from "@/componentes/painel/console/PainelConsole";
import { PainelFontes } from "@/componentes/painel/fontes/PainelFontes";
import { PalcoMemoria } from "@/componentes/palco/PalcoMemoria";
import { LinhaDoTempo } from "@/componentes/palco/LinhaDoTempo";
import { usePrograma } from "./usePrograma";
import { useDepurador } from "./useDepurador";
import { useEstruturas } from "./useEstruturas";
import { useOrdenar } from "./useOrdenar";
import { useCasos } from "./useCasos";
import { lerCaso } from "@/motor/casos/modelo";
import { AreaCasos } from "@/componentes/casos/AreaCasos";
import { PilhaDeCartoes, PlanoDePassos } from "@/componentes/ordenar/QuadroPassos";
import { AreaPlano } from "@/componentes/composicao/AreaPlano";
import { TelaComposta } from "@/componentes/composicao/TelaComposta";
import { type AreaTrabalho, areasDaFase, cenaDaFase, faseComposta, quadroDaFase } from "@/motor/composicao";
import { AreaCena, type FocoCena, type VelocidadeCena } from "@/componentes/cena/AreaCena";
import { cenariosDaFase, cenariosDoValidador, textoDaLinhaDoTempo } from "@/motor/cena/validar";
import { chaveLinhaDoTempo, textoDoTempo } from "@/motor/cena/modelo";
import { CATALOGO_DISPOSITIVOS } from "@/motor/cena/catalogo";
import { acharBlocoDoPlano, codigoComPlano, linhaDoPasso, passosNoCodigo } from "@/motor/plano/comentarios";
import { IconePlanoNoCodigo } from "@/componentes/icones/IconePlanoNoCodigo";
import { type EstadoOrdenar, ordemDoPlano } from "@/motor/ordenar/modelo";
import { type AbaDepurador, AvisoPausado, BarraControlesDepurador, PainelDepurador } from "@/componentes/painel/fontes/PainelDepurador";
import { FERRAMENTAS_DO_DEPURADOR } from "@/motor/depurador";
import { useCircuito } from "./useCircuito";
import { BancadaCircuito } from "@/componentes/circuito/BancadaCircuito";
import { PainelTabelaVerdade } from "@/componentes/circuito/PainelTabelaVerdade";
import { circuitoComoCodigo, entradasDo } from "@/motor/circuito/modelo";
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
import { documentoInteiroInicial, lerCssDoDocumento } from "@/lib/documentoSiteAlvo";
import { elementosDaRegra } from "@/lib/elementosDaRegra";
import { falaDoLink } from "@/lib/linksPrevia";
import { faseAbreComMeta } from "@/lib/metaDaUnidade";
import { type EstadoFaseSalvo, PROJETO_VAZIO, type ProjetoSalvo, PROPORCAO_PREVIA } from "@/lib/progresso";
import { marcarPassoDoGuia, salvarLinkPublicado } from "@/lib/projetos";
import { type ArquivosDoProjeto, baixarZip, ligaOCss, montarArquivos } from "@/lib/exportarProjeto";
import { DialogoLevarProMundo } from "@/componentes/projeto/DialogoLevarProMundo";
import { CabecalhoContrato } from "@/componentes/contrato/CabecalhoContrato";
import { ConversaCliente } from "@/componentes/contrato/ConversaCliente";
import { FolhaDocumento, JanelaDocumento } from "@/componentes/contrato/DocumentoCliente";
import { TelaRequisitos } from "@/componentes/contrato/TelaRequisitos";
import { ehContrato, idsDasNovas, montarRelatorio, resumoDosCasos } from "@/motor/contrato/modelo";
import { TelaEntrega } from "@/componentes/contrato/TelaEntrega";
import { GuiaPublicacao } from "@/componentes/projeto/GuiaPublicacao";
import { IconeLevarProMundo } from "@/componentes/icones/IconeLevarProMundo";
import { rotuloDaFase } from "@/motor/tiposDeFase";
import { itensDoChecklist } from "@/motor/validadores";
import { useToque } from "@/lib/useConsultaMidia";
import type { Aba } from "@/motor/abas";
import { criarBarramento } from "@/motor/barramento";
import type { EventoFase } from "@/motor/eventos";
import { enunciadoDe, FALA_CONTRATO, FALA_DESAFIO, FALA_PROJETO, falaFinalDe, type ModoJogo } from "@/motor/estadoMotor";
import { viaDaOrigem } from "@/motor/nucleoPainel";
import { avaliarDetalhado } from "@/motor/validadores";
import { analisarCss } from "@/motor/css/analisarCss";
import { acharDeclaracao, acharRegra } from "@/motor/css/editarCss";
import { NOME_FOLHA_DO_JOGO, valorEfetivo } from "@/motor/css/cascata";
import { materializarFase } from "@/motor/siteDoJogo";
import { auditar, REGRAS_AUDITORIA, type IdRegraAuditoria, type ResultadoAuditoria } from "@/motor/auditoria";
import { PainelLighthouse } from "@/componentes/painel/lighthouse/PainelLighthouse";
import { PainelBusca, type SubAbaBusca } from "@/componentes/painel/busca/PainelBusca";
import { type LinhaMedicao, PainelMedicao } from "@/componentes/painel/medicao/PainelMedicao";
import { ContadorPassos, PainelDesempenho } from "@/componentes/painel/desempenho/PainelDesempenho";
import { PainelCampanha } from "@/componentes/painel/campanha/PainelCampanha";
import { type EstadoCampanha, estadoInicialDaCampanha, simularCampanha } from "@/motor/campanha";
import { eventoDoClique, type Utm } from "@/motor/medicao";
import {
  DISPOSITIVO_INICIAL,
  type EstadoDispositivo,
  arrastarLargura,
  girarDispositivo,
  type IdModelo,
  medidasNaTela,
  orientacaoDe,
  trocarModelo,
  viewportDoDispositivo,
} from "@/motor/dispositivos";
import type { Tela } from "@/motor/css/midia";
import { BotaoDispositivo } from "@/componentes/painel/BotaoDispositivo";
import { BarraDispositivo } from "@/componentes/preview/BarraDispositivo";
import { AvisoContraste } from "@/componentes/tema/AvisoContraste";
import { IconeSalvarTema } from "@/componentes/icones/IconeSalvarTema";
import { conferirContraste, coresDoTemaAtual, montarMeuTema, type ResultadoPar, valorDeCorSeguro } from "@/lib/meuTema";
import { salvarMeuTema } from "@/lib/tema";
import { tokensDoTema, type Tokens } from "@/tema/tokensDoJogo";
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
import type { ResultadoItem } from "@/lib/estadoRevisao";

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
  /**
   * Revisão do dia: o item acabou (depois do "Seguir"), com o resultado
   * para o agendador. "Não lembrei" também chama, com "errou".
   */
  aoTerminarRevisao?: (resultado: ResultadoItem) => void;
  /** Revisão do dia: o caminho da barra (desktop) e o título (celular), no lugar de "Unidade N". */
  barra?: { caminho: string[]; tituloMovel: string };
  /** Acha uma fase pelo id (o desafio da meta, os títulos do Rever). Padrão: o conteúdo; o /lab inclui as bancadas. */
  buscarFase?: (id: string) => Fase | undefined;
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

/** Ferramentas da aba Busca (zona Ser encontrado). */
const FERRAMENTAS_DA_BUSCA: readonly IdFerramenta[] = ["resultado-busca", "dados-estruturados"];

/** (Fase composta) A área de trabalho onde mora cada ferramenta: a apresentação e a ajuda a põem à vista. */
const AREA_DA_FERRAMENTA: Partial<Record<IdFerramenta, AreaTrabalho>> = {
  cena: "cena",
  "ficha-dispositivo": "cena",
  "velocidade-simulacao": "cena",
  "quadro-de-passos": "plano",
  snippet: "snippet",
  console: "snippet",
  "pontos-de-parada": "snippet",
  "controles-depurador": "snippet",
  "painel-escopo": "snippet",
  "painel-observar": "snippet",
  "pilha-de-chamadas": "snippet",
  "palco-memoria": "palco",
  "linha-do-tempo": "palco",
  "contador-passos": "palco",
  "arvore-palco": "palco",
  "casos-de-teste": "testes",
  "plano-no-codigo": "plano",
};

/** Ferramentas da aba Medição (zona Ser encontrado). */
const FERRAMENTAS_DA_MEDICAO: readonly IdFerramenta[] = ["medicao", "link-rastreavel"];

/** Elementos abre sempre; Lighthouse, Busca, Medição e Campanha, nas fases com as ferramentas delas. */
function abasDaFase(fase: Fase): Aba[] {
  // Fase de programa (Ilha Lógica): o Console e, com o Snippet, a aba Fontes. Não há página para Elementos.
  // Com o gráfico passos x tamanho, também a Desempenho.
  if (fase.programa) return [...(fase.programa.snippet ? (["console", "fontes"] as const) : (["console"] as const)), ...(fase.programa.desempenho ? (["desempenho"] as const) : [])];
  const abas: Aba[] = ["elementos"];
  if (fase.usaFerramentas.includes("lighthouse")) abas.push("lighthouse");
  if (FERRAMENTAS_DA_BUSCA.some((id) => fase.usaFerramentas.includes(id))) abas.push("busca");
  if (FERRAMENTAS_DA_MEDICAO.some((id) => fase.usaFerramentas.includes(id))) abas.push("medicao");
  if (fase.tipo === "simulador-campanha") abas.push("campanha");
  return abas;
}

/** "14:05:32", a hora de uma linha do relatório da Medição. */
function horaAgora(): string {
  const agora = new Date();
  return [agora.getHours(), agora.getMinutes(), agora.getSeconds()].map((numero) => String(numero).padStart(2, "0")).join(":");
}

/** CSS para abrir a fase (null sem folha editável): o salvo, ou o de antes do momento roteirizado. */
function cssParaAbrir(fase: Fase, salvo: EstadoFaseSalvo | undefined, projeto: ProjetoSalvo | undefined): string | null {
  if (fase.siteAlvo.css === undefined) return null;
  // Projeto-ponte sem estado (Jogar de novo da ilha): o site do jogador, de Meus projetos.
  if (!salvo) return projeto?.html ? (projeto.css ?? fase.siteAlvo.css) : fase.siteAlvo.css;
  const objetivo = temObjetivos(fase) ? fase.objetivos[salvo.objetivoAtual] : undefined;
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

/**
 * O computadorzinho explica a simulação do meta viewport: sem ele, num
 * celular, a página é desenhada em 980 px e encolhida (a regra que os
 * navegadores de celular seguem para sites feitos antes do celular).
 */
const FALA_VIEWPORT: Fala = {
  texto:
    'Simulação: sem <meta name="viewport"> no head, o celular desenha a página em 980 px e encolhe tudo. Com essa linha, ela usa a largura do aparelho.',
  expressao: "curioso",
};

const FALA_TEMA_SALVO: Fala = {
  texto: "Salvei o Meu tema e já liguei no jogo inteiro! Ele aparece na paleta lá em cima, junto dos outros.",
  expressao: "comemorando",
};

const FALA_TEMA_SALVO_COM_AVISO: Fala = {
  texto: "Salvei do seu jeito e já liguei. Se algum texto ficar difícil de ler, dá pra ajustar e salvar de novo, ou trocar de tema na paleta.",
  expressao: "feliz",
};

/** HTML para abrir a fase: o salvo, ou o de antes do momento roteirizado do objetivo atual. */
function bodyParaAbrir(fase: Fase, salvo: EstadoFaseSalvo | undefined, projeto: ProjetoSalvo | undefined): string {
  if (!salvo) return projeto?.html ?? htmlInicialDaFase(fase);
  const objetivo = temObjetivos(fase) ? fase.objetivos[salvo.objetivoAtual] : undefined;
  if (salvo.introducaoVista && objetivo?.eventoAoComecar && salvo.htmlInicioObjetivo !== null) {
    return salvo.htmlInicioObjetivo;
  }
  return salvo.htmlAtual ?? htmlInicialDaFase(fase);
}

export function JogoFase({
  fase: faseDaProp,
  local,
  aoRecomecar,
  modo = "jogo",
  aoIrParaFase,
  rotaDoMapa,
  aoVoltarAIlha,
  aoRever,
  aoVoltarAoDesafio,
  painelLab,
  aoTerminarRevisao,
  barra,
  buscarFase = faseDoId,
}: Props) {
  const lab = modo === "lab";
  const revisao = modo === "revisao";
  /** Um item da Revisão do dia: sem estrelas, sem glossário, sem recomeçar e sem conclusão própria. */
  const revisaoDoDia = modo === "revisao-dia";
  // Site-alvo "jogo" (E5): a maquete ganha as cores do tema que o jogador usa agora.
  const [coresDaMaquete] = useState(() => {
    const atual = coresDoTemaAtual(obterProgresso());
    return { base: atual.base, cores: atual.cores ?? (faseDaProp.siteAlvo.tipo === "jogo" ? tokensDoTema(atual.base) : {}) };
  });
  const [fase] = useState(() => materializarFase(faseDaProp, coresDaMaquete.cores));
  const siteDoJogo = fase.siteAlvo.tipo === "jogo";
  // Modo dispositivo (a barra de dispositivo do Chrome): só nas fases com a ferramenta.
  const comDispositivo = fase.usaFerramentas.includes("modo-dispositivo");
  const [dispositivo, setDispositivo] = useState<EstadoDispositivo>(DISPOSITIVO_INICIAL);
  /** O mesmo estado, lido na hora pelos validadores (o evento sai antes do React redesenhar). */
  const dispositivoAtual = useRef<EstadoDispositivo>(DISPOSITIVO_INICIAL);
  const [zoomDispositivo, setZoomDispositivo] = useState(1);
  /** Sobe quando a prévia muda de tamanho (aparelho, girar, janela): o Calculado mede de novo. */
  const [versaoLayout, setVersaoLayout] = useState(0);
  const aoRedimensionarPrevia = useCallback(() => setVersaoLayout((versao) => versao + 1), []);
  const [salvo] = useState(() => (modo === "jogo" ? obterProgresso().fasesEmAndamento[fase.id] : undefined));
  const [projetoSalvo] = useState(() =>
    modo === "jogo" && fase.tipo === "projeto-ponte" ? obterProgresso().projetos[fase.id] : undefined,
  );
  const [bodyInicial] = useState(() => bodyParaAbrir(fase, salvo, projetoSalvo));
  const [cssInicial] = useState(() => cssParaAbrir(fase, salvo, projetoSalvo));
  const temCss = cssInicial !== null;
  const [abaEditor, setAbaEditor] = useState<AbaEditor>("html");
  const [barramento] = useState(criarBarramento);
  // Fase composta (src/motor/composicao.ts): a tela é montada pelas áreas de trabalho que a fase declara.
  const composta = faseComposta(fase);
  const areas = useMemo(() => areasDaFase(fase), [fase]);
  // Na fase composta o código é o Snippet: a aba Fontes abre primeiro.
  const [aba, setAba] = useState<Aba>(() => (composta && faseDaProp.programa?.snippet ? "fontes" : faseDaProp.programa ? "console" : "elementos"));
  /** (Fase composta, celular) A área escolhida nas abas e o palco aberto (em pé). */
  const [abaCelular, setAbaCelular] = useState<AreaTrabalho>(() => (areasDaFase(fase).includes("plano") ? "plano" : "snippet"));
  // Em pé, o palco começa recolhido: o plano, o código e os testes precisam da altura (ele abre com um toque).
  const [palcoAberto, setPalcoAberto] = useState(false);
  // Cena programável (área cena): o mundo que o código controla. Em pé, ela fica em cima, aberta.
  const dadosCena = cenaDaFase(fase);
  const [cenaAberta, setCenaAberta] = useState(true);
  const [velocidadeCena, setVelocidadeCena] = useState<VelocidadeCena>(1);
  /** A linha do tempo escolheu um passo: a cena vai para o instante dele. */
  const [focoCena, setFocoCena] = useState<FocoCena | null>(null);
  /** A ficha aberta (o dispositivo e se está no "por dentro"). */
  const [fichaCena, setFichaCena] = useState<{ dispositivo: string; porDentro: boolean } | null>(null);
  const tipoNaCena = useCallback((id: string) => dadosCena?.dispositivos.find((d) => d.id === id)?.tipo ?? null, [dadosCena]);
  const abrirFichaCena = useCallback(
    (id: string): boolean => {
      const tipo = tipoNaCena(id);
      if (!tipo) return false;
      setFichaCena({ dispositivo: id, porDentro: false });
      sinalizarUso("ficha-dispositivo");
      barramento.emitir({ tipo: "abriuFicha", dispositivo: id, tipoDispositivo: tipo });
      return true;
    },
    [barramento, tipoNaCena],
  );
  const verPorDentroCena = useCallback(
    (id: string): boolean => {
      const tipo = tipoNaCena(id);
      if (!tipo) return false;
      setFichaCena({ dispositivo: id, porDentro: true });
      barramento.emitir({ tipo: "viuPorDentro", dispositivo: id, tipoDispositivo: tipo });
      return true;
    },
    [barramento, tipoNaCena],
  );
  const mudarVelocidadeCena = useCallback(
    (velocidade: VelocidadeCena) => {
      setVelocidadeCena(velocidade);
      sinalizarUso("velocidade-simulacao");
      barramento.emitir({ tipo: "mudouVelocidade", velocidade });
    },
    [barramento],
  );
  /** (Fase composta) O layout de agora, lido na hora por mostrarArea (ele é calculado mais abaixo). */
  const layoutAtual = useRef<"desktop" | "retrato" | "paisagem">("desktop");
  /** (Fase composta) Põe a área à vista: no celular, troca a aba (ou, em pé, abre a cena ou o palco de cima). */
  const mostrarArea = useCallback(
    (area: AreaTrabalho) => {
      if (!composta) return;
      const agora = layoutAtual.current;
      const comCena = areasDaFase(fase).includes("cena");
      if (area === "palco") setPalcoAberto(true);
      if (area === "cena") setCenaAberta(true);
      // Em pé, o que mora em cima (a cena, ou o palco sem cena) não é aba.
      const emCima = comCena ? "cena" : "palco";
      if (agora === "retrato" && area !== emCima) setAbaCelular(area);
      if (agora === "paisagem" && area !== "snippet") setAbaCelular(area);
    },
    [composta, fase],
  );
  // Fase de programa: a sessão do executor (Web Worker), o Console e o Snippet.
  const programa = usePrograma({ fase, barramento, salvo: salvo?.programa ?? null, aoUsar: sinalizarUso });
  const editorSnippetRefCedo = programa.editorSnippetRef;
  /** (Fase composta) A linha do comentário do passo que o aluno tocou no plano: continua acesa depois das ajudas. */
  const linhaApontada = useRef<number | null>(null);
  // O depurador da aba Fontes (pontos de parada, controles, Escopo, Observar e Pilha de chamadas).
  const depurador = useDepurador({ fase, barramento, programa, editorRef: programa.editorSnippetRef, salvo: salvo?.programa ?? null, aoUsar: sinalizarUso });
  const [destaqueConsole, setDestaqueConsole] = useState(false);
  // Fase de circuito lógico: a bancada (o circuito é a fonte única de verdade dela).
  const circuito = useCircuito({ fase, barramento, salvo: salvo?.circuito ?? null, aoUsar: sinalizarUso });
  // Fase composta com plano e Snippet: o plano vira comentários no código (o bloco acompanha o quadro).
  const planoNoCodigo = composta && areas.includes("plano") && areas.includes("snippet");
  const { textoSnippet, definirSnippet } = programa;
  /** O quadro mudou: se o bloco do plano já está no código, ele é reescrito (o resto do código fica). */
  const acompanharPlano = useCallback(
    (estado: EstadoOrdenar) => {
      const dados = quadroDaFase(fase);
      if (!planoNoCodigo || !dados) return;
      const atual = textoSnippet();
      const novo = codigoComPlano(atual, dados, estado, false);
      if (novo === atual) return;
      definirSnippet(novo);
      // As linhas mudaram de lugar: a do passo apontado apaga (tocar de novo acende onde ele está agora).
      if (linhaApontada.current !== null) {
        linhaApontada.current = null;
        editorSnippetRefCedo.current?.destacarLinhas([]);
      }
    },
    [definirSnippet, editorSnippetRefCedo, fase, planoNoCodigo, textoSnippet],
  );
  /** Tocar num passo do plano acende o comentário dele no código (se ele já está lá). Devolve se acendeu. */
  const acenderPasso = useCallback(
    (passo: string | null): boolean => {
      const dados = quadroDaFase(fase);
      if (!planoNoCodigo || !dados) return false;
      const linha = passo ? linhaDoPasso(dados, textoSnippet(), passo) : null;
      linhaApontada.current = linha;
      editorSnippetRefCedo.current?.destacarLinhas(linha ? [linha] : []);
      if (!passo || !linha) return false;
      setAba("fontes");
      barramento.emitir({ tipo: "apontouPasso", passo, linha });
      return true;
    },
    [barramento, editorSnippetRefCedo, fase, planoNoCodigo, textoSnippet],
  );
  // Fase de ordenar passos: o quadro (os cartões e o plano).
  const ordenar = useOrdenar({ fase, barramento, salvo: salvo?.ordenar ?? null, programa, aoUsar: sinalizarUso, aoMudarPlano: acompanharPlano, aoEscolher: acenderPasso });
  // Fase composta com a área testes: os casos de teste do aluno, rodados contra a função do Snippet.
  const casos = useCasos({ fase, barramento, programa, salvo: salvo?.casos ?? null, aoUsar: sinalizarUso });
  // Estruturas e desempenho: ver como árvore, o contador de passos e o gráfico da aba Desempenho.
  const estruturas = useEstruturas({ fase, barramento, programa, aoUsar: sinalizarUso });
  const { editorSnippetRef } = programa;
  /** "Levar o plano pro código": o bloco de comentários entra no topo do Snippet (ou é atualizado), sem apagar código. */
  const quadroAgora = ordenar.ordenarAgora;
  const levarPlanoProCodigo = useCallback((): boolean => {
    const quadro = quadroAgora();
    if (!planoNoCodigo || !quadro) return false;
    const novo = codigoComPlano(textoSnippet(), quadro.dados, quadro.estado, true);
    definirSnippet(novo);
    sinalizarUso("plano-no-codigo");
    setAba("fontes");
    mostrarArea("snippet");
    // As linhas do bloco acendem no código.
    const bloco = acharBlocoDoPlano(novo);
    if (bloco) {
      const primeira = novo.slice(0, bloco.de).split("\n").length;
      const ultima = novo.slice(0, bloco.ate).split("\n").length;
      requestAnimationFrame(() => editorSnippetRef.current?.destacarLinhas(Array.from({ length: ultima - primeira + 1 }, (_, i) => primeira + i)));
    }
    barramento.emitir({ tipo: "levouPlanoProCodigo", passos: ordemDoPlano(quadro.dados, quadro.estado).length });
    return true;
  }, [barramento, definirSnippet, editorSnippetRef, mostrarArea, planoNoCodigo, quadroAgora, textoSnippet]);
  // O Snippet mudou (digitando): depois de uma pausa, avisa o motor para conferir o plano no código.
  const snippetDigitado = programa.programaSalvo?.snippet ?? null;
  useEffect(() => {
    if (!composta || snippetDigitado === null) return;
    const encerrar = comecarPendencia();
    const espera = setTimeout(() => {
      barramento.emitir({ tipo: "editouSnippet" });
      encerrar();
    }, 450);
    return () => {
      clearTimeout(espera);
      encerrar();
    };
  }, [barramento, composta, snippetDigitado]);
  // Linha do tempo: o passo escolhido vale só para a execução em que foi escolhido (uma nova volta ao fim).
  const comLinhaDoTempo = fase.usaFerramentas.includes("linha-do-tempo");
  const [escolhaDePasso, setEscolhaDePasso] = useState<{ de: typeof programa.ultimo; indice: number } | null>(null);
  const passosDoRastro = programa.ultimo?.passos ?? [];
  // Pausado no depurador: o palco mostra o passo da pausa.
  const pausaNoPalco = depurador.sessao && depurador.sessao.resultado === programa.ultimo ? depurador.sessao.pausa.indice : null;
  const passoEscolhido = pausaNoPalco ?? (escolhaDePasso && escolhaDePasso.de === programa.ultimo ? escolhaDePasso.indice : null);
  const indicePasso = passoEscolhido ?? passosDoRastro.length - 1;
  const passoNoPalco = passosDoRastro[indicePasso] ?? null;
  const fotoNoPalco = passoNoPalco?.memoria ?? programa.ultimo?.memoriaFinal ?? null;
  const fotoAnteriorNoPalco = passoEscolhido !== null ? (passosDoRastro[passoEscolhido - 1]?.memoria ?? programa.memoriaAnterior) : programa.memoriaAnterior;
  const irParaPasso = (indice: number) => {
    const ultimo = programa.ultimo;
    if (!ultimo || !passosDoRastro.length) return;
    const alvo = Math.max(0, Math.min(passosDoRastro.length - 1, indice));
    setEscolhaDePasso({ de: ultimo, indice: alvo });
    sinalizarUso("linha-do-tempo");
    const linha = passosDoRastro[alvo]?.linha;
    if (ultimo.origem === "snippet") editorSnippetRef.current?.destacarLinhas(linha && alvo < passosDoRastro.length - 1 ? [linha] : []);
    // Cena: ela vai para o instante do passo, só com as mudanças feitas até ali.
    const tempoDoPasso = passosDoRastro[alvo]?.tempoMs;
    if (ultimo.cena && tempoDoPasso !== undefined) setFocoCena({ tempoMs: tempoDoPasso, filtro: { execucao: ultimo.cena.execucao, passo: alvo }, chave: Date.now() });
  };
  /** (Cena) Os instantes de cada passo da última execução: a cena tocando leva a linha do tempo junto. */
  const temposDosPassos = useMemo(() => (programa.ultimo?.cena ? programa.ultimo.passos.map((p) => p.tempoMs) : []), [programa.ultimo]);
  const ultimoDaCena = useRef(programa.ultimo);
  useEffect(() => {
    ultimoDaCena.current = programa.ultimo;
  }, [programa.ultimo]);
  /** A cena passou de um passo para outro (tocando ou arrastando): o palco e a linha do código acompanham. */
  const seguirCena = useCallback(
    (indice: number) => {
      const ultimo = ultimoDaCena.current;
      if (!ultimo) return;
      const final = indice >= ultimo.passos.length - 1;
      setEscolhaDePasso(final ? null : { de: ultimo, indice });
      const linha = ultimo.passos[indice]?.linha;
      if (ultimo.origem === "snippet") editorSnippetRef.current?.destacarLinhas(linha && !final ? [linha] : []);
    },
    [editorSnippetRef],
  );
  const destacarNoPrograma = useCallback(
    (alvo: number[] | "console" | null) => {
      if (alvo === null) {
        setDestaqueConsole(false);
        editorSnippetRef.current?.destacarLinhas(linhaApontada.current !== null ? [linhaApontada.current] : []);
      } else if (alvo === "console") {
        setAba("console");
        setDestaqueConsole(true);
        mostrarArea("snippet");
      } else {
        setAba("fontes");
        mostrarArea("snippet");
        editorSnippetRef.current?.destacarLinhas(alvo);
      }
    },
    [editorSnippetRef, mostrarArea],
  );
  const [quebrarLinhas, setQuebrarLinhas] = useState(true);
  /** Apresentação de uma ferramenta do depurador no celular: o que a aba Fontes mostra. */
  const [pedidoFontes, setPedidoFontes] = useState<{ mostrar: "cima" | "depurador" | "baixo"; aba: AbaDepurador | null; vez: number } | null>(null);
  /** Ponte circuito/Console no celular: a tabela verdade ou o Console. */
  const [ladoDaPonte, setLadoDaPonte] = useState<"cima" | "baixo">("baixo");
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
  useEffect(() => {
    layoutAtual.current = layout;
  }, [layout]);
  const movel = layout !== "desktop";
  /** Deitado não há segmento Estilos (ele fica ao lado da árvore): vale o da árvore. */
  const segmentoVisivel = segmento === "estilos" && layout !== "retrato" ? "arvore" : segmento;
  const viewport = useViewportVisivel();
  const [caixa, setCaixa] = useState<{
    aberta: boolean;
    foco: IdFerramenta | null;
  }>({ aberta: false, foco: null });
  const progresso = useProgresso();
  const toque = useToque();
  const pendencias = usePendencias();

  // A meta (antes/depois) abre o desafio e, uma vez só, a entrada da unidade
  // (ver faseAbreComMeta). Decidido ao abrir a fase, com o progresso de então.
  const desafioDaUnidade = local.unidade.meta.desafioId ? buscarFase(local.unidade.meta.desafioId) : undefined;
  const desafioParaMeta = useMemo(
    () => (desafioDaUnidade?.tipo === "desafio" ? materializarFase(desafioDaUnidade, coresDaMaquete.cores) : null),
    [desafioDaUnidade, coresDaMaquete],
  );
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
      const rolando = janela && ((resultado.destino === "ancora" && resultado.alvo) || resultado.href === "#");
      if (janela && rolando && comportamento === "smooth") {
        // A rolagem suave da prévia conta como pendência até terminar (teto de 1,2 s).
        const encerrar = comecarPendencia();
        janela.addEventListener("scrollend", encerrar, { once: true });
        setTimeout(encerrar, 1200);
      }
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

  // "Salvar como Meu tema" (E5): lê as cores da maquete, confere o contraste e guarda.
  const [avisoContraste, setAvisoContraste] = useState<ResultadoPar[] | null>(null);
  /** Quem fala sobre o tema salvo (ligado ao motor mais abaixo, só quando não atrapalha). */
  const falarDoTema = useRef<(fala: Fala) => void>(() => {});
  /** O computadorzinho explicando algo do painel (o Lighthouse), só quando não atrapalha. */
  const falarLivre = useRef<(fala: Fala) => void>(() => {});

  /** As cores da maquete agora: cada token do tema de base, lido no :root com as variáveis trocadas. */
  const coresDaMaqueteAgora = useCallback((): Tokens | null => {
    const raiz = obterDocumento()?.documentElement;
    if (!raiz) return null;
    const cores: Tokens = {};
    for (const nome of Object.keys(coresDaMaquete.cores)) {
      const efetivo = valorEfetivo(raiz, nome)[nome];
      if (efetivo?.tipo === "valor" && valorDeCorSeguro(efetivo.valor)) cores[nome] = efetivo.valor;
    }
    return cores;
  }, [coresDaMaquete, obterDocumento]);

  /**
   * Salva o Meu tema. Sem `confirmado`, par com contraste abaixo de 4,5:1
   * abre o aviso do computadorzinho (que deixa salvar mesmo assim); as
   * soluções e o lab salvam direto.
   */
  const gravarTema = useCallback(
    (confirmado: boolean): boolean => {
      const novas = siteDoJogo ? coresDaMaqueteAgora() : null;
      if (!novas) return false;
      const meuTema = montarMeuTema(coresDaMaquete.base, coresDaMaquete.cores, novas);
      const ruins = conferirContraste(meuTema.cores).filter((par) => !par.bom);
      if (ruins.length > 0 && !confirmado) {
        setAvisoContraste(ruins);
        return false;
      }
      setAvisoContraste(null);
      salvarMeuTema(meuTema);
      tocarEfeito("desbloqueio");
      barramento.emitir({ tipo: "temaSalvo", paresRuins: ruins.length });
      falarDoTema.current(ruins.length > 0 ? FALA_TEMA_SALVO_COM_AVISO : FALA_TEMA_SALVO);
      return true;
    },
    [barramento, coresDaMaquete, coresDaMaqueteAgora, siteDoJogo],
  );

  /** Muda o modo dispositivo e avisa o barramento (trocouDispositivo ou girou). */
  const mudarDispositivo = useCallback(
    (novo: EstadoDispositivo, evento: "trocou" | "girou") => {
      dispositivoAtual.current = novo;
      setDispositivo(novo);
      realcar(null);
      if (evento === "girou") {
        sinalizarUso("girar-dispositivo");
        barramento.emitir({ tipo: "girou", orientacao: orientacaoDe(novo) });
        return;
      }
      sinalizarUso("modo-dispositivo");
      const { largura, altura } = medidasNaTela(novo);
      barramento.emitir({ tipo: "trocouDispositivo", ligado: novo.ligado, modelo: novo.modelo, largura, altura });
    },
    [barramento, realcar],
  );
  const acoesDispositivo = useMemo(
    () => ({
      trocar: (modelo: IdModelo | "livre", largura?: number) => mudarDispositivo(trocarModelo(dispositivoAtual.current, modelo, largura), "trocou"),
      girar: () => mudarDispositivo(girarDispositivo(dispositivoAtual.current), "girou"),
      desligar: () => mudarDispositivo({ ...dispositivoAtual.current, ligado: false }, "trocou"),
      alternar: () => mudarDispositivo({ ...dispositivoAtual.current, ligado: !dispositivoAtual.current.ligado }, "trocou"),
      arrastar: (largura: number) => {
        const novo = arrastarLargura(dispositivoAtual.current, largura);
        dispositivoAtual.current = novo;
        setDispositivo(novo);
      },
    }),
    [mudarDispositivo],
  );
  // Soltar a alça: a largura livre conta como troca (um evento só, não um por pixel).
  const soltarAlca = useCallback(() => mudarDispositivo(dispositivoAtual.current, "trocou"), [mudarDispositivo]);

  // Aba Lighthouse (auditoria simplificada): só nas fases com a ferramenta.
  const comLighthouse = fase.usaFerramentas.includes("lighthouse");
  // Aba Busca (resultado na busca e dados estruturados): só nas fases com as ferramentas.
  const ferramentasBusca = useMemo(() => FERRAMENTAS_DA_BUSCA.filter((id) => fase.usaFerramentas.includes(id)), [fase]);
  const [subAbaBusca, setSubAbaBusca] = useState<SubAbaBusca>("resultado");
  const abasLivres = useMemo(() => abasDaFase(fase), [fase]);

  // Aba Medição (simulada): os eventos dos data-evento clicados na prévia e as visitas por link rastreável.
  const ferramentasMedicao = useMemo(() => FERRAMENTAS_DA_MEDICAO.filter((id) => fase.usaFerramentas.includes(id)), [fase]);
  const comMedicao = fase.usaFerramentas.includes("medicao");
  const [linhasMedicao, setLinhasMedicao] = useState<LinhaMedicao[]>([]);
  /** A origem da última visita simulada: os próximos eventos contam com ela. */
  const visitaAtual = useRef<Utm | null>(null);
  const medirClique = useCallback(
    (elemento: Element) => {
      const medido = eventoDoClique(elemento);
      if (!medido) return;
      sinalizarUso("medicao");
      barramento.emitir({ tipo: "eventoMedido", nome: medido.nome, origem: visitaAtual.current });
    },
    [barramento],
  );
  const simularVisita = useCallback(
    (utm: Utm) => {
      visitaAtual.current = utm;
      sinalizarUso("link-rastreavel");
      barramento.emitir({ tipo: "visitaSimulada", utm });
    },
    [barramento],
  );
  useEffect(
    () =>
      barramento.assinar((evento) => {
        if (evento.tipo !== "eventoMedido" && evento.tipo !== "visitaSimulada") return;
        tocarEfeito("acerto");
        setLinhasMedicao((atuais) => [
          ...atuais,
          evento.tipo === "eventoMedido"
            ? { id: atuais.length + 1, tipo: "evento", nome: evento.nome, origem: evento.origem, hora: horaAgora() }
            : { id: atuais.length + 1, tipo: "visita", origem: evento.utm, hora: horaAgora() },
        ]);
      }),
    [barramento],
  );

  // Aba Campanha (fase simulador-campanha): orçamento, palavra-chave e lance.
  const dadosCampanha = fase.tipo === "simulador-campanha" ? fase.campanha : null;
  const [campanha, setCampanha] = useState<EstadoCampanha | null>(() => (dadosCampanha ? estadoInicialDaCampanha(dadosCampanha) : null));
  /** O mesmo estado, lido na hora pelos validadores (o evento sai antes do React redesenhar). */
  const campanhaAtual = useRef(campanha);
  const configurarCampanha = useCallback(
    (mudanca: { orcamento?: number; palavra?: string; lance?: number }) => {
      const atual = campanhaAtual.current;
      if (!atual) return;
      const nova: EstadoCampanha = {
        orcamento: mudanca.orcamento ?? atual.orcamento,
        palavra: mudanca.palavra ?? atual.palavra,
        lance: mudanca.lance ?? atual.lance,
      };
      campanhaAtual.current = nova;
      setCampanha(nova);
      sinalizarUso("simulador-campanha");
      barramento.emitir({ tipo: "configurouCampanha", ...nova });
    },
    [barramento],
  );
  const [auditoria, setAuditoria] = useState<{ resultado: ResultadoAuditoria; versao: string } | null>(null);
  const telaDaAuditoria = useRef<Tela | undefined>(undefined);
  const versaoDaPaginaAtual = useRef("");
  const analisarAuditoria = useCallback(() => {
    const documento = obterDocumento();
    if (!documento?.body) return;
    const resultado = auditar(documento, telaDaAuditoria.current ? { tela: telaDaAuditoria.current } : {});
    setAuditoria({ resultado, versao: versaoDaPaginaAtual.current });
    sinalizarUso("lighthouse");
    barramento.emitir({ tipo: "auditou", notas: resultado.notas });
  }, [barramento, obterDocumento]);

  // Levar pro mundo (Publicar): a página vira index.html + style.css, num .zip.
  const comLevarProMundo = fase.usaFerramentas.includes("levar-pro-mundo");
  const nomeDoProjeto = fase.tipo === "projeto-ponte" ? fase.nomeDoProjeto : fase.siteAlvo.titulo;
  const [janelaProjeto, setJanelaProjeto] = useState<"levar" | "guia" | null>(null);
  const [arquivosExportados, setArquivosExportados] = useState<ArquivosDoProjeto | null>(null);
  /** O texto do editor agora (o documento inteiro, no modo documento) e o style.css. */
  const arquivosAgora = useCallback((): ArquivosDoProjeto => {
    const documento = obterDocumento();
    const css = documento ? lerCssDoDocumento(documento) : null;
    return montarArquivos(htmlAtual, css);
  }, [htmlAtual, obterDocumento]);
  const baixarProjeto = useCallback(() => {
    const arquivos = arquivosAgora();
    baixarZip(arquivos, nomeDoProjeto);
    sinalizarUso("levar-pro-mundo");
    tocarEfeito("desbloqueio");
    barramento.emitir({ tipo: "exportouProjeto", arquivos: Object.keys(arquivos) });
  }, [arquivosAgora, barramento, nomeDoProjeto]);
  const abrirLevarProMundo = () => {
    tocarEfeito("clique");
    sinalizarUso("levar-pro-mundo");
    setArquivosExportados(arquivosAgora());
    setJanelaProjeto("levar");
  };

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
      salvarTema: siteDoJogo ? () => gravarTema(true) : undefined,
      dispositivo: comDispositivo ? acoesDispositivo : undefined,
      analisarAuditoria: comLighthouse ? analisarAuditoria : undefined,
      levarProMundo: comLevarProMundo ? baixarProjeto : undefined,
      // Um clique de verdade na prévia faz as duas coisas: mede (data-evento) e, num link, a prévia segura a navegação.
      clicarNaPrevia: comMedicao
        ? (elemento: Element) => {
            medirClique(elemento);
            const link = elemento.closest("a, area");
            if (link) aoClicarLink(link);
          }
        : undefined,
      simularVisita: ferramentasMedicao.includes("link-rastreavel") ? simularVisita : undefined,
      configurarCampanha: dadosCampanha ? configurarCampanha : undefined,
      programa: fase.programa
        ? { executarNoConsole: programa.executarNoConsole, definirSnippet: programa.definirSnippet, executarSnippet: programa.executarSnippet }
        : undefined,
      depurador: depurador.ativo
        ? { alternarPontoDeParada: depurador.alternarPontoDeParada, controlar: depurador.controlar, observar: depurador.observar }
        : undefined,
      ordenar: ordenar.ativo ? { porPasso: ordenar.porPasso, tirarPasso: ordenar.tirarPasso, rodarPlano: ordenar.rodarPlano } : undefined,
      plano: planoNoCodigo ? { levarProCodigo: levarPlanoProCodigo, verPassoNoCodigo: acenderPasso } : undefined,
      casos: casos.ativo ? { escrever: casos.escrever, apagar: casos.apagar, rodar: casos.rodar } : undefined,
      cena: dadosCena ? { abrirFicha: abrirFichaCena, verPorDentro: verPorDentroCena, mudarVelocidade: mudarVelocidadeCena } : undefined,
      estruturas:
        estruturas.comArvore || estruturas.comGrafico
          ? { verComoArvore: estruturas.comArvore ? estruturas.verComoArvore : undefined, medirDesempenho: estruturas.comGrafico ? estruturas.medir : undefined }
          : undefined,
      circuito: circuito.ativo
        ? {
            adicionarPortao: circuito.adicionarPortao,
            ligarFio: circuito.ligarFio,
            alternarEntrada: circuito.alternarEntrada,
            apagarPeca: circuito.apagarPeca,
            verComoCodigo: circuito.verComoCodigo,
          }
        : undefined,
    }),
    [
      dadosCena,
      abrirFichaCena,
      verPorDentroCena,
      mudarVelocidadeCena,
      estruturas.comArvore,
      estruturas.comGrafico,
      estruturas.verComoArvore,
      estruturas.medir,
      ordenar.ativo,
      ordenar.porPasso,
      ordenar.tirarPasso,
      ordenar.rodarPlano,
      planoNoCodigo,
      levarPlanoProCodigo,
      acenderPasso,
      casos.ativo,
      casos.escrever,
      casos.apagar,
      casos.rodar,
      depurador.ativo,
      depurador.alternarPontoDeParada,
      depurador.controlar,
      depurador.observar,
      circuito.ativo,
      circuito.adicionarPortao,
      circuito.ligarFio,
      circuito.alternarEntrada,
      circuito.apagarPeca,
      circuito.verComoCodigo,
      fase.programa,
      programa.executarNoConsole,
      programa.definirSnippet,
      programa.executarSnippet,
      comMedicao,
      medirClique,
      aoClicarLink,
      ferramentasMedicao,
      simularVisita,
      dadosCampanha,
      configurarCampanha,
      baixarProjeto,
      comLevarProMundo,
      analisarAuditoria,
      comLighthouse,
      acoesDispositivo,
      comDispositivo,
      gravarTema,
      siteDoJogo,
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

  // Onde a página é desenhada no aparelho (980 px sem meta viewport num celular) e a tela das @media.
  const viewportAparelho = viewportDoDispositivo(dispositivo, obterDocumento());
  const aparelhoLigado = comDispositivo && dispositivo.ligado;
  const simulandoViewport = aparelhoLigado && viewportAparelho.simulandoViewport;
  const larguraDeDesenho = aparelhoLigado ? viewportAparelho.larguraLayout : 0;
  const alturaDeDesenho = aparelhoLigado ? viewportAparelho.alturaLayout : 0;
  const telaDoAparelho = useMemo<Tela | undefined>(
    () => (larguraDeDesenho > 0 ? { largura: larguraDeDesenho, altura: alturaDeDesenho } : undefined),
    [alturaDeDesenho, larguraDeDesenho],
  );
  const { estadoValidacao: estadoDoPrograma } = programa;
  const { estadoValidacao: estadoDoDepurador, ativo: depuradorAtivo } = depurador;
  // O que fica salvo do programa: as entradas, o Snippet e, com o depurador, os pontos e o Observar.
  const programaSalvo = useMemo(
    () => (programa.programaSalvo && depurador.salvo ? { ...programa.programaSalvo, ...depurador.salvo } : programa.programaSalvo),
    [depurador.salvo, programa.programaSalvo],
  );
  const { circuitoAgora } = circuito;
  const { casosAgora } = casos;
  const { ordenarAgora, setDestaque: destacarNoOrdenar } = ordenar;
  /** Degrau 3 no quadro: pisca o cartão (ou o plano); na fase composta, a área do plano aparece. */
  const destacarNoQuadro = useCallback(
    (alvo: string | null) => {
      destacarNoOrdenar(alvo);
      if (alvo !== null) mostrarArea("plano");
    },
    [destacarNoOrdenar, mostrarArea],
  );
  const extraValidacao = useCallback(() => {
    const doSimulador = {
      ...(dadosCampanha && campanhaAtual.current ? { campanha: { dados: dadosCampanha, estado: campanhaAtual.current } } : {}),
      ...(fase.programa ? { programa: { ...estadoDoPrograma(), ...(depuradorAtivo ? { depurador: estadoDoDepurador() } : {}) } } : {}),
      ...(circuitoAgora() ? { circuito: circuitoAgora() ?? undefined } : {}),
      ...(ordenarAgora() ? { ordenar: ordenarAgora() ?? undefined } : {}),
      ...(fase.programa?.snippet ? { snippet: textoSnippet() } : {}),
      ...(casosAgora() ? { casos: casosAgora() ?? undefined } : {}),
    };
    if (!comDispositivo) return doSimulador;
    const estado = dispositivoAtual.current;
    const atual = viewportDoDispositivo(estado, obterDocumento());
    return {
      ...doSimulador,
      dispositivo: estado,
      tela: estado.ligado ? { largura: atual.larguraLayout, altura: atual.alturaLayout } : undefined,
    };
  }, [casosAgora, circuitoAgora, comDispositivo, dadosCampanha, depuradorAtivo, estadoDoDepurador, estadoDoPrograma, fase.programa, obterDocumento, ordenarAgora, textoSnippet]);

  // Ctrl+Shift+M (Cmd+Shift+M no Mac) liga e desliga a barra, como no Chrome.
  useEffect(() => {
    if (!comDispositivo) return;
    const aoTeclar = (evento: KeyboardEvent) => {
      if (!(evento.ctrlKey || evento.metaKey) || !evento.shiftKey || evento.key.toLowerCase() !== "m") return;
      evento.preventDefault();
      acoesDispositivo.alternar();
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [acoesDispositivo, comDispositivo]);

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
    extraValidacao,
    destacarNoPrograma,
    programaSalvo,
    destacarNoCircuito: circuito.setDestaque,
    circuitoSalvo: circuito.circuito,
    destacarNoOrdenar: destacarNoQuadro,
    ordenarSalvo: ordenar.estado,
    casosSalvos: casos.estado,
  });
  const { estado, objetivo, previsaoPendente, pulsarFerramenta, falar } = motor;

  // Revisão do dia: o maior degrau de ajuda usado e, no fim, o resultado (uma vez só).
  const maiorDegrau = useRef(0);
  useEffect(() => {
    maiorDegrau.current = Math.max(maiorDegrau.current, estado.degrau);
  }, [estado.degrau]);
  const terminou = useRef(false);
  const terminarRevisao = useCallback(
    (resultado: ResultadoItem) => {
      if (terminou.current) return;
      terminou.current = true;
      aoTerminarRevisao?.(resultado);
    },
    [aoTerminarRevisao],
  );
  useEffect(() => {
    if (!revisaoDoDia || estado.etapa !== "concluida" || !temObjetivos(fase)) return;
    const item = fase.objetivos[0];
    const errouPrevisao = item.tipo === "previsao" && estado.previsao !== item.previsao.correta;
    // Pergunta ou dica contam como ajuda (mantém o intervalo); a revisão não tem solução.
    terminarRevisao(errouPrevisao ? "errou" : maiorDegrau.current > 0 ? "com-ajuda" : "sem-ajuda");
  }, [revisaoDoDia, estado.etapa, estado.previsao, fase, terminarRevisao]);

  // A fala do link só entra quando não atrapalha: fora da conversa, da
  // pausa, do card de previsão e dos momentos roteirizados.
  useEffect(() => {
    const livre =
      (estado.etapa === "objetivos" && estado.pausa === null && !previsaoPendente && estado.roteiro === null) ||
      (estado.etapa === "concluida" && !estado.conclusaoAberta);
    falarSobreLink.current = livre ? falar : () => {};
    falarDoTema.current = livre ? falar : () => {};
    falarLivre.current = livre ? falar : () => {};
  }, [estado.etapa, estado.pausa, estado.roteiro, estado.conclusaoAberta, previsaoPendente, falar]);

  // Na primeira vez que a prévia quebra os acentos, o computadorzinho explica (quando não atrapalha).
  const explicouAcentos = useRef(false);
  useEffect(() => {
    if (!simulandoAcentos || explicouAcentos.current) return;
    if (estado.etapa !== "objetivos" || estado.pausa !== null || previsaoPendente || estado.roteiro !== null) return;
    explicouAcentos.current = true;
    falar(FALA_ACENTOS);
  }, [simulandoAcentos, estado.etapa, estado.pausa, estado.roteiro, previsaoPendente, falar]);
  // Na primeira vez que o celular simula os 980 px, o computadorzinho explica (quando não atrapalha).
  const explicouViewport = useRef(false);
  useEffect(() => {
    if (!simulandoViewport || explicouViewport.current) return;
    if (estado.etapa !== "objetivos" || estado.pausa !== null || previsaoPendente || estado.roteiro !== null) return;
    explicouViewport.current = true;
    falar(FALA_VIEWPORT);
  }, [simulandoViewport, estado.etapa, estado.pausa, estado.roteiro, previsaoPendente, falar]);
  const desafio = fase.tipo === "desafio" ? fase : null;
  const projeto = fase.tipo === "projeto-ponte" ? fase : null;
  /** (Contrato) O desafio é o trabalho de um cliente: briefing, requisitos, mudança e entrega. */
  const contrato = ehContrato(fase) ? fase : null;
  const estadoContrato = estado.contrato;
  /** Desafio e projeto-ponte: o checklist (partes ou requisitos); no contrato, as de agora (antes ou depois da mudança). */
  // Antes da etapa de requisitos a lista fica vazia: é o aluno que monta, escolhendo os cartões.
  const listaMontada = !estadoContrato || estadoContrato.etapa === "trabalho" || estadoContrato.etapa === "entrega" || estado.etapa === "concluida";
  const itensChecklist = listaMontada ? itensDoChecklist(fase, estadoContrato?.mudou ?? false) : [];
  const vazioDoChecklist = listaMontada ? undefined : "A lista sai da conversa com o cliente: você monta na etapa de requisitos.";
  const tituloChecklist = contrato ? "Requisitos do cliente" : projeto ? "Requisitos do projeto" : "Checklist do desafio";
  const novasDoContrato = useMemo(() => (contrato && estadoContrato?.mudou ? idsDasNovas(contrato.contrato) : undefined), [contrato, estadoContrato?.mudou]);
  const [documentoAberto, setDocumentoAberto] = useState(false);
  const abrirDocumento = useCallback(() => {
    tocarEfeito("abrir-painel");
    setDocumentoAberto(true);
    barramento.emitir({ tipo: "leuDocumento" });
  }, [barramento]);

  const apresentacoes = useApresentacoes({
    fase,
    etapa: estado.etapa,
    objetivoAtual: estado.objetivoAtual,
    pausa: estado.pausa,
    bloqueada:
      lab ||
      revisaoDoDia ||
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

  /**
   * A peça que o objetivo atual aponta, para as apresentações do painel: a
   * que a linha de ajuda mostra (a regra no Estilos ou o nó na árvore).
   * Null sem linha (objetivo sozinho) ou se nada casa.
   */
  const pecaDoObjetivo = (): number[] | null => {
    const documento = obterDocumento();
    const raiz = documento?.body ? raizDaArvore(documento) : null;
    const linha = objetivo?.modo === "guiado" ? objetivo.ajudas.linha : null;
    const seletor = linha?.alvo === "estilos" || linha?.alvo === "css" ? linha.seletorRegra : linha?.alvo === "arvore" ? linha.seletor : null;
    if (!documento || !raiz || !seletor) return null;
    const elemento = elementosDaRegra(documento, seletor)[0];
    if (!elemento) return null;
    return elemento === raiz ? [] : caminhoDoNo(raiz, elemento);
  };

  /** Troca Estilos | Calculado; sair do Calculado apaga a camada acesa na prévia. */
  const trocarSubAba = (nova: PainelElementos) => {
    setSubAbaElementos(nova);
    if (nova !== "calculado") realcarCamada(null);
  };

  /** Deixa o alvo da apresentação visível: no celular, abre ou fecha o balão e troca Árvore | Código. */
  const prepararAlvo = (ferramenta: Ferramenta) => {
    // Fase composta: a área da ferramenta aparece (no celular, a aba dela); o painel só troca de aba para as dele.
    const area = composta ? AREA_DA_FERRAMENTA[ferramenta.id] : undefined;
    if (area) mostrarArea(area);
    // A aba Lighthouse (ou Busca) para as ferramentas dela; Elementos para as outras (o alvo precisa estar à vista).
    const naBusca = FERRAMENTAS_DA_BUSCA.includes(ferramenta.id);
    const naMedicao = FERRAMENTAS_DA_MEDICAO.includes(ferramenta.id);
    if (!composta || area === "snippet") setAba(
      ferramenta.id === "lighthouse"
        ? "lighthouse"
        : naBusca
          ? "busca"
          : naMedicao
            ? "medicao"
            : ferramenta.id === "simulador-campanha"
              ? "campanha"
              : ferramenta.id === "snippet" || FERRAMENTAS_DO_DEPURADOR.includes(ferramenta.id)
                ? "fontes"
                : ferramenta.id === "grafico-passos"
                  ? "desempenho"
                  : fase.programa
                  ? "console"
                  : "elementos",
    );
    // No celular, o painel do depurador apresentado fica à vista (o botão Depurador e a aba dele).
    if (movel && FERRAMENTAS_DO_DEPURADOR.includes(ferramenta.id)) {
      const abaDoPainel: Partial<Record<IdFerramenta, AbaDepurador>> = { "painel-escopo": "escopo", "painel-observar": "observar", "pilha-de-chamadas": "pilha" };
      const abaPedida = abaDoPainel[ferramenta.id] ?? null;
      setPedidoFontes((anterior) => ({ mostrar: abaPedida ? "depurador" : "cima", aba: abaPedida, vez: (anterior?.vez ?? 0) + 1 }));
    }
    if (ferramenta.id === "resultado-busca") setSubAbaBusca("resultado");
    if (ferramenta.id === "dados-estruturados") setSubAbaBusca("dados");
    // O botão de girar mora na barra de dispositivo: ela aparece, em silêncio (sem evento).
    if (ferramenta.id === "girar-dispositivo" && !dispositivoAtual.current.ligado) {
      const ligado = { ...dispositivoAtual.current, ligado: true };
      dispositivoAtual.current = ligado;
      setDispositivo(ligado);
    }
    if (FERRAMENTAS_DO_CALCULADO.includes(ferramenta.id)) trocarSubAba("calculado");
    else if (FERRAMENTAS_DOS_ESTILOS.includes(ferramenta.id)) trocarSubAba("estilos");
    // Ferramenta do painel que só se experimenta usando (setas, cor, caixinha...): o painel
    // mostra, em silêncio, a peça que o objetivo aponta (sem ela e sem seleção, o body).
    if (FERRAMENTAS_DOS_ESTILOS.includes(ferramenta.id) && ferramenta.uso === "sinal") {
      const caminho = pecaDoObjetivo() ?? (caminhoSelecionado ? null : []);
      if (caminho) selecionar(caminho, "sistema");
    }
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
      if (!temObjetivos(fase)) {
        return (itensChecklist ?? []).map((parte, indice) => ({
          id: parte.id,
          rotulo: `${indice + 1}. ${parte.id}`,
          etiqueta: fase.tipo === "desafio" ? `parte, rever em ${fase.partes[indice].revisarEm}` : "requisito do projeto",
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
    objetivo: contrato
      ? { id: "contrato", enunciado: FALA_CONTRATO.texto }
      : desafio
      ? { id: "desafio", enunciado: FALA_DESAFIO.texto }
      : projeto
        ? { id: "projeto", enunciado: FALA_PROJETO.texto }
        : objetivo
        ? { id: objetivo.id, enunciado: objetivo.enunciado.mouse }
        : null,
    degrau: estado.degrau,
    htmlAtual,
    cssAtual,
    obterPrograma: composta
      ? () => {
          // Fase composta: o plano na ordem do aluno, os casos de teste com o resultado e o código.
          const doCodigo = programa.contextoTutor();
          const quadro = ordenar.ordenarAgora();
          const texto = (id: string) => quadro?.dados.cartoes.find((c) => c.id === id)?.texto ?? id;
          const plano = quadro
            ? `// O plano de "${quadro.dados.problema}", na ordem do aluno\n${ordemDoPlano(quadro.dados, quadro.estado).map((id, i) => `${i + 1}. ${texto(id)}`).join("\n") || "(vazio)"}`
            : "";
          const doTeste = casos.casosAgora();
          const testes = doTeste
            ? `// Casos de teste do aluno\n${
                doTeste.estado.casos
                  .map((caso) => {
                    const resultado = doTeste.estado.resultados[caso.id];
                    const lido = lerCaso(caso);
                    const situacao = !lido.ok ? `não dá para ler (${lido.motivo})` : !resultado ? "ainda não rodou" : resultado.erro ? `deu erro: ${resultado.erro}` : resultado.passou ? "passou" : `falhou, veio ${resultado.obtido ?? "nada"}`;
                    return `${doTeste.dados.funcao}(${caso.entrada}) devolve ${caso.esperado || "?"}: ${situacao}`;
                  })
                  .join("\n") || "(nenhum)"
              }`
            : "";
          // Cena: os dispositivos (com o nome no código) e o que eles fizeram na última simulação.
          const rastroCena = programa.ultimo?.cena;
          const cena = dadosCena
            ? `// A cena "${dadosCena.titulo}" (${textoDoTempo(dadosCena.duracaoMs)}): ${dadosCena.dispositivos.map((d) => `${d.id} (${CATALOGO_DISPOSITIVOS[d.tipo].nome.toLowerCase()})`).join(", ")}\n// ${
                rastroCena?.fimCodigoMs === null || !rastroCena
                  ? "ainda não rodou"
                  : rastroCena.mudancas.length
                    ? `fez: ${rastroCena.mudancas.slice(0, 12).map((m) => `${m.dispositivo}.${m.acao} em ${textoDoTempo(m.tempoMs)}`).join(", ")}`
                    : "rodou e nenhum dispositivo mudou"
              }`
            : "";
          return {
            codigo: [cena, plano, testes, doCodigo?.codigo ?? ""].filter(Boolean).join("\n\n"),
            erro: doCodigo?.erro ?? "",
            variaveis: doCodigo?.variaveis ?? "",
          };
        }
      : ordenar.ativo
      ? () => {
          const quadro = ordenar.ordenarAgora();
          if (!quadro) return null;
          const texto = (id: string) => quadro.dados.cartoes.find((c) => c.id === id)?.texto ?? id;
          const plano = ordemDoPlano(quadro.dados, quadro.estado).map((id, i) => `${i + 1}. ${texto(id)}`).join("\n");
          const doCodigo = quadro.dados.rodar ? programa.contextoTutor() : null;
          return {
            codigo: `// O plano de "${quadro.dados.problema}", na ordem do jogador\n${plano || "(vazio)"}`,
            erro: doCodigo?.erro ?? "",
            variaveis: doCodigo?.variaveis ?? "",
          };
        }
      : circuito.ativo
      ? () => {
          const atual = circuito.circuitoAgora();
          if (!atual) return null;
          const doCircuito = {
            codigo: `// O circuito da bancada, escrito como código\n${circuitoComoCodigo(atual)}`,
            erro: "",
            variaveis: entradasDo(atual)
              .map((peca) => `${peca.nome ?? peca.id} = ${peca.ligada ? "true" : "false"}`)
              .join("; "),
          };
          // Ponte circuito/Console: o tutor vê os dois.
          const doConsole = programa.contextoTutor();
          if (!doConsole) return doCircuito;
          return {
            codigo: [doCircuito.codigo, doConsole.codigo].filter(Boolean).join("\n\n"),
            erro: doConsole.erro,
            variaveis: [doCircuito.variaveis, doConsole.variaveis].filter(Boolean).join("; "),
          };
        }
      : programa.contextoTutor,
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
  // Fase de programa: não há página para carregar; o roteiro inicial (se houver) roda quando a tela monta.
  const faseSemPagina = semPagina(fase);
  useEffect(() => {
    if (faseSemPagina) aoDocumentoPronto();
  }, [aoDocumentoPronto, faseSemPagina]);
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

  // A página de agora (documento, CSS e tela): a análise do Lighthouse fica "velha" quando ela muda.
  const versaoDaPagina = `${versaoDocumento}:${versaoCss}:${telaDoAparelho?.largura ?? 0}x${telaDoAparelho?.altura ?? 0}`;
  useEffect(() => {
    versaoDaPaginaAtual.current = versaoDaPagina;
    telaDaAuditoria.current = telaDoAparelho;
  }, [telaDoAparelho, versaoDaPagina]);

  // O dia simulado da campanha, com a página de destino de agora (muda quando a página muda).
  const resultadoCampanha = useMemo(() => {
    void versaoDaPagina;
    const documento = obterDocumento();
    return dadosCampanha && campanha && documento?.body ? simularCampanha(dadosCampanha, campanha, documento) : null;
  }, [dadosCampanha, campanha, obterDocumento, versaoDaPagina]);

  /** Troca a aba de cima (Elementos, Lighthouse). */
  const trocarAba = useCallback((nova: Aba) => {
    tocarEfeito("clique");
    setAba(nova);
  }, []);

  /** Uma peça de um problema do Lighthouse: volta para Elementos, seleciona e o computadorzinho explica. */
  const irParaPecaDaAuditoria = useCallback(
    (elemento: Element | null, regra: IdRegraAuditoria) => {
      setAba("elementos");
      if (movel) setSegmento("arvore");
      const caminho = elemento?.isConnected ? caminhoDoElemento(elemento) : null;
      if (caminho) selecionar(caminho, "sistema");
      falarLivre.current({ texto: REGRAS_AUDITORIA[regra].porQue, expressao: "curioso" });
    },
    [caminhoDoElemento, movel, selecionar],
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
        rotuloFim={revisaoDoDia ? "Próximo" : undefined}
        previsao={objetivo?.tipo === "previsao" ? objetivo.previsao : null}
        degrauMaximo={motor.degrauMaximo}
        desafio={desafio !== null}
        projeto={projeto !== null}
        contrato={contrato !== null}
        aoAlternarRever={contrato ? comClique(motor.alternarListaRever) : undefined}
        rotuloPausa={estado.pausa === "mudancaDoCliente" ? "Voltar ao trabalho" : undefined}
        listaRever={
          desafio && (
            <ListaRever
              pendentes={desafio.partes.filter((parte) => !estado.partesFeitas.includes(parte.id))}
              tituloDaFase={(id) => buscarFase(id)?.titulo ?? id}
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

  const objetivoAtivo = estado.etapa === "objetivos" && !itensChecklist ? estado.objetivoAtual : null;
  const objetivosNaTela: ObjetivoNaTela[] = (temObjetivos(fase) ? fase.objetivos : []).map((item) => ({
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

  // Circuito: a bancada é onde tudo acontece (a tabela embaixo pode ser menor), então começa no máximo.
  const proporcaoPrevia = viewport.tecladoAberto
    ? PROPORCAO_PREVIA.minima
    : (proporcaoArrastada ?? (circuito.ativo ? PROPORCAO_PREVIA.maxima : progresso.proporcaoPrevia));
  const perguntaDaFala =
    tutor.pendente ?? (tutor.ultima && tutor.ultima.fala === estado.fala ? tutor.ultima.pergunta : null);

  const topoContrato = contrato ? <CabecalhoContrato contrato={contrato.contrato} aoAbrirDocumento={abrirDocumento} /> : null;
  const checklist = itensChecklist ? (
    <ChecklistDesafio partes={itensChecklist} feitas={estado.partesFeitas} titulo={tituloChecklist} novas={novasDoContrato} topo={topoContrato} vazio={vazioDoChecklist} />
  ) : null;
  const objetivoDaLinha = objetivoAtivo !== null ? objetivosNaTela[objetivoAtivo] : null;

  const conversa = (
    <>
      {movel && objetivoDaLinha && (
        <p className="line-clamp-2 px-1 text-xs font-bold text-texto-suave">
          {objetivoDaLinha.sozinho && <SeloSozinho compacto className="mr-1 align-middle" />}
          Objetivo {estado.objetivoAtual + 1} de {objetivosNaTela.length}: {objetivoDaLinha.enunciado}
        </p>
      )}
      {layout === "retrato" && itensChecklist && estado.etapa === "objetivos" && (
        <p className="px-1 text-xs font-bold text-texto-suave">
          {contrato ? "Contrato" : projeto ? "Projeto" : "Desafio"}: {estado.partesFeitas.length} de {itensChecklist.length}{" "}
          {projeto || contrato ? "requisitos cumpridos" : "partes feitas"}
        </p>
      )}
      {layout === "paisagem" && itensChecklist && estado.etapa === "objetivos" && (
        <div className="max-h-40 shrink-0">
          <ChecklistDesafio partes={itensChecklist} feitas={estado.partesFeitas} titulo={tituloChecklist} novas={novasDoContrato} topo={topoContrato} vazio={vazioDoChecklist} />
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

  const rotuloFase = rotuloDaFase(fase.tipo, local.numero, fase.tipo === "desafio" && fase.contrato !== undefined);
  const botaoMapa = rotaDoMapa && !lab ? <BotaoMapa href={rotaDoMapa} compacto={movel} /> : null;
  const botaoVoltar = revisao ? (
    <Botao tamanho={movel ? "m" : "p"} onClick={comClique(() => aoVoltarAoDesafio?.())} className="min-h-9">
      Voltar ao desafio
    </Botao>
  ) : revisaoDoDia && estado.etapa === "objetivos" && estado.pausa === null ? (
    <Botao
      variante="secundario"
      tamanho={movel ? "m" : "p"}
      onClick={() => {
        tocarEfeito("clique");
        terminarRevisao("errou");
      }}
      className="min-h-9"
      data-nao-lembrei
    >
      Não lembrei
    </Botao>
  ) : null;
  const semEstrelas = revisao || revisaoDoDia;
  const semExtras = revisao || revisaoDoDia;

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

  // Estados explícitos para os testes de navegador (testes/util.mjs, esperarPronto):
  // pronta = nada vai mudar a tela sozinho (sem roteiro, timer, recarga, animação do balão ou tutor pensando).
  const pronta = pendencias === 0 && estado.roteiro === null && !tutor.carregando;
  const objetivoAtualId =
    estado.etapa !== "objetivos"
      ? ""
      : temObjetivos(fase)
        ? (fase.objetivos[estado.objetivoAtual]?.id ?? "")
        : contrato
          ? `contrato-${estadoContrato?.etapa ?? "trabalho"}`
          : fase.tipo === "desafio"
          ? "desafio"
          : "projeto";

  const painelTabelaVerdade = circuito.ativo && circuito.circuito ? (
    <AlvoFerramenta ids={["tabela-verdade"]} marcador="tabela-verdade" aoAbrirCard={abrirCard} classeMarcador="right-2 top-2" className="flex min-h-0 flex-1 flex-col">
      <PainelTabelaVerdade
        circuito={circuito.circuito}
        tabela={circuito.tabela}
        testadas={circuito.testadas}
        mostrarCodigo={circuito.mostrarCodigo}
        aoAlternarCodigo={() => {
          tocarEfeito("clique");
          circuito.alternarCodigo();
        }}
        alvoBotao={(botao) => botao}
      />
    </AlvoFerramenta>
  ) : null;

  // (Fase composta) Os passos do plano que já estão no código e a linha do passo escolhido.
  const snippetNaTela = programa.programaSalvo?.snippet ?? programa.snippetInicial;
  const quadroNaTela = planoNoCodigo ? ordenar.dados : null;
  const passosDoPlanoNoCodigo = useMemo(() => (quadroNaTela ? passosNoCodigo(quadroNaTela, snippetNaTela) : undefined), [quadroNaTela, snippetNaTela]);
  const linhaDoEscolhido = quadroNaTela && ordenar.selecionado ? linhaDoPasso(quadroNaTela, snippetNaTela, ordenar.selecionado) : null;

  /**
   * (Cena, variosCenarios) As outras linhas do tempo em que o código rodou no
   * último Executar: as do objetivo de agora (no desafio, as de todas as
   * partes), sem a da própria cena.
   */
  const objetivoDasVariantes = temObjetivos(fase) && estado.etapa === "objetivos" ? fase.objetivos[estado.objetivoAtual] : undefined;
  const variantesCena = useMemo(() => {
    const cenarios = programa.ultimo?.cenarios;
    if (!cenarios || !dadosCena) return [];
    const daCena = chaveLinhaDoTempo(dadosCena.linhaDoTempo);
    const linhas = (objetivoDasVariantes ? cenariosDoValidador(objetivoDasVariantes.validador) : cenariosDaFase(fase)).filter((linha) => chaveLinhaDoTempo(linha) !== daCena);
    return linhas.flatMap((linha, indice) => {
      const rastro = cenarios[chaveLinhaDoTempo(linha)];
      return rastro ? [{ rotulo: `Teste ${indice + 1}`, descricao: textoDaLinhaDoTempo(linha), rastro }] : [];
    });
  }, [dadosCena, fase, objetivoDasVariantes, programa.ultimo]);

  /** O palco da memória (fase de programa): a tela da fase, ou a área palco de uma fase composta. */
  const telaPalco = fase.programa ? (
    <AlvoFerramenta
      ids={["palco-memoria"]}
      marcador="palco-memoria"
      aoAbrirCard={abrirCard}
      classeMarcador="right-3 top-3"
      className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border-2 border-borda bg-codigo-fundo shadow-[0_8px_0_var(--cor-sombra)]"
    >
      <PalcoMemoria
        foto={fotoNoPalco}
        anterior={fotoAnteriorNoPalco}
        passo={passoNoPalco}
        erro={programa.ultimo?.erro ?? null}
        arvores={estruturas.arvores}
        contador={
          estruturas.contador && (
            <AlvoFerramenta ids={["contador-passos"]} marcador="contador-passos" aoAbrirCard={abrirCard} classeMarcador="-right-2 -top-2" as="span" className="inline-flex">
              <ContadorPassos passos={estruturas.contador.passos} />
            </AlvoFerramenta>
          )
        }
      />
      {depurador.ativo && <AvisoPausado depurador={depurador} />}
      {comLinhaDoTempo && pausaNoPalco === null && (
        <AlvoFerramenta ids={["linha-do-tempo"]} marcador="linha-do-tempo" aoAbrirCard={abrirCard} classeMarcador="right-2 -top-2.5">
          <LinhaDoTempo
            passos={passosDoRastro}
            indice={indicePasso}
            aoMudar={irParaPasso}
            codigo={programa.ultimo?.codigo ?? ""}
            cortado={programa.ultimo?.rastroCortado ?? false}
            totalPassos={programa.ultimo?.totalPassos ?? 0}
            fimDaSimulacao={programa.ultimo?.cena?.terminouPorTempo ?? false}
          />
        </AlvoFerramenta>
      )}
    </AlvoFerramenta>
  ) : null;

  const painelDevtools = (
          <AlvoFerramenta
            ids={["painel"]}
            marcador="painel"
            aoAbrirCard={abrirCard}
            classeMarcador="right-2 top-3"
            className="flex min-h-0 flex-1 flex-col"
          >
            <Painel
              abaAtiva={aba}
              abasDesbloqueadas={abasLivres}
              aoTrocarAba={trocarAba}
              abasAltas={composta}
              ferramentas={
                fase.programa ? undefined : <>
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
                  {comDispositivo && (
                    <AlvoFerramenta
                      ids={["modo-dispositivo"]}
                      marcador="modo-dispositivo"
                      aoAbrirCard={abrirCard}
                      classeMarcador="-right-2 -top-1.5"
                      as="span"
                      className="ml-1 inline-flex"
                    >
                      <BotaoDispositivo
                        ativo={dispositivo.ligado}
                        aoAlternar={() => {
                          tocarEfeito("clique");
                          acoesDispositivo.alternar();
                        }}
                      />
                    </AlvoFerramenta>
                  )}
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
              {fase.programa && (
                <div className={aba === "console" ? "flex min-h-0 flex-1 flex-col" : "hidden"}>
                  <AlvoFerramenta ids={["console"]} marcador="console" aoAbrirCard={abrirCard} classeMarcador="right-2 top-1.5" className="flex min-h-0 flex-1 flex-col">
                    <PainelConsole
                      linhas={programa.linhas}
                      historico={programa.historico}
                      aoExecutar={(codigo) => {
                        setDestaqueConsole(false);
                        programa.executarNoConsole(codigo);
                      }}
                      aoLimpar={() => {
                        tocarEfeito("clique");
                        programa.limparConsole();
                      }}
                      toque={toque}
                      ocupado={programa.ocupado}
                      destacado={destaqueConsole}
                      aoFocar={aoFocarEditor}
                    />
                  </AlvoFerramenta>
                </div>
              )}
              {fase.programa?.snippet && (
                <div className={aba === "fontes" ? "flex min-h-0 flex-1 flex-col" : "hidden"}>
                  <PainelFontes
                    nome={programa.nomeSnippet}
                    textoInicial={programa.snippetInicial}
                    editorRef={programa.editorSnippetRef}
                    aoMudar={programa.aoMudarSnippet}
                    aoExecutar={() => {
                      tocarEfeito("clique");
                      programa.executarSnippet();
                    }}
                    alvoExecutar={(botao) => (
                      <AlvoFerramenta ids={["snippet"]} marcador="snippet" aoAbrirCard={abrirCard} classeMarcador="-right-2 -top-1.5" as="span" className="inline-flex shrink-0">
                        {botao}
                      </AlvoFerramenta>
                    )}
                    gaveta={
                      <PainelConsole
                        linhas={programa.linhas}
                        historico={programa.historico}
                        aoExecutar={programa.executarNoConsole}
                        aoLimpar={programa.limparConsole}
                        toque={toque}
                        ocupado={programa.ocupado}
                        destacado={false}
                        aoFocar={aoFocarEditor}
                      />
                    }
                    toque={toque}
                    movel={movel}
                    ocupado={programa.ocupado}
                    aoFocar={aoFocarEditor}
                    alto={composta}
                    depurador={
                      depurador.ativo && depurador.opcoesEditor
                        ? {
                            painel: (
                              <PainelDepurador
                                depurador={depurador}
                                nomeSnippet={programa.nomeSnippet}
                                codigo={programa.programaSalvo?.snippet ?? programa.snippetInicial}
                                emAbas={movel}
                                toque={toque}
                                aoAbrirCard={abrirCard}
                                abaPedida={pedidoFontes?.aba ? { aba: pedidoFontes.aba, vez: pedidoFontes.vez } : null}
                              />
                            ),
                            pedido: pedidoFontes ? { mostrar: pedidoFontes.mostrar, vez: pedidoFontes.vez } : null,
                            barra: <BarraControlesDepurador pausado={depurador.sessao !== null} aoControlar={depurador.controlar} grande aoAbrirCard={abrirCard} />,
                            opcoesEditor: depurador.opcoesEditor,
                            pausado: depurador.sessao !== null,
                            aoPontoNoCursor: () => depurador.alternarPontoDeParada(programa.editorSnippetRef.current?.linhaDoCursor() ?? 1),
                            alvoEditor: (editor) => (
                              <AlvoFerramenta ids={["pontos-de-parada"]} marcador="pontos-de-parada" aoAbrirCard={abrirCard} classeMarcador="right-2 top-2" className="flex min-h-0 flex-1 flex-col">
                                {editor}
                              </AlvoFerramenta>
                            ),
                          }
                        : undefined
                    }
                  />
                </div>
              )}
              {fase.programa?.desempenho && (
                <div className={aba === "desempenho" ? "flex min-h-0 flex-1 flex-col" : "hidden"}>
                  <PainelDesempenho
                    config={fase.programa.desempenho}
                    medicoes={estruturas.medicoes}
                    ocupado={programa.ocupado}
                    aoMedir={() => {
                      tocarEfeito("clique");
                      estruturas.medir();
                    }}
                    aoAbrirCard={abrirCard}
                  />
                </div>
              )}
              {ferramentasMedicao.length > 0 && (
                <div className={aba === "medicao" ? "flex min-h-0 flex-1 flex-col" : "hidden"}>
                  <PainelMedicao
                    linhas={linhasMedicao}
                    ferramentas={ferramentasMedicao}
                    url={fase.siteAlvo.url}
                    podePorNoLink={elementoSelecionado?.closest("a") !== null && elementoSelecionado !== null}
                    aoPorNoLink={(href) => {
                      tocarEfeito("clique");
                      const link = elementoSelecionado?.closest("a");
                      const caminho = link ? caminhoDoElemento(link) : null;
                      if (caminho) editarAtributo(caminho, "href", href);
                    }}
                    aoSimularVisita={(utm) => {
                      tocarEfeito("clique");
                      simularVisita(utm);
                    }}
                    aoAbrirCard={abrirCard}
                  />
                </div>
              )}
              {dadosCampanha && campanha && (
                <div className={aba === "campanha" ? "flex min-h-0 flex-1 flex-col" : "hidden"}>
                  <PainelCampanha
                    dados={dadosCampanha}
                    estado={campanha}
                    resultado={resultadoCampanha}
                    aoConfigurar={configurarCampanha}
                    aoAbrirCard={abrirCard}
                  />
                </div>
              )}
              {ferramentasBusca.length > 0 && (
                <div className={aba === "busca" ? "flex min-h-0 flex-1 flex-col" : "hidden"}>
                  <PainelBusca
                    obterDocumento={obterDocumento}
                    versao={versaoDaPagina}
                    url={fase.siteAlvo.url}
                    aba={subAbaBusca}
                    aoTrocarAba={(nova) => {
                      tocarEfeito("clique");
                      setSubAbaBusca(nova);
                    }}
                    ferramentas={ferramentasBusca}
                    aoAbrirCard={abrirCard}
                  />
                </div>
              )}
              {comLighthouse && (
                <div className={aba === "lighthouse" ? "flex min-h-0 flex-1 flex-col" : "hidden"}>
                  <AlvoFerramenta ids={["lighthouse"]} marcador="lighthouse" aoAbrirCard={abrirCard} classeMarcador="right-2 top-2" className="flex min-h-0 flex-1 flex-col">
                    <PainelLighthouse
                      resultado={auditoria?.resultado ?? null}
                      desatualizado={auditoria !== null && auditoria.versao !== versaoDaPagina}
                      aoAnalisar={() => {
                        tocarEfeito("clique");
                        analisarAuditoria();
                      }}
                      aoIrParaPeca={irParaPecaDaAuditoria}
                    />
                  </AlvoFerramenta>
                </div>
              )}
              <div className={aba === "elementos" ? "contents" : "hidden"}>
              {movel && (
                <div className="flex shrink-0 border-b-2 border-borda bg-painel px-2 py-1.5">
                  <SeletorSegmentado
                    rotulo="Mostrar no painel"
                    opcoes={
                      comEstilos && layout === "retrato"
                        ? [
                            { id: "arvore", rotulo: "Árvore" },
                            { id: "estilos", rotulo: "Estilos" },
                            { id: "codigo", rotulo: "Código" },
                          ]
                        : [
                            // Deitado, o painel Estilos fica ao lado da árvore: um segmento só.
                            { id: "arvore", rotulo: comEstilos ? "Árvore e Estilos" : "Árvore" },
                            { id: "codigo", rotulo: "Código" },
                          ]
                    }
                    valor={segmentoVisivel}
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
                            versao={versaoDocumento * 100000 + versaoCss + versaoLayout * 10_000_000_000}
                            tela={telaDoAparelho}
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
                                  versao={versaoDocumento * 100000 + versaoCss + versaoLayout * 10_000_000_000}
                                  tela={telaDoAparelho}
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
              </div>
            </Painel>
          </AlvoFerramenta>
  );

  return (
    <div
      className="flex h-dvh flex-col overflow-hidden"
      data-layout={layout}
      data-jogo-fase={fase.id}
      data-etapa={estado.etapa}
      data-objetivo-atual={objetivoAtualId}
      data-apresentacao-estado={ferramentaEmCena ? "ativa" : "inativa"}
      data-pronto={pronta ? "sim" : "nao"}
      data-roteiro={estado.roteiro ?? "nenhum"}
      style={movel && viewport.altura ? { height: `calc(${viewport.altura}px - var(--tela-cheia-inset, 0px))` } : undefined}
    >
      {movel ? (
        <BarraSuperiorMovel
          titulo={barra?.tituloMovel ?? `Unidade ${local.unidade.numero} › ${rotuloFase}`}
          estrelas={semEstrelas ? null : estado.estrelas}
          fina={layout === "paisagem"}
          inicio={botaoMapa}
          acaoFixa={botaoVoltar}
          menu={
            <>
              <BotaoFerramentas aoAbrir={() => abrirCard(null)} />
              {!lab && !semExtras && <BotaoGlossario noMenu />}
              <SeletorTema />
              <div data-manter-menu className="border-t-2 border-borda pt-2">
                <AjustesSom />
              </div>
              {!semExtras && <BotaoRecomecar aoRecomecar={aoRecomecar} noMenu />}
            </>
          }
        />
      ) : (
        <BarraSuperior
          caminho={barra?.caminho ?? [local.unidade.ilha, local.unidade.zona, `Unidade ${local.unidade.numero}`, rotuloFase]}
          estrelas={semEstrelas ? null : estado.estrelas}
          logo={<Mascote tamanho={34} />}
          acoes={
            <>
              {botaoVoltar}
              {botaoMapa}
              <BotaoFerramentas aoAbrir={() => abrirCard(null)} />
              {!lab && !semExtras && <BotaoGlossario />}
              {!semExtras && <BotaoRecomecar aoRecomecar={aoRecomecar} />}
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
            itensChecklist && checklist
              ? {
                  total: itensChecklist.length,
                  resumo:
                    estado.etapa === "concluida" ? (contrato ? "Trabalho entregue!" : projeto ? "Projeto pronto!" : "Desafio completo!") : tituloChecklist,
                  lista: checklist,
                }
              : undefined
          }
        />
      )}
      {composta ? (
        <TelaComposta
          layout={layout}
          areas={areas}
          conteudo={{
            cena: dadosCena ? (
              <AlvoFerramenta ids={["cena"]} marcador="cena" aoAbrirCard={abrirCard} classeMarcador="right-2 top-2" className="flex min-h-0 flex-1 flex-col">
                <AreaCena
                  dados={dadosCena}
                  rastro={programa.ultimo?.cena ?? null}
                  velocidade={velocidadeCena}
                  aoMudarVelocidade={(velocidade) => {
                    tocarEfeito("clique");
                    mudarVelocidadeCena(velocidade);
                  }}
                  temposDosPassos={temposDosPassos}
                  variantes={variantesCena}
                  aoPassar={seguirCena}
                  foco={focoCena}
                  mostrarTitulo={layout === "desktop"}
                  ficha={fichaCena}
                  aoTocarDispositivo={(id) => {
                    tocarEfeito("clique");
                    abrirFichaCena(id);
                  }}
                  aoVerPorDentro={(id) => {
                    tocarEfeito("clique");
                    verPorDentroCena(id);
                  }}
                  aoVoltarDaFicha={() => setFichaCena((atual) => (atual ? { ...atual, porDentro: false } : null))}
                  aoFecharFicha={() => setFichaCena(null)}
                  alvoDesenho={(desenho) => (
                    <AlvoFerramenta ids={["ficha-dispositivo"]} marcador="ficha-dispositivo" aoAbrirCard={abrirCard} classeMarcador="right-2 bottom-2 top-auto" className="flex h-full min-h-0 w-full">
                      {desenho}
                    </AlvoFerramenta>
                  )}
                  alvoVelocidade={(seletor) => (
                    <AlvoFerramenta ids={["velocidade-simulacao"]} marcador="velocidade-simulacao" aoAbrirCard={abrirCard} classeMarcador="-right-2 -top-2.5" as="span" className="inline-flex shrink-0">
                      {seletor}
                    </AlvoFerramenta>
                  )}
                />
              </AlvoFerramenta>
            ) : null,
            plano: ordenar.ativo ? (
              <AlvoFerramenta ids={["quadro-de-passos"]} marcador="quadro-de-passos" aoAbrirCard={abrirCard} classeMarcador="right-2 top-2" className="flex min-h-0 flex-1 flex-col">
                <AreaPlano
                  quadro={ordenar}
                  toque={toque}
                  noCodigo={passosDoPlanoNoCodigo}
                  acoes={
                    planoNoCodigo ? (
                      <AlvoFerramenta ids={["plano-no-codigo"]} marcador="plano-no-codigo" aoAbrirCard={abrirCard} classeMarcador="-right-2 -top-1.5" as="span" className="inline-flex shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            tocarEfeito("clique");
                            levarPlanoProCodigo();
                          }}
                          aria-label="Levar o plano pro código"
                          title="Escreve o plano como comentários no topo do Snippet"
                          className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full border-2 border-primaria bg-primaria px-3 text-xs font-black text-sobre-primaria hover:brightness-110 pointer-coarse:h-11"
                          data-levar-plano
                        >
                          <IconePlanoNoCodigo tamanho={14} />
                          Levar pro código
                        </button>
                      </AlvoFerramenta>
                    ) : undefined
                  }
                  rodape={
                    linhaDoEscolhido !== null ? (
                      <div className="mb-1.5 flex shrink-0 items-center gap-2 rounded-xl border-2 border-borda bg-superficie px-3 py-1 text-xs font-bold text-texto" aria-live="polite" data-passo-no-codigo={linhaDoEscolhido}>
                        <span className="min-w-0 flex-1">Este passo está na linha {linhaDoEscolhido} do código.</span>
                        {layout === "retrato" && (
                          <button
                            type="button"
                            onClick={() => {
                              tocarEfeito("clique");
                              mostrarArea("snippet");
                              requestAnimationFrame(() => editorSnippetRef.current?.destacarLinhas([linhaDoEscolhido]));
                            }}
                            className="inline-flex min-h-11 shrink-0 items-center rounded-full border-2 border-primaria px-3 font-black text-primaria hover:bg-hover"
                            data-ver-no-codigo
                          >
                            Ver no código
                          </button>
                        )}
                      </div>
                    ) : undefined
                  }
                />
              </AlvoFerramenta>
            ) : null,
            snippet: painelDevtools,
            palco: telaPalco,
            testes: casos.ativo ? (
              <AlvoFerramenta ids={["casos-de-teste"]} className="flex min-h-0 flex-1 flex-col">
                <AreaCasos
                  casos={casos}
                  toque={toque}
                  ocupado={programa.ocupado}
                  aoFocar={aoFocarEditor}
                  alvoRodar={(botao) => (
                    <AlvoFerramenta ids={["casos-de-teste"]} marcador="casos-de-teste" aoAbrirCard={abrirCard} classeMarcador="-right-2 -top-1.5" as="span" className="inline-flex shrink-0">
                      {botao}
                    </AlvoFerramenta>
                  )}
                />
              </AlvoFerramenta>
            ) : null,
          }}
          abaCelular={abaCelular}
          aoTrocarAba={(area) => {
            tocarEfeito("clique");
            setAbaCelular(area);
          }}
          palcoAberto={palcoAberto}
          aoAlternarPalco={() => {
            tocarEfeito("clique");
            setPalcoAberto((aberto) => !aberto);
          }}
          cenaAberta={cenaAberta}
          aoAlternarCena={() => {
            tocarEfeito("clique");
            setCenaAberta((aberta) => !aberta);
          }}
          tituloCena={dadosCena?.titulo}
          tecladoAberto={viewport.tecladoAberto}
        />
      ) : (
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
          {ordenar.ativo ? (
            <AlvoFerramenta ids={["quadro-de-passos"]} marcador="quadro-de-passos" aoAbrirCard={abrirCard} classeMarcador="right-2 top-2" className="flex min-h-0 flex-1 flex-col">
              <PilhaDeCartoes quadro={ordenar} toque={toque} />
            </AlvoFerramenta>
          ) : circuito.ativo && circuito.circuito && !fase.programa ? (
            painelTabelaVerdade
          ) : circuito.ativo && circuito.circuito ? (
            // Ponte circuito/Console (desafio com circuito e programa): a tabela em cima e o Console embaixo.
            <div className="flex min-h-0 flex-1 flex-col gap-2" data-ponte-circuito-console>
              {movel && (
                <SeletorSegmentado
                  rotulo="Mostrar no painel"
                  opcoes={[
                    { id: "cima", rotulo: "Tabela verdade" },
                    { id: "baixo", rotulo: "Console" },
                  ]}
                  valor={ladoDaPonte}
                  aoTrocar={setLadoDaPonte}
                  className="w-full shrink-0"
                />
              )}
              <div className="min-h-0 flex-1">
                <PainelDividido rotulo="Redimensionar a tabela verdade e o Console" proporcaoInicial={0.42} mostrar={movel ? ladoDaPonte : "ambas"} cima={painelTabelaVerdade} baixo={painelDevtools} />
              </div>
            </div>
          ) : (
            painelDevtools
          )}
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
          aria-label={ordenar.ativo ? "Plano de passos" : circuito.ativo ? "Bancada do circuito" : fase.programa ? "Palco da memória" : "Tela do site"}
          data-previa
          className={`flex min-h-0 min-w-0 flex-col ${classesTela}`}
          style={layout === "retrato" ? { flexBasis: `${proporcaoPrevia * 100}%` } : undefined}
        >
          {ordenar.ativo ? (
            <AlvoFerramenta ids={["quadro-de-passos"]} className="flex min-h-0 flex-1 flex-col">
              <PlanoDePassos quadro={ordenar} linhas={programa.linhas} ocupado={programa.ocupado} toque={toque} />
            </AlvoFerramenta>
          ) : circuito.ativo && circuito.circuito ? (
            <AlvoFerramenta
              ids={["circuito"]}
              marcador="circuito"
              aoAbrirCard={abrirCard}
              classeMarcador="right-3 top-3"
              className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border-2 border-borda shadow-[0_8px_0_var(--cor-sombra)]"
            >
              <BancadaCircuito
                circuito={circuito.circuito}
                valores={circuito.valores}
                fios={circuito.fios}
                paleta={circuito.paleta}
                toque={toque}
                destaque={circuito.destaque}
                aoAdicionar={(portao) => {
                  tocarEfeito("clique");
                  circuito.adicionarPortao(portao);
                }}
                aoLigar={(de, para, porta) => {
                  if (circuito.ligarFio(de, para, porta)) tocarEfeito("clique");
                }}
                aoAlternar={(entrada) => {
                  tocarEfeito("clique");
                  circuito.alternarEntrada(entrada);
                }}
                aoMover={circuito.moverPeca}
                aoApagarPeca={circuito.apagarPeca}
                aoApagarFio={circuito.apagarFio}
              />
            </AlvoFerramenta>
          ) : telaPalco ? (
            telaPalco
          ) : (
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
              acoes={
                comLevarProMundo ? (
                  <AlvoFerramenta
                    ids={["levar-pro-mundo"]}
                    marcador="levar-pro-mundo"
                    aoAbrirCard={abrirCard}
                    classeMarcador="-right-2 -top-1.5"
                    as="span"
                    className="inline-flex shrink-0"
                  >
                    <button
                      type="button"
                      data-levar-pro-mundo
                      onClick={abrirLevarProMundo}
                      aria-label="Levar pro mundo"
                      title="Levar pro mundo: baixar os arquivos do site"
                      className="inline-flex h-7 items-center gap-1 rounded-full border-2 border-primaria bg-primaria px-2.5 text-xs font-black text-sobre-primaria hover:brightness-110 pointer-coarse:h-11 pointer-coarse:min-w-11 pointer-coarse:justify-center"
                    >
                      <IconeLevarProMundo tamanho={16} />
                      <span className={movel ? "sr-only" : ""}>Levar pro mundo</span>
                    </button>
                  </AlvoFerramenta>
                ) : siteDoJogo ? (
                  <AlvoFerramenta
                    ids={["salvar-tema"]}
                    marcador="salvar-tema"
                    aoAbrirCard={abrirCard}
                    classeMarcador="-right-2 -top-1.5"
                    as="span"
                    className="inline-flex shrink-0"
                  >
                    <button
                      type="button"
                      data-salvar-tema
                      onClick={() => {
                        tocarEfeito("clique");
                        sinalizarUso("salvar-tema");
                        gravarTema(false);
                      }}
                      aria-label="Salvar como Meu tema"
                      title="Salvar as cores da maquete como Meu tema"
                      className="inline-flex h-7 items-center gap-1 rounded-full border-2 border-primaria bg-primaria px-2.5 text-xs font-black text-sobre-primaria hover:brightness-110 pointer-coarse:h-11 pointer-coarse:min-w-11 pointer-coarse:justify-center"
                    >
                      <IconeSalvarTema tamanho={16} />
                      <span className={movel ? "sr-only" : ""}>Salvar como Meu tema</span>
                    </button>
                  </AlvoFerramenta>
                ) : undefined
              }
              tituloAba={fase.modoDocumento ? tituloAba : undefined}
              barra={
                aparelhoLigado ? (
                  <AlvoFerramenta ids={["modo-dispositivo"]} className="flex shrink-0 flex-col">
                    <BarraDispositivo
                      estado={dispositivo}
                      zoom={zoomDispositivo}
                      compacta={movel}
                      aoTrocarModelo={(modelo, largura) => {
                        tocarEfeito("clique");
                        acoesDispositivo.trocar(modelo, largura);
                      }}
                      aoGirar={() => {
                        tocarEfeito("clique");
                        acoesDispositivo.girar();
                      }}
                      alvoGirar={(botao) => (
                        <AlvoFerramenta
                          ids={["girar-dispositivo"]}
                          marcador="girar-dispositivo"
                          aoAbrirCard={abrirCard}
                          classeMarcador="-right-2 -top-1.5"
                          as="span"
                          className="inline-flex shrink-0"
                        >
                          {botao}
                        </AlvoFerramenta>
                      )}
                    />
                  </AlvoFerramenta>
                ) : undefined
              }
              aviso={
                simulandoViewport ? (
                  <button
                    type="button"
                    data-aviso-viewport
                    onClick={() => falar(FALA_VIEWPORT)}
                    className="absolute bottom-2 left-2 z-20 flex max-w-[calc(100%-1rem)] items-center gap-1.5 rounded-full border-2 border-alerta bg-superficie px-3 py-1 text-left text-xs font-bold text-texto shadow-[0_3px_0_var(--cor-sombra)] pointer-coarse:min-h-11"
                  >
                    <IconeAviso className="shrink-0 text-alerta" />
                    Sem meta viewport: página em 980 px, encolhida (simulação)
                  </button>
                ) : simulandoAcentos ? (
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
                aoClicarElemento={comMedicao ? medirClique : undefined}
                dispositivo={aparelhoLigado ? viewportAparelho : null}
                aoArrastarLargura={aparelhoLigado ? acoesDispositivo.arrastar : undefined}
                aoSoltarAlca={soltarAlca}
                aoMudarZoom={setZoomDispositivo}
                aoRedimensionar={aoRedimensionarPrevia}
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
          )}
        </section>
      </AlvoFerramenta>
      )}
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
      {siteDoJogo && (
        <AvisoContraste
          aberto={avisoContraste !== null}
          ruins={avisoContraste ?? []}
          aoVoltar={() => setAvisoContraste(null)}
          aoSalvarMesmoAssim={() => gravarTema(true)}
        />
      )}
      {comLevarProMundo && (
        <>
          <DialogoLevarProMundo
            aberto={janelaProjeto === "levar"}
            arquivos={arquivosExportados}
            nome={nomeDoProjeto}
            linhaAcrescentada={!ligaOCss(htmlAtual)}
            aoBaixar={baixarProjeto}
            aoVerGuia={() => setJanelaProjeto("guia")}
            aoFechar={() => setJanelaProjeto(null)}
          />
          <GuiaPublicacao
            aberto={janelaProjeto === "guia"}
            marcados={(progresso.projetos[fase.id] ?? PROJETO_VAZIO).guia}
            link={(progresso.projetos[fase.id] ?? PROJETO_VAZIO).link}
            aoMarcar={(passo, marcado) => {
              if (modo === "jogo") marcarPassoDoGuia(fase.id, passo, marcado);
            }}
            aoSalvarLink={(link) => {
              if (modo === "jogo") salvarLinkPublicado(fase.id, link);
              tocarEfeito("acerto");
            }}
            aoFechar={() => setJanelaProjeto(null)}
          />
        </>
      )}
      {contrato && estadoContrato && (
        <>
          <ConversaCliente
            key="briefing"
            aberta={estado.etapa === "objetivos" && estadoContrato.etapa === "briefing" && estado.roteiro === null && !ferramentaEmCena}
            titulo="Um cliente novo"
            etiqueta="Cliente novo"
            cliente={contrato.contrato.cliente}
            falas={contrato.contrato.briefing}
            depois={<FolhaDocumento contrato={contrato.contrato} mudou={false} />}
            rotuloFim="Montar a lista de requisitos"
            aoTerminar={comClique(motor.irParaRequisitos)}
          />
          <TelaRequisitos
            aberta={estado.etapa === "objetivos" && estadoContrato.etapa === "requisitos"}
            contrato={contrato.contrato}
            escolhaSalva={estadoContrato.escolha}
            tentativas={estadoContrato.tentativas}
            aoConferir={motor.conferirListaDeRequisitos}
          />
          <ConversaCliente
            key={`mudanca-${estadoContrato.mudou ? "sim" : "nao"}`}
            aberta={estado.pausa === "mudancaDoCliente"}
            titulo="Mensagem do cliente"
            etiqueta="Mensagem nova"
            cliente={contrato.contrato.cliente}
            falas={contrato.contrato.mudanca.mensagem}
            rotuloFim="Voltar ao trabalho"
            aoTerminar={comClique(motor.seguir)}
          />
          <TelaEntrega
            aberta={estado.etapa === "objetivos" && estadoContrato.etapa === "entrega"}
            contrato={contrato.contrato}
            relatorio={montarRelatorio({
              fase: contrato,
              feitas: estado.partesFeitas,
              mudou: estadoContrato.mudou,
              casos: casos.estado ? resumoDosCasos(casos.estado) : null,
              cenarios: dadosCena ? new Set([chaveLinhaDoTempo(dadosCena.linhaDoTempo), ...cenariosDaFase(fase).map(chaveLinhaDoTempo)]).size : 0,
              tempoMs: estadoContrato.tempoMs,
            })}
            aoEntregar={comClique(motor.entregar)}
          />
          <JanelaDocumento aberta={documentoAberto} contrato={contrato.contrato} mudou={estadoContrato.mudou} aoFechar={() => setDocumentoAberto(false)} />
        </>
      )}
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
        aberta={estado.etapa === "concluida" && estado.conclusaoAberta && !revisaoDoDia}
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
        extras={
          comLevarProMundo ? (
            <Botao variante="secundario" onClick={abrirLevarProMundo} data-levar-pro-mundo-conclusao>
              Levar pro mundo
            </Botao>
          ) : undefined
        }
      />
      {lab && painelLab?.(apiLab)}
    </div>
  );
}
