/*
 * S4, Fase 3: "Links que contam a história" (Doceria Mel & Cravo).
 *
 * O QUE ENSINA: o link rastreável (utm_source, utm_medium e utm_campaign
 * no fim do endereço), que diz à medição de onde a visita veio. Apresenta
 * o construtor de link rastreável da aba Medição. Ataca a confusão "UTM
 * muda a página": só o endereço muda, a página é a mesma.
 *
 * REVISA: o link e seu href (U4).
 *
 * ORDEM: 1) guiado, com previsão: montar o link do Instagram, pôr no link
 * da página e simular uma visita; 2) sozinho: o link do e-mail, com outra
 * origem e outro meio.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { DOCERIA_MEL_E_CRAVO } from "./sites/doceriaMelECravo";

const LINK_INSTAGRAM = "https://docesmelecravo.exemplo/?utm_source=instagram&utm_medium=social&utm_campaign=natal";
const LINK_EMAIL = "https://docesmelecravo.exemplo/?utm_source=email&utm_medium=email&utm_campaign=natal";

export const FASE_S4_F3: FasePratica = {
  id: "sites-ser-encontrado-u4-f3",
  tipo: "pratica",
  unidadeId: "sites-ser-encontrado-u4",
  titulo: "Links que contam a história",
  conceitos: ["link-rastreavel-utm"],
  revisa: ["link-href"],
  prerequisitos: ["link-href", "evento-de-medicao"],
  usaFerramentas: ["link-rastreavel", "medicao", "arvore", "editar-duplo-clique"],
  siteAlvo: DOCERIA_MEL_E_CRAVO,
  introducao: [
    { texto: "A Mel e Cravo divulga o mesmo endereço no Instagram e num e-mail de Natal. Quando alguém chega, não dá para saber de qual veio.", expressao: "pensativo" },
    { texto: "A saída é o link rastreável: o mesmo endereço, com três etiquetas no fim que dizem de onde a visita veio.", expressao: "curioso" },
  ],
  objetivos: [
    {
      id: "link-do-instagram",
      tipo: "previsao",
      modo: "guiado",
      apresentar: ["link-rastreavel"],
      previsao: {
        pergunta: "Colocar os utm no fim do link muda o que a pessoa vê na página?",
        opcoes: ["Não: serve só para a medição saber de onde a visita veio", "Sim: a página muda para cada origem", "Sim: a página fica mais rápida"],
        correta: 0,
        explicacao: "Os utm ficam no endereço e são lidos pela medição. A página é a mesma para todo mundo: só o link muda.",
      },
      enunciado: {
        mouse: "Monte o link (instagram, social, natal), ponha no link do Instagram e simule uma visita.",
        toque: "Monte o link (instagram, social, natal), ponha no link do Instagram e simule uma visita.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "linkRastreavel", seletor: "#link-insta", utm: { source: "instagram", medium: "social", campaign: "natal" } },
          { tipo: "evento", evento: "visitaSimulada" },
        ],
      },
      ajudas: {
        pergunta: "Como a medição vai saber que a visita veio do Instagram?",
        dica: "Pelos utm no fim do link. O construtor monta; selecione o link na árvore e use Pôr no link selecionado. Depois, simule a visita.",
        linha: { alvo: "ferramenta", ferramenta: "link-rastreavel", fala: "O construtor de link está aqui." },
        solucao: {
          fala: "Pus o link com os utm no link do Instagram e simulei uma visita: o relatório mostra de onde ela veio.",
          acoes: [
            { tipo: "definirAtributo", seletor: "#link-insta", nome: "href", valor: LINK_INSTAGRAM },
            { tipo: "simularVisita", utm: { source: "instagram", medium: "social", campaign: "natal" } },
          ],
        },
      },
      falaAoConcluir: { texto: "Agora dá para saber quantas visitas o Instagram trouxe, separadas das outras.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 0 },
        { tipo: "definirAtributo", seletor: "#link-insta", nome: "href", valor: LINK_INSTAGRAM },
        { tipo: "simularVisita", utm: { source: "instagram", medium: "social", campaign: "natal" } },
      ],
    },
    {
      id: "link-do-email",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Agora o link do e-mail: origem email, meio email e campanha natal. Ponha no link do e-mail e simule uma visita.",
        toque: "Agora o link do e-mail: origem email, meio email e campanha natal. Ponha no link do e-mail e simule uma visita.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "linkRastreavel", seletor: "#link-email", utm: { source: "email", medium: "email", campaign: "natal" } },
          { tipo: "evento", evento: "visitaSimulada" },
        ],
      },
      ajudas: {
        pergunta: "O que muda no link do e-mail, em relação ao do Instagram?",
        dica: "A origem (source) e o meio (medium) são outros. A campanha continua natal. Selecione o link do e-mail antes de pôr.",
      },
      falaAoConcluir: { texto: "Dois links, duas origens, uma campanha. Fez sozinho!", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "definirAtributo", seletor: "#link-email", nome: "href", valor: LINK_EMAIL },
        { tipo: "simularVisita", utm: { source: "email", medium: "email", campaign: "natal" } },
      ],
    },
  ],
  conclusao: [
    { texto: "utm_source diz de onde veio (instagram, email), utm_medium o tipo do canal (social, email) e utm_campaign qual divulgação (natal).", expressao: "feliz" },
    { texto: "Com os três, o relatório separa as visitas de cada divulgação. A página não muda: só o link.", expressao: "pensativo" },
  ],
  missaoDeCampo:
    "Escolha uma divulgação que você faria (um post, um e-mail, um cartaz com QR code) e escreva os três valores utm dela: source, medium e campaign. Use só minúsculas.",
  falaFinal: { texto: "Hora do desafio da unidade!", expressao: "comemorando" },
};
