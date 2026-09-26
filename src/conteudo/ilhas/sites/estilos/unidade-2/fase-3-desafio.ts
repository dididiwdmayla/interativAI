/*
 * E2, Desafio: "Mercadinho Preço Bom".
 *
 * O QUE PRATICA: os quatro seletores da unidade juntos, sem passo a passo,
 * num site NOVO (um mercadinho, não a livraria). A meta mostra o antes e o
 * depois (o depois sai das soluções das partes).
 *
 * COMO AS PARTES FORAM ESCOLHIDAS: uma por seletor, cada uma apontando
 * (revisarEm) pra fase onde ele foi ensinado guiado:
 * - fundo de todos os produtos em promoção: seletor de CLASSE (.promocao),
 *   Fase 1;
 * - título da oferta relâmpago em vermelho: ID + DESCENDENTE juntos
 *   (#oferta-relampago h3), Fase 2;
 * - preços maiores só dentro da seção de ofertas (não o aviso solto):
 *   DESCENDENTE (#ofertas .preco), Fase 2;
 * - todos os títulos em negrito: seletor de TAG (h3), Fase 1;
 * - o aviso solto (fora da seção, com a mesma class .preco dos produtos)
 *   em cinza: DESCENDENTE de novo (.chamada .preco), Fase 2, pra reforçar
 *   que a mesma class em lugares diferentes pode ganhar tratamentos
 *   diferentes.
 *
 * VALIDADORES: valorEfetivo em tudo (o resultado, por qualquer caminho:
 * painel, editor CSS ou regra nova); a parte dos preços da seção usa `nao`
 * pra garantir que o aviso solto NÃO cresceu junto (a armadilha do
 * seletor errado).
 *
 * SELETORES COMPOSTOS SÃO PELA ABA CSS: o + do painel só sugere o seletor
 * da peça SELECIONADA (tag e classes dela); um seletor com duas peças
 * (#oferta-relampago h3, #ofertas .preco, .chamada .preco) não tem como
 * sair do +, então essas soluções escrevem direto na folha, como a Fase 2
 * já ensinou.
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { MERCADINHO_PRECO_BOM } from "./sites/mercadinhoPrecoBom";

export const FASE_E2_F3: FaseDesafio = {
  id: "sites-estilos-u2-f3",
  tipo: "desafio",
  unidadeId: "sites-estilos-u2",
  titulo: "Mercadinho Preço Bom",
  conceitos: ["seletor-de-tag", "seletor-de-classe", "seletor-de-id", "seletor-descendente"],
  revisa: [],
  prerequisitos: ["seletor-de-tag", "seletor-de-classe", "seletor-de-id", "seletor-descendente"],
  usaFerramentas: ["painel", "previa", "me-ajuda", "tutor", "arvore", "inspecionar", "painel-estilos", "editar-valor-css", "nova-regra", "editor-css"],
  paineisElementos: ["estilos"],
  siteAlvo: MERCADINHO_PRECO_BOM,

  introducao: [
    { texto: "Hora do desafio! O Mercadinho Preço Bom quer destacar as ofertas, sem bagunçar o resto da página.", expressao: "feliz" },
    { texto: "Você escolhe o seletor certo pra cada job: tag, classe, id ou descendente. Sem passo a passo.", expressao: "curioso" },
    { texto: "Travou? O Rever te leva pra fase onde aquele seletor foi ensinado. Bora ajudar o mercadinho?", expressao: "apontando" },
  ],

  partes: [
    {
      id: "fundo-promocao",
      descricao: "Pintar de amarelinho (#fff3cd) o fundo de todos os produtos em promoção",
      validador: { tipo: "valorEfetivo", seletor: ".promocao", propriedade: "background-color", valor: "#fff3cd" },
      revisarEm: "sites-estilos-u2-f1",
      solucaoDeTeste: [
        { tipo: "selecionar", seletor: ".promocao" },
        { tipo: "adicionarRegra", seletorRegra: ".promocao", declaracoes: [{ propriedade: "background-color", valor: "#fff3cd" }] },
      ],
    },
    {
      id: "titulo-oferta-relampago",
      descricao: "Deixar o título da oferta relâmpago (só ela) vermelho: crimson",
      validador: { tipo: "valorEfetivo", seletor: "#oferta-relampago h3", propriedade: "color", valor: "crimson" },
      revisarEm: "sites-estilos-u2-f2",
      solucaoDeTeste: [{ tipo: "editarCss", posicao: "fim", texto: "#oferta-relampago h3 { color: crimson; }" }],
    },
    {
      id: "precos-maiores-nas-ofertas",
      descricao: "Aumentar pra 18px só os preços de dentro da seção de ofertas, sem mexer no aviso solto",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "valorEfetivo", seletor: "#ofertas .preco", propriedade: "font-size", valor: "18px" },
          { tipo: "nao", validador: { tipo: "valorEfetivo", seletor: ".chamada .preco", propriedade: "font-size", valor: "18px" } },
        ],
      },
      revisarEm: "sites-estilos-u2-f2",
      solucaoDeTeste: [{ tipo: "editarCss", posicao: "fim", texto: "#ofertas .preco { font-size: 18px; }" }],
    },
    {
      id: "titulos-maiusculos",
      descricao: "Deixar todos os títulos de produto (h3) em caixa alta",
      validador: { tipo: "valorEfetivo", seletor: "h3", propriedade: "text-transform", valor: "uppercase" },
      revisarEm: "sites-estilos-u2-f1",
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: "h3", propriedade: "text-transform", valor: "uppercase" }],
    },
    {
      id: "aviso-solto-cinza",
      descricao: "Deixar o aviso solto (fora da seção de ofertas) cinza: #888888",
      validador: { tipo: "valorEfetivo", seletor: ".chamada .preco", propriedade: "color", valor: "#888888" },
      revisarEm: "sites-estilos-u2-f2",
      solucaoDeTeste: [{ tipo: "editarCss", posicao: "fim", texto: ".chamada .preco { color: #888888; }" }],
    },
  ],

  conclusao: [
    { texto: "Desafio vencido! As ofertas se destacam, e o resto da página ficou exatamente como estava.", expressao: "comemorando" },
    { texto: "Tag, classe, id e descendente: agora você escolhe o seletor certo pra cada job.", expressao: "feliz" },
  ],

  missaoDeCampo:
    "Num site de verdade, pelo F12, ache uma regra de cada tipo: uma de tag, uma de classe, uma de id (se tiver) e uma descendente (com espaço).",

  falaFinal: { texto: "Zona Estilos, dois de quatro! Na próxima: o modelo de caixa.", expressao: "feliz" },
};
