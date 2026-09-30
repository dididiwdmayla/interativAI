/*
 * Demonstração do simulador de campanha: fase de LABORATÓRIO, fora do
 * currículo (só no /lab/fases?fase=lab-motor-u1-f7). Modelo para quem
 * escrever a S4 e a S5: mostra a aba Medição (evento medido, link
 * rastreável e visita simulada) e o simulador inteiro (o leilão, o dia
 * simulado e a página de destino decidindo o resultado).
 *
 * O caminho da lição: primeiro o jogador compra o 1º lugar subindo o lance
 * e vê que continua com poucos clientes; a previsão pergunta o que mais
 * ajuda; melhorar a página (título, descrição, alt, contraste) sobe a
 * qualidade e a conversão; no fim, com a página boa, dá para pagar MENOS
 * por clique e ter mais clientes com a mesma verba.
 *
 * Os números da campanha são fictícios (o painel diz isso). Os valores
 * dos validadores foram conferidos com o modelo de src/motor/campanha.ts
 * (testes/conteudo/campanha.test.ts mostra as contas).
 */
import type { DadosCampanha } from "@/motor/campanha";
import type { FaseSimuladorCampanha } from "../tipos";

export const CAMPANHA_DEMO: DadosCampanha = {
  anunciante: "Doces da Lu",
  palavras: [
    { id: "bolo-de-aniversario", texto: "bolo de aniversário", buscasPorDia: 2400, cpcMedio: 1.8, concorrencia: "alta" },
    { id: "doces-para-festa", texto: "doces para festa", buscasPorDia: 900, cpcMedio: 1.1, concorrencia: "media" },
    { id: "doceria-perto-de-mim", texto: "doceria perto de mim", buscasPorDia: 500, cpcMedio: 0.7, concorrencia: "baixa" },
  ],
  concorrentes: [
    { nome: "Confeitaria Mega", lance: 2.5, qualidade: 6 },
    { nome: "Bolos Express", lance: 1.6, qualidade: 8 },
    { nome: "Doce Sabor", lance: 2, qualidade: 5 },
  ],
  orcamentoInicial: 200,
  palavraInicial: "bolo-de-aniversario",
  lanceInicial: 1,
};

const LINK_INSTAGRAM = "https://docesdalu.motor.site/?utm_source=instagram&utm_medium=social&utm_campaign=aniversario";

/** O que deixa a página boa: título, descrição, alt e o contraste do rodapé. */
const MELHORAR_PAGINA = [
  {
    tipo: "inserirHTML" as const,
    seletor: "meta[name=viewport]",
    posicao: "depois" as const,
    html: '<title>Doces da Lu | Bolos de aniversário em Campinas</title>\n<meta name="description" content="Bolos de aniversário feitos por encomenda, com entrega em Campinas. Peça pelo WhatsApp e receba o orçamento na hora.">',
  },
  { tipo: "adicionarAtributo" as const, seletor: ".foto", nome: "alt", valor: "Bolo de aniversário com cobertura de morango" },
  { tipo: "adicionarAtributo" as const, seletor: ".rodape", nome: "style", valor: "color: #4a3a2a" },
];

export const FASE_DEMO_CAMPANHA: FaseSimuladorCampanha = {
  id: "lab-motor-u1-f7",
  tipo: "simulador-campanha",
  unidadeId: "lab-motor-u1",
  titulo: "Demonstração da campanha",
  conceitos: ["elemento"],
  revisa: [],
  prerequisitos: [],
  usaFerramentas: [
    "arvore",
    "editor",
    "editar-duplo-clique",
    "adicionar-atributo",
    "previa",
    "lighthouse",
    "resultado-busca",
    "medicao",
    "link-rastreavel",
    "simulador-campanha",
  ],
  apresentar: ["arvore", "editor", "editar-duplo-clique", "adicionar-atributo", "previa", "lighthouse", "resultado-busca", "medicao", "link-rastreavel", "simulador-campanha"],
  modoDocumento: true,
  introducao: [{ texto: "Demonstração: a doceria da Lu vai anunciar na busca. Primeiro, medir; depois, a campanha.", expressao: "curioso" }],
  siteAlvo: {
    url: "docesdalu.motor.site",
    titulo: "Demonstração da campanha",
    head: `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body { font-family: Verdana, sans-serif; margin: 0; padding: 16px; color: #3b2a1a; background: #fff6f0; }
  .foto { display: block; width: 100%; max-width: 320px; height: 120px; background: #f4b6c2; }
  .pedir { background: #2f8f5b; color: #ffffff; border: 0; border-radius: 999px; padding: 10px 16px; font-weight: bold; }
  .rodape { color: #e8d9cc; }
</style>`,
    body: `<main>
  <h1>Doces da Lu</h1>
  <p>Bolos de aniversário por encomenda, com entrega em Campinas.</p>
  <img class="foto" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">
  <p><a id="link-instagram" href="https://instagram.exemplo/docesdalu">Veja fotos no Instagram</a></p>
  <button class="pedir" type="button" data-evento="clique_whatsapp">Pedir pelo WhatsApp</button>
</main>
<footer class="rodape">Rua do Açúcar, 5. Encomendas com 2 dias.</footer>`,
  },
  campanha: CAMPANHA_DEMO,
  objetivos: [
    {
      id: "medir-whatsapp",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Na tela do site, clique em Pedir pelo WhatsApp e veja o evento chegar na aba Medição.",
        toque: "Na tela do site, toque em Pedir pelo WhatsApp e veja o evento chegar na aba Medição.",
      },
      apresentar: ["medicao"],
      validador: { tipo: "eventoMedido", nome: "clique_whatsapp" },
      ajudas: {
        pergunta: "Qual peça da página tem o data-evento?",
        dica: "O botão de pedir: cada clique nele vira um evento clique_whatsapp no relatório.",
        linha: { alvo: "arvore", seletor: "button[data-evento]", fala: "Este botão tem data-evento." },
        solucao: { fala: "Cliquei no botão: o relatório recebeu clique_whatsapp.", acoes: [{ tipo: "clicarNaPrevia", seletor: "button[data-evento]" }] },
      },
      falaAoConcluir: { texto: "Evento medido! Isso é uma conversão: alguém quis comprar.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "clicarNaPrevia", seletor: "button[data-evento]" }],
    },
    {
      id: "link-instagram",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Monte o link rastreável (instagram, social, aniversario), ponha no link do Instagram e simule uma visita.",
        toque: "Monte o link rastreável (instagram, social, aniversario), ponha no link do Instagram e simule uma visita.",
      },
      apresentar: ["link-rastreavel"],
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "linkRastreavel", seletor: "#link-instagram", utm: { source: "instagram", medium: "social", campaign: "aniversario" } },
          { tipo: "evento", evento: "visitaSimulada" },
        ],
      },
      ajudas: {
        pergunta: "Como a medição vai saber que a visita veio do Instagram?",
        dica: "Pelos utm no fim do link. O construtor monta; selecione o link na árvore e use Pôr no link selecionado.",
        linha: { alvo: "ferramenta", ferramenta: "link-rastreavel", fala: "O construtor está aqui." },
        solucao: {
          fala: "Pus o link com utm e simulei uma visita: o relatório mostra de onde ela veio.",
          acoes: [
            { tipo: "definirAtributo", seletor: "#link-instagram", nome: "href", valor: LINK_INSTAGRAM },
            { tipo: "simularVisita", utm: { source: "instagram", medium: "social", campaign: "aniversario" } },
          ],
        },
      },
      falaAoConcluir: { texto: "Agora dá para saber quantas visitas o Instagram trouxe.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "definirAtributo", seletor: "#link-instagram", nome: "href", valor: LINK_INSTAGRAM },
        { tipo: "simularVisita", utm: { source: "instagram", medium: "social", campaign: "aniversario" } },
      ],
    },
    {
      id: "primeiro-lugar",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Abra a aba Campanha e suba o lance até o anúncio ficar em primeiro no leilão.",
        toque: "Abra a aba Campanha e suba o lance até o anúncio ficar em primeiro no leilão.",
      },
      apresentar: ["simulador-campanha"],
      validador: { tipo: "simulacao", metrica: "posicao", op: "==", valor: 1 },
      ajudas: {
        pergunta: "No leilão, o que decide a posição: só o lance?",
        dica: "Lance vezes qualidade. Com a página fraca, a qualidade é baixa: precisa de um lance bem alto.",
        linha: { alvo: "ferramenta", ferramenta: "simulador-campanha", fala: "O lance fica aqui em cima." },
        solucao: { fala: "Subi o lance para 6 reais: primeiro lugar, pagando caro.", acoes: [{ tipo: "configurarCampanha", lance: 6 }] },
      },
      falaAoConcluir: { texto: "Primeiro lugar! Mas repare: quantos clientes vieram?", expressao: "pensativo" },
      solucaoDeTeste: [{ tipo: "configurarCampanha", lance: 6 }],
    },
    {
      id: "melhorar-pagina",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Primeiro lugar e poucos clientes. O que mais ajuda agora?",
        opcoes: ["Subir mais o lance", "Melhorar a página de destino", "Trocar a palavra-chave"],
        correta: 1,
        explicacao: "A página decide quantos cliques viram clientes, e a qualidade dela baixa o preço do clique. Lance maior só compra a mesma página fraca.",
      },
      enunciado: {
        mouse: "Melhore a página: title, meta description, alt na foto e contraste do rodapé, até a nota passar de 80.",
        toque: "Melhore a página: title, meta description, alt na foto e contraste do rodapé, até a nota passar de 80.",
      },
      validador: { tipo: "simulacao", metrica: "notaPagina", op: ">=", valor: 80 },
      ajudas: {
        pergunta: "O que o Lighthouse e o Resultado na busca apontam nesta página?",
        dica: "Falta título e descrição na busca, a foto não tem alt e o rodapé quase não se lê.",
        linha: { alvo: "ferramenta", ferramenta: "lighthouse", fala: "A lista do que consertar está aqui." },
        solucao: { fala: "Pus título, descrição, alt e um rodapé legível: a nota subiu.", acoes: MELHORAR_PAGINA },
      },
      falaAoConcluir: { texto: "Página melhor, conversão maior. Olha os clientes no dia simulado!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }, ...MELHORAR_PAGINA],
    },
    {
      id: "menos-lance-mais-clientes",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Agora baixe o lance: fique entre os dois primeiros, com 9 clientes ou mais e custo por cliente até 18 reais.",
        toque: "Agora baixe o lance: fique entre os dois primeiros, com 9 clientes ou mais e custo por cliente até 18 reais.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "simulacao", metrica: "posicao", op: "<=", valor: 2 },
          { tipo: "simulacao", metrica: "clientes", op: ">=", valor: 9 },
          { tipo: "simulacao", metrica: "custoPorCliente", op: "<=", valor: 18 },
        ],
      },
      ajudas: {
        pergunta: "Com a qualidade alta, quanto de lance ainda segura o segundo lugar?",
        dica: "Vá baixando o lance e olhe a posição e o custo por cliente a cada mudança.",
      },
      falaAoConcluir: { texto: "Menos por clique, mais clientes, mesma verba. É a página trabalhando.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "configurarCampanha", lance: 1.4 }],
    },
  ],
  conclusao: [{ texto: "Demonstração da campanha completa.", expressao: "feliz" }],
  falaFinal: { texto: "Pode continuar mexendo no lance e na página.", expressao: "feliz" },
};
