/*
 * P1, Fase 1: "A aba Lighthouse" (Clínica Sorriso Novo).
 *
 * O QUE ENSINA: a aba Lighthouse (docs/GUIA-DE-CONTEUDO.md, seção 17):
 * Analisar, ler a nota de Acessibilidade e abrir um problema. Primeira
 * vez de verdade (a P2 só REVISA a partir de agora: ver a nota no topo
 * de `fase-1-arquivos.ts`, atualizada junto com esta unidade).
 *
 * ORDEM: 1) guiado, Analisar e ver as notas; 2) guiado, previsão sobre o
 * que uma nota baixa quer dizer, depois consertar a imagem sem alt (já
 * conhecido da U4); 3) sozinho, analisar de novo e ver a nota subir.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { CLINICA_SORRISO_NOVO } from "./sites/clinicaSorrisoNovo";

export const FASE_P1_F1: FasePratica = {
  id: "sites-publicar-u1-f1",
  tipo: "pratica",
  unidadeId: "sites-publicar-u1",
  titulo: "A aba Lighthouse",
  conceitos: ["auditoria-lighthouse"],
  revisa: ["imagem-alt"],
  prerequisitos: ["imagem-alt"],
  usaFerramentas: ["lighthouse", "arvore", "editor", "adicionar-atributo"],
  siteAlvo: CLINICA_SORRISO_NOVO,
  introducao: [
    { texto: "Última zona da Ilha Sites! Antes de qualquer site sair pro mundo, vale conferir ele com o Lighthouse.", expressao: "feliz" },
    { texto: "É a aba que dá notas de Acessibilidade, Boas práticas e SEO, e explica cada problema em linguagem simples.", expressao: "curioso" },
  ],
  objetivos: [
    {
      id: "analisar",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Abra a aba Lighthouse (lá em cima, a última) e clique em Analisar.",
        toque: "Abra a aba Lighthouse (lá em cima, a última) e toque em Analisar.",
      },
      apresentar: ["lighthouse"],
      validador: { tipo: "evento", evento: "auditou" },
      ajudas: {
        pergunta: "Qual aba do painel dá notas para a página?",
        dica: "A última aba de cima, Lighthouse. Lá dentro tem o botão Analisar.",
        linha: { alvo: "ferramenta", ferramenta: "lighthouse", fala: "Esta aba: clique nela e depois em Analisar." },
        solucao: { fala: "Rodei a análise: apareceram três notas, uma por categoria.", acoes: [{ tipo: "analisarAuditoria" }] },
      },
      falaAoConcluir: { texto: "A nota de Acessibilidade está baixa: a Clínica Sorriso Novo tem problema para quem usa leitor de tela.", expressao: "pensativo" },
      solucaoDeTeste: [{ tipo: "analisarAuditoria" }],
    },
    {
      id: "previsao-alt",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "A foto do consultório não tem alt. O que um leitor de tela faz com uma imagem sem alt?",
        opcoes: ["Pula ela, sem avisar nada", "Lê só \"imagem\", sem dizer o que é", "Descreve a imagem sozinho, usando inteligência artificial"],
        correta: 1,
        explicacao: 'Sem alt, o leitor de tela só anuncia "imagem" (ou o nome do arquivo): quem ouve não sabe o que está vendo.',
      },
      enunciado: {
        mouse: "Confira: selecione a foto na árvore e acrescente um alt descrevendo ela.",
        toque: "Confira: selecione a foto na árvore e acrescente um alt descrevendo ela.",
      },
      validador: { tipo: "semProblema", regra: "imagem-sem-alt" },
      ajudas: {
        pergunta: "Qual atributo da imagem descreve ela para quem não a vê?",
        dica: "O alt. Selecione a imagem na árvore e acrescente o atributo alt com uma descrição curta.",
        linha: { alvo: "arvore", seletor: ".foto-consultorio", fala: "Selecione esta imagem." },
        solucao: {
          fala: 'Acrescentei alt="Sala de atendimento da clínica, com a cadeira odontológica" na imagem.',
          acoes: [{ tipo: "adicionarAtributo", seletor: ".foto-consultorio", nome: "alt", valor: "Sala de atendimento da clínica, com a cadeira odontológica" }],
        },
      },
      falaAoConcluir: { texto: "Descrição no lugar! É o mesmo alt que você já usava na zona Elementos, só que agora com o Lighthouse cobrando.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "adicionarAtributo", seletor: ".foto-consultorio", nome: "alt", valor: "Sala de atendimento da clínica, com a cadeira odontológica" },
      ],
    },
    {
      id: "analisar-de-novo",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Analise de novo e confira que a nota de Acessibilidade melhorou.",
        toque: "Analise de novo e confira que a nota de Acessibilidade melhorou.",
      },
      validador: { tipo: "todos", validadores: [{ tipo: "evento", evento: "auditou" }, { tipo: "notaAuditoria", categoria: "acessibilidade", minimo: 60 }] },
      ajudas: {
        pergunta: "A análise já sabe do alt novo sozinha, ou precisa rodar de novo?",
        dica: "Clique em Analisar de novo: a nota é sempre da página como ela está agora.",
      },
      falaAoConcluir: { texto: "A nota subiu! Um problema consertado, uma nota melhor — é assim, um de cada vez.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "analisarAuditoria" }],
    },
  ],
  conclusao: [
    { texto: "Você já sabe abrir o Lighthouse, ler as notas e consertar o primeiro tipo de problema.", expressao: "comemorando" },
    { texto: "Tem mais três tipos de problema comuns de acessibilidade. Vamos consertar todos?", expressao: "curioso" },
  ],
  missaoDeCampo: "No F12 de um site de verdade, abra a aba Lighthouse (no Chrome de verdade) e rode uma análise de Acessibilidade.",
  falaFinal: { texto: "Próxima fase: título pulando nível, pouco contraste e botão sem texto.", expressao: "feliz" },
};
