/*
 * Revisão: salvar como Meu tema (E5, Fase 3).
 *
 * O "Salvar como Meu tema" só existe na maquete do próprio jogo (SITE_ALVO_DO_JOGO), que
 * não cabe num item de revisão; os dois itens são previsões sobre o que ele faz.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_SALVAR_COMO_MEU_TEMA: ItemRevisao[] = [
  {
    id: "salvar-como-meu-tema-1",
    conceito: "salvar-como-meu-tema",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda pensando no Meu tema.",
      toque: "Responda pensando no Meu tema.",
    },
    siteAlvo: {
      url: "maquetedotema.exemplo",
      titulo: "Maquete do Tema",
      head: HEAD_CSS,
      body: '<p class="faixa">Minhas cores</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}
:root {
  --cor-fundo: #14213d;
  --cor-texto: #fca311;
}

.faixa {
  background-color: var(--cor-fundo);
  color: var(--cor-texto);
}
`,
    },
    previsao: {
      pergunta: "Você salva as cores como Meu tema. Onde elas passam a valer?",
      opcoes: ["No jogo inteiro, a partir de agora", "Só naquela fase", "Só na próxima vez que o jogo abrir"],
      correta: 0,
      explicacao: "Salvar como Meu tema guarda o conjunto de cores como um tema novo, que passa a valer no jogo inteiro.",
    },
    ajudas: {
      pergunta: "O Meu tema vale numa fase só ou no jogo todo?",
      dica: "No jogo todo, como qualquer outro tema.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
  {
    id: "salvar-como-meu-tema-2",
    conceito: "salvar-como-meu-tema",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda pensando no que acontece depois de salvar.",
      toque: "Responda pensando no que acontece depois de salvar.",
    },
    siteAlvo: {
      url: "ateliedasombra.exemplo",
      titulo: "Ateliê da Sombra",
      head: HEAD_CSS,
      body: '<p class="faixa">Tema salvo</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}
:root {
  --cor-fundo: #2b2d42;
  --cor-texto: #edf2f4;
}

.faixa {
  background-color: var(--cor-fundo);
  color: var(--cor-texto);
}
`,
    },
    previsao: {
      pergunta: "Depois de salvar, você quer mexer de novo nas cores do Meu tema. É possível?",
      opcoes: ["Não, fica para sempre", "Sim, dá para editar e apagar depois", "Só recomeçando o jogo"],
      correta: 1,
      explicacao: "O Meu tema se edita e se apaga depois na oficina Meu tema, e o jogo volta ao tema anterior se você apagar.",
    },
    ajudas: {
      pergunta: "O Meu tema é definitivo?",
      dica: "Não: existe a oficina para editar e apagar.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
