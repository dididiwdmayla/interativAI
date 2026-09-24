/*
 * Unidade 2, Desafio: "Brinquedos Arco-Íris".
 *
 * O QUE PRATICA: tudo da unidade junto, num site NOVO (uma loja, não o
 * jornal), sem passo a passo. O jogador vê a meta com o antes e o depois,
 * e um checklist vai se marcando sozinho a cada parte feita.
 *
 * COMO AS PARTES FORAM ESCOLHIDAS: uma parte por habilidade dos
 * micro-passos, cada uma apontando (revisarEm) para a fase onde ela foi
 * ensinada. Se o jogador travar, o "Rever" abre essa fase em modo revisão.
 * - apagar o pop-up e o anúncio lateral: fase 2 (apagar);
 * - esconder o banner mantendo o espaço: fase 2 (esconder). O validador
 *   "escondido" não aceita apagar, então a diferença entre os dois conta;
 * - duplicar um produto e renomear a cópia: fase 3 (e revisa editar texto);
 * - selecionar a vitrine inteira pela trilha: fase 1.
 *
 * DIFERENÇAS DE PROPÓSITO EM RELAÇÃO AO JORNAL: o pop-up aqui flutua POR
 * CIMA da vitrine (atrapalha até a setinha, o que dá motivo para tirar ele
 * primeiro), os produtos são outra tag de card e a vitrine é uma section
 * com id. Nada de copiar o caminho decorado: tem que olhar a árvore.
 *
 * ESTRELAS: 3, e cada "Rever" usado custa 1 (mínimo 1). Não há solução
 * pronta no desafio.
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { SITE_BRINQUEDOS } from "./sites/brinquedosArcoIris";

export const FASE_U2_F4: FaseDesafio = {
  id: "sites-elementos-u2-f4",
  tipo: "desafio",
  unidadeId: "sites-elementos-u2",
  titulo: "Brinquedos Arco-Íris",
  conceitos: ["esconder-elemento", "remover-do-documento", "duplicar-elemento", "elemento-pai"],
  revisa: ["editar-texto"],
  prerequisitos: ["esconder-elemento", "remover-do-documento", "duplicar-elemento", "elemento-pai"],
  usaFerramentas: [
    "painel",
    "previa",
    "me-ajuda",
    "tutor",
    "arvore",
    "inspecionar",
    "editar-duplo-clique",
    "trilha",
    "esconder",
    "apagar",
    "desfazer",
    "duplicar",
  ],
  siteAlvo: SITE_BRINQUEDOS,

  introducao: [
    {
      texto: "Chegou a hora do desafio! Uma loja de brinquedos pediu socorro: o site está uma bagunça.",
      expressao: "feliz",
    },
    {
      texto: "Sem passo a passo desta vez. O checklist marca cada parte sozinho quando você fizer.",
      expressao: "curioso",
    },
    {
      texto: "Travou? O botão Rever te leva de volta pra fase onde aquilo foi ensinado. Bora arrumar?",
      expressao: "apontando",
    },
  ],

  partes: [
    {
      id: "apagar-popup",
      descricao: "Apagar o pop-up de oferta que flutua em cima da vitrine",
      validador: { tipo: "naoExiste", seletor: "#popup-oferta" },
      revisarEm: "sites-elementos-u2-f2",
      solucaoDeTeste: [{ tipo: "apagar", seletor: "#popup-oferta" }],
    },
    {
      id: "esconder-banner",
      descricao: "Esconder o banner do topo, mantendo o espaço dele",
      validador: { tipo: "escondido", seletor: "#banner-topo" },
      revisarEm: "sites-elementos-u2-f2",
      solucaoDeTeste: [{ tipo: "esconder", seletor: "#banner-topo" }],
    },
    {
      id: "apagar-lateral",
      descricao: "Apagar o anúncio lateral",
      validador: { tipo: "naoExiste", seletor: "#anuncio-lateral" },
      revisarEm: "sites-elementos-u2-f2",
      solucaoDeTeste: [{ tipo: "apagar", seletor: "#anuncio-lateral" }],
    },
    {
      id: "duplicar-produto",
      descricao: "Duplicar um produto da vitrine e dar um nome novo à cópia",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "contagem", seletor: "#vitrine .produto", op: ">=", valor: 5 },
          { tipo: "textoDiferenteDoInicial", seletor: "#vitrine .produto h3" },
        ],
      },
      revisarEm: "sites-elementos-u2-f3",
      solucaoDeTeste: [
        { tipo: "duplicar", seletor: "#vitrine .produto" },
        { tipo: "definirTexto", seletor: "$0 h3", valor: "Robô dançarino" },
      ],
    },
    {
      id: "selecionar-vitrine",
      descricao: "Selecionar a vitrine inteira pela trilha",
      validador: { tipo: "selecionado", seletor: "#vitrine", via: "trilha" },
      revisarEm: "sites-elementos-u2-f1",
      solucaoDeTeste: [
        { tipo: "selecionar", seletor: "#vitrine .produto h3" },
        { tipo: "selecionar", seletor: "#vitrine", via: "trilha" },
      ],
    },
  ],

  conclusao: [
    {
      texto: "Desafio vencido! Loja limpa, vitrine nova, e tudo sem passo a passo.",
      expressao: "comemorando",
    },
    {
      texto: "Esconder, apagar, desfazer, duplicar e andar pela família: você já faz faxina em qualquer site.",
      expressao: "feliz",
    },
  ],

  missaoDeCampo:
    "Escolha um site de verdade cheio de anúncios, aperte F12 e faça uma faxina: esconda um banner (tecla H), apague um pop-up (Delete) e desfaça um erro (Ctrl+Z). Só você vê, e tudo volta quando recarregar.",

  falaFinal: {
    texto: "Lembra: no F12 a página é sua para explorar. Recarregou, voltou tudo. Pode mexer sem medo!",
    expressao: "comemorando",
  },
};
