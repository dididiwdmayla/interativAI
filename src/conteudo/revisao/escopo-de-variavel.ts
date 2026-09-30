/*
 * Revisão: escopo de variável (E5, Fase 2).
 *
 * Ação: subir a variável do cartão para o :root para valer na página toda; previsão:
 * o que enxerga uma variável declarada numa peça só.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_ESCOPO_DE_VARIAVEL: ItemRevisao[] = [
  {
    id: "escopo-de-variavel-1",
    conceito: "escopo-de-variavel",
    tipo: "acao",
    enunciado: {
      mouse: "A --realce só existe dentro do .cartao. Declare a --realce: gold no :root para valer na página inteira.",
      toque: "A --realce só existe dentro do .cartao. Declare a --realce: gold no :root para valer na página inteira.",
    },
    siteAlvo: {
      url: "escolaartesmanuais.exemplo",
      titulo: "Escola Artes Manuais",
      head: HEAD_CSS,
      body: `<div class="cartao"><h3>Cerâmica</h3></div>
<p class="rodape">Inscrições abertas.</p>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.cartao {
  --realce: gold;
}

.cartao h3 {
  color: var(--realce, gray);
}

.rodape {
  color: var(--realce, gray);
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".rodape", propriedade: "color", valor: "gold" },
    ajudas: {
      pergunta: "Onde se declara uma variável para todas as peças da página enxergarem?",
      dica: "No :root. Crie uma regra :root com --realce: gold.",
    },
    solucaoDeTeste: [{ tipo: "adicionarRegra", seletorRegra: ":root", declaracoes: [{"propriedade":"--realce","valor":"gold"}] }],
  },
  {
    id: "escopo-de-variavel-2",
    conceito: "escopo-de-variavel",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando onde a variável é declarada.",
      toque: "Responda olhando onde a variável é declarada.",
    },
    siteAlvo: {
      url: "salaodeluz.exemplo",
      titulo: "Salão de Luz",
      head: HEAD_CSS,
      body: `<div class="vitrine"><p class="preco">R$ 40</p></div>
<p class="rodape">Estacionamento no local.</p>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.vitrine {
  --cor-preco: tomato;
}

.preco {
  color: var(--cor-preco, black);
}

.rodape {
  color: var(--cor-preco, black);
}
`,
    },
    previsao: {
      pergunta: "A --cor-preco está declarada só em .vitrine. De que cor fica o rodapé, que está fora dela?",
      opcoes: ["Tomato, a variável vale em tudo", "Preta: a reserva, pois ele não enxerga a variável", "Sem cor nenhuma"],
      correta: 1,
      explicacao: "Uma variável declarada numa peça só vale nela e em quem está dentro dela. O rodapé, de fora, usa a reserva.",
    },
    ajudas: {
      pergunta: "A variável do .vitrine vale fora do .vitrine?",
      dica: "Não: só dentro dele. Para valer em tudo, teria que estar no :root.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
