/*
 * Unidade 1, Desafio: "Lanchonete Sabor Rápido".
 *
 * O QUE PRATICA: as 4 habilidades da unidade juntas, num site NOVO (uma
 * lanchonete, não a padaria), sem passo a passo.
 *
 * COMO AS PARTES FORAM ESCOLHIDAS: uma parte por habilidade, cada uma
 * apontando (revisarEm) para a Fase 1, onde as quatro foram ensinadas com
 * ajuda completa (a Fase 2 é sozinha: teria menos ajuda para quem travou).
 * - selecionar o aviso de horário pela árvore;
 * - usar a setinha no botão Pedir agora;
 * - trocar o nome de um prato do cardápio;
 * - adicionar um prato novo pelo código.
 *
 * TRAVAMENTO DO CHECKLIST (regra da Etapa 1 do teste da fábrica): as
 * partes de seleção (árvore e setinha) TRAVAM ao marcar, porque
 * `selecionado` é um momento, não estado da página. As de texto e de
 * contagem são AVALIADAS AO VIVO: se o jogador desfizer a troca de nome ou
 * a inserção do prato novo, a parte correspondente desmarca.
 *
 * DIFERENÇAS EM RELAÇÃO À PADARIA: outro assunto (lanchonete), outra tag
 * para o aviso de horário (div solto, não article), outra lista
 * (ul.cardapio em vez de ul.produtos). Nada de copiar o caminho decorado.
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { SITE_LANCHONETE } from "./sites/lanchoneteSaborRapido";

export const FASE_U1_F3: FaseDesafio = {
  id: "sites-elementos-u1-f3",
  tipo: "desafio",
  unidadeId: "sites-elementos-u1",
  titulo: "Lanchonete Sabor Rápido",
  conceitos: ["selecionar-pela-arvore", "modo-inspecionar", "editar-texto", "codigo-html", "lista-e-itens"],
  revisa: [],
  prerequisitos: ["selecionar-pela-arvore", "modo-inspecionar", "editar-texto", "codigo-html", "lista-e-itens"],
  usaFerramentas: ["painel", "previa", "me-ajuda", "tutor", "arvore", "inspecionar", "editar-duplo-clique", "editor", "sincronia"],
  siteAlvo: SITE_LANCHONETE,

  introducao: [
    {
      texto: "Chegou o desafio! A Lanchonete Sabor Rápido quer o site atualizado, e ninguém mais por lá sabe programar.",
      expressao: "feliz",
    },
    {
      texto: "Sem passo a passo desta vez. O checklist marca cada parte sozinho quando você fizer.",
      expressao: "curioso",
    },
    {
      texto: "Travou? O botão Rever te leva de volta pra fase onde aquilo foi ensinado. Bora?",
      expressao: "apontando",
    },
  ],

  partes: [
    {
      id: "selecionar-aviso",
      descricao: "Selecionar pela árvore o aviso do horário de funcionamento",
      validador: { tipo: "selecionado", seletor: "#aviso", via: "arvore" },
      revisarEm: "sites-elementos-u1-f1",
      solucaoDeTeste: [{ tipo: "selecionar", seletor: "#aviso" }],
    },
    {
      id: "inspecionar-botao",
      descricao: "Usar a setinha do modo inspecionar no botão Pedir agora",
      validador: { tipo: "selecionado", seletor: ".botao", via: "inspecionar" },
      revisarEm: "sites-elementos-u1-f1",
      solucaoDeTeste: [{ tipo: "selecionar", seletor: ".botao", via: "inspecionar" }],
    },
    {
      id: "trocar-prato",
      descricao: "Trocar o nome de um prato do cardápio",
      validador: { tipo: "textoDiferenteDoInicial", seletor: ".cardapio li" },
      revisarEm: "sites-elementos-u1-f1",
      solucaoDeTeste: [{ tipo: "definirTexto", seletor: ".cardapio li", valor: "Wrap de frango" }],
    },
    {
      id: "novo-prato",
      descricao: "Adicionar um prato novo no cardápio, pelo código",
      validador: { tipo: "contagem", seletor: "ul.cardapio > li", op: ">", valor: 3, comTexto: true },
      revisarEm: "sites-elementos-u1-f1",
      solucaoDeTeste: [{ tipo: "inserirHTML", seletor: "ul.cardapio", posicao: "fim", html: "<li>Torta salgada</li>" }],
    },
  ],

  conclusao: [
    {
      texto: "Desafio vencido! Site novo, cardápio atualizado, e tudo sem passo a passo.",
      expressao: "comemorando",
    },
    {
      texto: "Árvore, setinha, texto e código: essas quatro abrem qualquer site que você quiser mexer.",
      expressao: "feliz",
    },
  ],

  missaoDeCampo:
    "Escolha um site de verdade, aperte F12, ache uma peça pela árvore e outra pela setinha, e troque um texto com dois cliques. Só você vê, e tudo volta quando recarregar.",

  falaFinal: {
    texto: "Lembra: no F12 a página é sua para explorar. Recarregou, voltou tudo. Pode mexer sem medo!",
    expressao: "comemorando",
  },
};
