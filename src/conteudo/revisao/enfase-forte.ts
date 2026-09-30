/*
 * Revisão: ênfase forte, strong (U3, Fase 2).
 *
 * Ação: trocar o b (só negrito) pelo strong (importante de verdade) num aviso de
 * viagem. Previsão: o que muda para quem usa leitor de tela.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_ENFASE_FORTE: ItemRevisao[] = [
  {
    id: "enfase-forte-1",
    conceito: "enfase-forte",
    tipo: "acao",
    enunciado: {
      mouse: "O aviso está em negrito com b, mas é importante de verdade. Troque a tag dele para strong.",
      toque: "O aviso está em negrito com b, mas é importante de verdade. Troque a tag dele para strong.",
    },
    siteAlvo: {
      url: "agenciaventosul.exemplo",
      titulo: "Agência Vento Sul",
      head: HEAD_MINI,
      body: `<h2>Embarque em Foz do Iguaçu</h2>
<p>Chegue com uma hora de antecedência e leve <b id="aviso">documento com foto</b>.</p>`,
    },
    validador: { tipo: "tag", seletor: "#aviso", nome: "strong" },
    ajudas: {
      pergunta: "Qual tag diz que aquele trecho é importante de verdade, e não só deixa em negrito?",
      dica: "strong: importante de verdade. O b só muda o visual. Dois cliques no nome da tag e troque.",
    },
    solucaoDeTeste: [{ tipo: "renomearTag", seletor: "#aviso", novaTag: "strong" }],
  },
  {
    id: "enfase-forte-2",
    conceito: "enfase-forte",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda e confira o aviso na página.",
      toque: "Responda e confira o aviso na página.",
    },
    siteAlvo: {
      url: "clinicavidaplena.exemplo",
      titulo: "Clínica Vida Plena",
      head: HEAD_MINI_ESCURO,
      body: `<h2>Antes do exame</h2>
<p>Fique em <strong>jejum de 8 horas</strong>. Beba água à vontade.</p>`,
    },
    previsao: {
      pergunta: "Um leitor de tela lê este texto. O que o strong faz de diferente do b?",
      opcoes: ["Deixa a letra maior", "Não muda nada para ninguém", "Avisa que o trecho é importante"],
      correta: 2,
      explicacao: "O strong tem significado: diz que o trecho é importante, e o leitor de tela pode falar diferente. O b só deixa em negrito.",
    },
    ajudas: {
      pergunta: "O strong é só visual ou também diz alguma coisa?",
      dica: "Ele diz ao navegador e ao leitor de tela que o trecho é importante. Só o b é puro visual.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
