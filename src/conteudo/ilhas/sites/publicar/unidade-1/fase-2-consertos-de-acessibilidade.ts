/*
 * P1, Fase 2: "Título pulando nível, contraste e botão sem texto" (Loja
 * Estação Moda).
 *
 * O QUE ENSINA: três verificações novas do Lighthouse, cada uma com um
 * conserto que usa uma ferramenta já conhecida (renomear tag, editar
 * valor de CSS, adicionar atributo): a ordem dos títulos (revisa a
 * hierarquia da U3), o contraste mínimo de 4,5:1 (revisa a E5, que já
 * apresentou a ideia de contraste no Meu tema) e o rótulo acessível de
 * um link.
 *
 * ORDEM: 1) guiado, título pulando de h1 para h3 (renomear para h2); 2)
 * guiado, previsão sobre o mínimo de contraste, depois escurecer um
 * texto claro demais; 3) sozinho, um link de ícone sem nenhum texto
 * ganha um aria-label.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { LOJA_ESTACAO_MODA } from "./sites/lojaEstacaoModa";

export const FASE_P1_F2: FasePratica = {
  id: "sites-publicar-u1-f2",
  tipo: "pratica",
  unidadeId: "sites-publicar-u1",
  titulo: "Título, contraste e rótulo",
  conceitos: ["rotulo-acessivel"],
  revisa: ["titulos-hierarquia", "contraste-de-cor"],
  prerequisitos: ["auditoria-lighthouse", "titulos-hierarquia"],
  usaFerramentas: ["lighthouse", "arvore", "painel-estilos", "editar-valor-css", "renomear-tag", "adicionar-atributo"],
  paineisElementos: ["estilos"],
  siteAlvo: LOJA_ESTACAO_MODA,
  introducao: [
    { texto: "A Estação Moda tem três problemas diferentes de acessibilidade. Vamos analisar e ver todos.", expressao: "curioso" },
  ],
  objetivos: [
    {
      id: "ordem-dos-titulos",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "O título \"Coleção de inverno\" é um h3, logo depois do h1 (pulou o h2). Renomeie ele para h2.",
        toque: "O título \"Coleção de inverno\" é um h3, logo depois do h1 (pulou o h2). Renomeie ele para h2.",
      },
      validador: { tipo: "semProblema", regra: "titulos-pulando-nivel" },
      ajudas: {
        pergunta: "Qual gesto troca o nome de uma tag, sem apagar o que está dentro dela?",
        dica: "Dois cliques no nome da tag, na árvore (a mesma ferramenta de renomear tag da zona Elementos).",
        linha: { alvo: "arvore", seletor: "h3", fala: "É este título." },
        solucao: { fala: "Renomeei h3 para h2: agora a sequência é h1, h2, sem pular nível.", acoes: [{ tipo: "renomearTag", seletor: "h3", novaTag: "h2" }] },
      },
      falaAoConcluir: { texto: "Sem pular nível! Quem navega só pelos títulos (leitor de tela) entende a estrutura certinha.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "renomearTag", seletor: "h3", novaTag: "h2" }],
    },
    {
      id: "previsao-contraste",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "O aviso de frete grátis está com um roxo clarinho, quase sumindo no fundo escuro. Qual é o contraste mínimo que o Lighthouse pede para texto comum?",
        opcoes: ["Não tem mínimo, é só estética", "4,5 para 1", "Qualquer cor diferente já serve"],
        correta: 1,
        explicacao: "4,5:1 é o mínimo do WCAG para texto comum (3:1 para texto bem grande). Abaixo disso, quem enxerga pouco (ou está no sol) não consegue ler.",
      },
      enunciado: {
        mouse: "Confira: escureça a cor do aviso (.frete-gratis) até passar do mínimo.",
        toque: "Confira: escureça a cor do aviso (.frete-gratis) até passar do mínimo.",
      },
      validador: { tipo: "semProblema", regra: "contraste" },
      ajudas: {
        pergunta: "Qual declaração da regra .frete-gratis está com pouco contraste?",
        dica: "color, no painel Estilos. Troque por um tom bem mais escuro (ou branco), até passar de 4,5:1.",
        linha: { alvo: "estilos", seletorRegra: ".frete-gratis", propriedade: "color", fala: "É esta declaração." },
        solucao: { fala: "Troquei color de .frete-gratis para white: contraste alto contra o roxo escuro.", acoes: [{ tipo: "definirPropriedade", seletorRegra: ".frete-gratis", propriedade: "color", valor: "white" }] },
      },
      falaAoConcluir: { texto: "Agora dá para ler de longe, no sol, com qualquer visão. Contraste é acessibilidade pura.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "definirPropriedade", seletorRegra: ".frete-gratis", propriedade: "color", valor: "white" },
      ],
    },
    {
      id: "rotulo-do-link",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "O link do Instagram só tem um ícone, sem texto nenhum. Acrescente um aria-label descrevendo para onde ele leva.",
        toque: "O link do Instagram só tem um ícone, sem texto nenhum. Acrescente um aria-label descrevendo para onde ele leva.",
      },
      validador: { tipo: "semProblema", regra: "link-sem-texto" },
      ajudas: {
        pergunta: "Um link só com um ícone (sem texto visível) precisa de qual atributo para ter um nome acessível?",
        dica: 'aria-label, com uma frase curta como "Instagram da Estação Moda".',
      },
      falaAoConcluir: { texto: "Com o aria-label, o leitor de tela anuncia para onde o link leva, mesmo sem texto visível.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "adicionarAtributo", seletor: ".rede-social", nome: "aria-label", valor: "Instagram da Estação Moda" }],
    },
  ],
  conclusao: [
    { texto: "Título, contraste e rótulo: três problemas comuns, três consertos rápidos.", expressao: "comemorando" },
    { texto: "Hora de juntar os quatro tipos de problema num desafio, sem passo a passo.", expressao: "curioso" },
  ],
  missaoDeCampo: "No F12 de um site de verdade, use a aba Lighthouse e veja se algum título pula de nível, ou se algum link é só um ícone.",
  falaFinal: { texto: "Hora do desafio: levar uma livraria de nota baixa a nota alta.", expressao: "feliz" },
};
