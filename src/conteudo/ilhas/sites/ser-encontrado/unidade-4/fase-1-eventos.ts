/*
 * S4, Fase 1: "O que as pessoas fazem no site" (Buffet Festa Certa).
 *
 * O QUE ENSINA: medir o que acontece no site: o evento (o registro de que
 * algo aconteceu, com um nome), a conversão (uma ação importante depois do
 * clique: compra, ligação, cadastro) e, como conceito, o Analytics (o
 * programa de análise que junta os eventos). Apresenta a aba Medição. O
 * site-alvo não roda JavaScript: o data-evento simula o código de medição
 * (que vem na ilha Páginas vivas), e a tela diz isso.
 *
 * REVISA: adicionar atributo (U6). Ataca a confusão "visita é cliente".
 *
 * ORDEM: 1) guiado, com previsão (visita não é cliente), o clique no
 * botão que já é medido; 2) guiado, dar o data-evento ao botão de enviar
 * o pedido (a conversão); 3) sozinho, medir o link de ligar.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { BUFFET_FESTA_CERTA } from "./sites/buffetFestaCerta";

export const FASE_S4_F1: FasePratica = {
  id: "sites-ser-encontrado-u4-f1",
  tipo: "pratica",
  unidadeId: "sites-ser-encontrado-u4",
  titulo: "O que as pessoas fazem no site",
  conceitos: ["analytics", "evento-de-medicao", "conversao"],
  revisa: ["editar-atributo"],
  prerequisitos: ["editar-atributo", "link-href"],
  usaFerramentas: ["medicao", "arvore", "adicionar-atributo"],
  siteAlvo: BUFFET_FESTA_CERTA,
  introducao: [
    { texto: "Uma página pode ter mil visitas e nenhum cliente. Para saber o que as pessoas fazem nela, existe a medição.", expressao: "pensativo" },
    { texto: "Programas de análise, como o Analytics, contam as visitas e mostram o que as pessoas fazem no site. Aqui a aba Medição simula isso.", expressao: "curioso" },
    { texto: "É uma simulação aproximada: o site do jogo ainda não roda JavaScript. O código de medição de verdade vem na ilha Páginas vivas.", expressao: "apontando" },
  ],
  objetivos: [
    {
      id: "medir-whatsapp",
      tipo: "previsao",
      modo: "guiado",
      apresentar: ["medicao"],
      previsao: {
        pergunta: "O buffet teve 100 visitas no mês. Isso quer dizer 100 clientes?",
        opcoes: ["Sim: toda visita vira cliente", "Não: visita é só alguém que abriu a página", "Só se a pessoa ficar mais de um minuto"],
        correta: 1,
        explicacao: "Visita é só alguém que abriu a página. Cliente é quem faz uma ação importante depois, como pedir um orçamento: essa ação é a conversão.",
      },
      enunciado: {
        mouse: "Na tela do site, clique em Pedir orçamento pelo WhatsApp e veja o evento chegar na aba Medição.",
        toque: "Na tela do site, toque em Pedir orçamento pelo WhatsApp e veja o evento chegar na aba Medição.",
      },
      validador: { tipo: "eventoMedido", nome: "clique_whatsapp" },
      ajudas: {
        pergunta: "Qual peça da página conta um clique quando alguém toca nela?",
        dica: "O botão tem um data-evento: cada clique nele vira um evento com esse nome no relatório.",
        linha: { alvo: "arvore", seletor: "#pedir-whatsapp", fala: "Este botão tem data-evento: ele é medido." },
        solucao: {
          fala: "Cliquei no botão do WhatsApp: o relatório recebeu o evento clique_whatsapp.",
          acoes: [{ tipo: "clicarNaPrevia", seletor: "#pedir-whatsapp" }],
        },
      },
      falaAoConcluir: { texto: "Evento medido! Um evento é o registro de que algo aconteceu no site, com um nome. Aqui, clique_whatsapp.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "clicarNaPrevia", seletor: "#pedir-whatsapp" },
      ],
    },
    {
      id: "medir-pedido",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "O botão Enviar pedido de festa não é medido. Dê a ele o data-evento pedido_enviado e clique nele.",
        toque: "O botão Enviar pedido de festa não é medido. Dê a ele o data-evento pedido_enviado e toque nele.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "atributo", seletor: "#enviar-pedido", nome: "data-evento", valor: "pedido_enviado" },
          { tipo: "eventoMedido", nome: "pedido_enviado" },
        ],
      },
      ajudas: {
        pergunta: "Como o botão do WhatsApp avisa a medição? O que ele tem que este não tem?",
        dica: "É o atributo data-evento, com um nome em minúsculas (pode ter números e _). Adicione ao botão e depois clique nele na prévia.",
        linha: { alvo: "arvore", seletor: "#enviar-pedido", fala: "Este botão não tem data-evento. Adicione um, com o nome pedido_enviado." },
        solucao: {
          fala: "Pus data-evento=pedido_enviado no botão e cliquei: o relatório recebeu o evento.",
          acoes: [
            { tipo: "adicionarAtributo", seletor: "#enviar-pedido", nome: "data-evento", valor: "pedido_enviado" },
            { tipo: "clicarNaPrevia", seletor: "#enviar-pedido" },
          ],
        },
      },
      falaAoConcluir: {
        texto: "Pedido enviado é uma conversão: uma ação importante depois do clique, como compra, ligação ou cadastro. Agora dá para contar.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "adicionarAtributo", seletor: "#enviar-pedido", nome: "data-evento", valor: "pedido_enviado" },
        { tipo: "clicarNaPrevia", seletor: "#enviar-pedido" },
      ],
    },
    {
      id: "medir-ligacao",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Meça também o link Ligar agora: dê a ele um data-evento chamado clique_ligar e clique nele na prévia.",
        toque: "Meça também o link Ligar agora: dê a ele um data-evento chamado clique_ligar e toque nele na prévia.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "atributo", seletor: "#ligar", nome: "data-evento", valor: "clique_ligar" },
          { tipo: "eventoMedido", nome: "clique_ligar" },
        ],
      },
      ajudas: {
        pergunta: "O que o link precisa ter para a medição contar os toques nele?",
        dica: "Um atributo data-evento com o nome clique_ligar. Depois, um clique nele na prévia para o evento chegar.",
      },
      falaAoConcluir: { texto: "Ligação medida! Fez sozinho.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "adicionarAtributo", seletor: "#ligar", nome: "data-evento", valor: "clique_ligar" },
        { tipo: "clicarNaPrevia", seletor: "#ligar" },
      ],
    },
  ],
  conclusao: [
    { texto: "Conversão é uma ação importante depois do clique. O que importa não é a visita, e sim quantas viram pedido, ligação ou cadastro.", expressao: "feliz" },
    { texto: "Na vida real, um programa de análise, como o Analytics, junta os eventos. O código dele é JavaScript, da ilha Páginas vivas.", expressao: "pensativo" },
  ],
  missaoDeCampo:
    "Abra um site com botão de pedir ou de comprar e pense: qual clique dele seria a conversão? Que nome de evento você daria (minúsculas, com _)? Aperte F12 e olhe o botão na aba Elementos.",
  falaFinal: { texto: "Próxima fase: o que a busca vê do seu site.", expressao: "feliz" },
};
