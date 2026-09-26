/*
 * E1, Desafio: "Café Cantinho do Grão".
 *
 * O QUE PRATICA: tudo da unidade junto, num site NOVO (uma cafeteria, não
 * a floricultura), sem passo a passo. A meta mostra o antes e o depois
 * (o depois sai das soluções das partes), e o checklist se marca sozinho.
 *
 * COMO AS PARTES FORAM ESCOLHIDAS: uma por habilidade dos micro-passos,
 * cada uma apontando (revisarEm) para a fase onde ela foi ensinada guiada:
 * - fundo do topo em hexadecimal: Fase 3 (hexadecimal e seletor de cor);
 * - título maior: Fase 2 (setas nos números);
 * - desligar a linha tracejada dos itens: Fase 1 (a caixinha). O validador
 *   é `declaracao ... ativa: false`: apagar a declaração no editor também
 *   tiraria a linha, mas o pedido é desligar (dá para ligar de novo);
 * - fonte da página: Fase 2 (font-family no body, que as peças herdam);
 * - destacar o especial da casa, que não tem regra: Fase 3 (regra nova).
 *
 * DIFERENÇAS DE PROPÓSITO EM RELAÇÃO À FLORICULTURA: o topo é uma class
 * (.topo), e não o header; a linha feia é uma borda (border-bottom), um
 * atalho que o painel mostra com as partes; e o especial é um parágrafo
 * com class, sem regra. Nada de copiar o caminho decorado.
 *
 * VALIDADORES: valorEfetivo em quase tudo (o resultado, por qualquer
 * caminho: painel, editor CSS ou regra nova); declaracao só na parte em que
 * o caminho é o conteúdo (desligar).
 *
 * ESTRELAS: 3, e cada "Rever" usado custa 1 (mínimo 1). Não há solução
 * pronta no desafio.
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { CAFE_CANTINHO_DO_GRAO } from "./sites/cafeCantinhoDoGrao";

export const FASE_E1_F4: FaseDesafio = {
  id: "sites-estilos-u1-f4",
  tipo: "desafio",
  unidadeId: "sites-estilos-u1",
  titulo: "Café Cantinho do Grão",
  conceitos: ["cor-hexadecimal", "tamanho-da-letra", "ligar-desligar-declaracao", "familia-da-fonte", "regra-nova", "cor-de-fundo"],
  revisa: [],
  prerequisitos: ["cor-hexadecimal", "tamanho-da-letra", "ligar-desligar-declaracao", "familia-da-fonte", "regra-nova", "cor-de-fundo"],
  usaFerramentas: [
    "painel",
    "previa",
    "me-ajuda",
    "tutor",
    "arvore",
    "inspecionar",
    "painel-estilos",
    "editar-valor-css",
    "ligar-desligar-declaracao",
    "setas-numericas",
    "seletor-de-cor",
    "nova-regra",
  ],
  paineisElementos: ["estilos"],
  siteAlvo: CAFE_CANTINHO_DO_GRAO,

  introducao: [
    {
      texto: "Hora do desafio! A dona do Café Cantinho do Grão quer um site com cara de cafeteria, e não de banco.",
      expressao: "feliz",
    },
    {
      texto: "Tudo pelo painel Estilos, sem mexer no HTML. O checklist marca cada parte sozinho quando você fizer.",
      expressao: "curioso",
    },
    {
      texto: "Travou? O botão Rever te leva para a fase onde aquilo foi ensinado. Bora passar um café?",
      expressao: "apontando",
    },
  ],

  partes: [
    {
      id: "topo-cafe",
      descricao: "Pintar o fundo do topo de marrom café: #6f4e37",
      validador: { tipo: "valorEfetivo", seletor: ".topo", propriedade: "background-color", valor: "#6f4e37" },
      revisarEm: "sites-estilos-u1-f3",
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".topo", propriedade: "background-color", valor: "#6f4e37" }],
    },
    {
      id: "titulo-grande",
      descricao: "Deixar o nome da cafeteria com 40px",
      validador: { tipo: "valorEfetivo", seletor: "h1", propriedade: "font-size", valor: "40px" },
      revisarEm: "sites-estilos-u1-f2",
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: "h1", propriedade: "font-size", valor: "40px" }],
    },
    {
      id: "sem-linha-vermelha",
      descricao: "Desligar a linha vermelha tracejada dos itens do cardápio",
      validador: { tipo: "declaracao", seletorRegra: ".item", propriedade: "border-bottom", ativa: false },
      revisarEm: "sites-estilos-u1-f1",
      solucaoDeTeste: [{ tipo: "alternarDeclaracao", seletorRegra: ".item", propriedade: "border-bottom" }],
    },
    {
      id: "fonte-georgia",
      descricao: "Trocar a fonte da página toda por Georgia, serif",
      validador: { tipo: "valorEfetivo", seletor: "body", propriedade: "font-family", valor: "Georgia, serif" },
      revisarEm: "sites-estilos-u1-f2",
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: "body", propriedade: "font-family", valor: "Georgia, serif" }],
    },
    {
      id: "especial-destacado",
      descricao: "Dar ao especial da casa um fundo amarelinho, #fff3cd, com uma regra nova",
      validador: { tipo: "valorEfetivo", seletor: ".especial", propriedade: "background-color", valor: "#fff3cd" },
      revisarEm: "sites-estilos-u1-f3",
      solucaoDeTeste: [
        { tipo: "selecionar", seletor: ".especial" },
        { tipo: "adicionarRegra", seletorRegra: "p.especial", declaracoes: [{ propriedade: "background-color", valor: "#fff3cd" }] },
      ],
    },
  ],

  conclusao: [
    {
      texto: "Desafio vencido! O Cantinho do Grão ganhou cara de cafeteria, e o HTML ficou intocado.",
      expressao: "comemorando",
    },
    {
      texto: "Cores, tamanhos, fonte, caixinha e regra nova: é o painel Styles do Chrome, e agora ele é seu.",
      expressao: "feliz",
    },
  ],
  missaoDeCampo:
    "Escolha o site de uma loja de verdade e, pelo F12, repagine só na sua tela: troque o fundo do topo, a fonte e o tamanho do título. Tire um print do antes e do depois.",
  falaFinal: { texto: "Zona Estilos começou com tudo! Na próxima unidade: seletores.", expressao: "feliz" },
};
