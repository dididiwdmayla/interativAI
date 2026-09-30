/*
 * Revisão: rótulo acessível (P1, Fase 2).
 *
 * Ação: dar nome a um botão só de ícone com aria-label; previsão: o que o leitor de
 * tela lê sem o rótulo.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_ROTULO_ACESSIVEL: ItemRevisao[] = [
  {
    id: "rotulo-acessivel-1",
    conceito: "rotulo-acessivel",
    tipo: "acao",
    enunciado: {
      mouse: "O botão de fechar é só um ícone e o leitor de tela não sabe o que ele faz. Dê a ele aria-label='Fechar'.",
      toque: "O botão de fechar é só um ícone e o leitor de tela não sabe o que ele faz. Dê a ele aria-label='Fechar'.",
    },
    siteAlvo: {
      url: "clubedojardim.exemplo",
      titulo: "Clube do Jardim",
      head: HEAD_CSS,
      body: `<main>
  <h1>Clube do Jardim</h1>
  <button id="fechar" class="botao"></button>
</main>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.botao {
  width: 32px;
  height: 32px;
  border: 2px solid #444;
  background-color: white;
}
`,
    },
    validador: { tipo: "atributo", seletor: "#fechar", nome: "aria-label", valor: "Fechar" },
    ajudas: {
      pergunta: "O que diz o que um botão de ícone faz para quem usa leitor de tela?",
      dica: "Um aria-label. Use Adicionar atributo, no menu do nó do botão: aria-label = Fechar.",
    },
    solucaoDeTeste: [{ tipo: "adicionarAtributo", seletor: "#fechar", nome: "aria-label", valor: "Fechar" }],
  },
  {
    id: "rotulo-acessivel-2",
    conceito: "rotulo-acessivel",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda pensando em quem usa leitor de tela.",
      toque: "Responda pensando em quem usa leitor de tela.",
    },
    siteAlvo: {
      url: "empresadeviagem.exemplo",
      titulo: "Viagem Fácil",
      head: HEAD_CSS,
      body: `<main>
  <h1>Viagem Fácil</h1>
  <a href="ofertas.html"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%232a9d8f'/%3E%3C/svg%3E" alt=""></a>
</main>`,
    },
    previsao: {
      pergunta: "O link só tem uma imagem, sem alt e sem aria-label. O que o leitor de tela lê?",
      opcoes: ["Nada útil: falta o nome do link", "Ofertas, pelo endereço", "A cor da imagem"],
      correta: 0,
      explicacao: "Sem texto visível nem rótulo, o leitor de tela não sabe o que o link faz. O aria-label (ou um texto) dá o nome.",
    },
    ajudas: {
      pergunta: "Um link só de ícone precisa de quê para ter nome?",
      dica: "Do texto visível ou de um aria-label.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
