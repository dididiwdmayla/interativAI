/*
 * Revisão: Search Console (S4, Fase 2).
 *
 * Só previsões: o Search Console é uma ferramenta externa do Google (o jogo
 * não a simula), então não há gesto real para uma ação. As perguntas cobrem
 * o que ele mostra e o que os dois tipos de propriedade permitem (conferido
 * em 30/09/2026, ver plataformas-marketing.ts).
 */
import type { ItemRevisao } from "../tipos";

export const ITENS_SEARCH_CONSOLE: ItemRevisao[] = [
  {
    id: "search-console-1",
    conceito: "search-console",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "cafedopatio.exemplo",
      titulo: "Café do Pátio",
      body: `<h1>Café do Pátio</h1>
<p>Café e bolo em Petrópolis.</p>`,
    },
    previsao: {
      pergunta: "O dono do Café do Pátio quer ver os cliques que a busca trouxe e se há página fora da busca. Onde olhar?",
      opcoes: [
        "Nas redes sociais dele",
        "No Search Console, a ferramenta gratuita do Google",
        "No perfil de um concorrente",
      ],
      correta: 1,
      explicacao: "O Search Console mostra como o site aparece na busca: pesquisas, cliques e problemas de indexação.",
    },
    ajudas: {
      pergunta: "Quem pode mostrar como o site aparece na busca é o próprio Google?",
      dica: "É uma ferramenta gratuita do Google para donos de site.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
  {
    id: "search-console-2",
    conceito: "search-console",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "cursodeviolao.exemplo",
      titulo: "Curso de Violão",
      body: `<h1>Curso de Violão</h1>
<p>Aulas online e presenciais.</p>`,
    },
    previsao: {
      pergunta: "Para cobrir o domínio inteiro (exemplo.com, com todos os subdomínios), a propriedade só verifica por qual método?",
      opcoes: ["Registro DNS", "Arquivo HTML no site", "Tag HTML no head"],
      correta: 0,
      explicacao: "A propriedade de domínio cobre subdomínios e protocolos e só pode ser verificada por registro DNS. A de prefixo de URL tem mais jeitos.",
    },
    ajudas: {
      pergunta: "Qual tipo de propriedade cobre o domínio inteiro?",
      dica: "É a propriedade de domínio, e ela tem um único jeito de verificar.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
