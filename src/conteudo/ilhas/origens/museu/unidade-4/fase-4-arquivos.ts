/* Sala 4, fase 4: arquivos e pastas como árvore (a ponte com a zona Estruturas de dados). */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_ORIGENS_U4_F4: Fase = {
  id: "origens-museu-u4-f4",
  tipo: "pratica",
  unidadeId: "origens-museu-u4",
  titulo: "Arquivos e pastas",
  conceitos: ["sistema-de-arquivos"],
  revisa: ["sistema-operacional", "memoria-ram"],
  prerequisitos: ["sistema-operacional"],
  usaFerramentas: ["arvore-de-pastas"],
  siteAlvo: SITE_DO_PROGRAMA,
  areas: ["exposicao"],
  exposicao: {
    anfitriao: "pc",
    placa: {
      titulo: "O disco e as pastas",
      texto: "A memória esquece quando desliga; o disco guarda de vez, em arquivos. Pastas dentro de pastas: uma árvore, com a raiz no topo.",
    },
    falas: {
      abrir: "Meus disquetes! Tudo guardado em pastas, uma dentro da outra. Vamos arrumar?",
      porEtapa: {
        "a-receita": "Ai, a receita de cenoura foi parar nos Downloads! Leva ela pro lugar certo?",
        "como-arvore": "Olha isso de cabeça para baixo: é uma árvore! Raiz em cima, folhas embaixo.",
      },
      concluir: "Tudo no lugar! E agora você sabe: o caminho de um arquivo é a trilha da raiz até ele.",
    },
    estacoes: [
      {
        id: "pastas",
        tipo: "arquivos",
        titulo: "Meu computador",
        raiz: {
          id: "computador",
          nome: "Meu computador",
          tipo: "pasta",
          filhos: [
            {
              id: "documentos",
              nome: "Documentos",
              tipo: "pasta",
              filhos: [
                { id: "escola", nome: "Escola", tipo: "pasta", filhos: [{ id: "trabalho", nome: "trabalho.txt", tipo: "arquivo" }] },
                { id: "receitas", nome: "Receitas", tipo: "pasta", filhos: [{ id: "bolo", nome: "bolo.txt", tipo: "arquivo" }] },
              ],
            },
            { id: "fotos", nome: "Fotos", tipo: "pasta", filhos: [{ id: "praia", nome: "praia.jpg", tipo: "arquivo" }] },
            { id: "downloads", nome: "Downloads", tipo: "pasta", filhos: [{ id: "cenoura", nome: "cenoura.txt", tipo: "arquivo" }] },
          ],
        },
      },
    ],
  },
  introducao: [
    { texto: "Todo arquivo do computador mora numa pasta, que mora noutra pasta... até a raiz.", expressao: "apontando" },
    { texto: "Vamos abrir as pastas do tio e arrumar uma receita perdida.", expressao: "feliz" },
  ],
  objetivos: [
    {
      id: "abrir-pasta",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Clique na pasta Documentos para abrir e ver o que tem dentro.",
        toque: "Toque na pasta Documentos para abrir e ver o que tem dentro.",
      },
      validador: { tipo: "marcoNaEstacao", estacao: "pastas", marco: "aberta:documentos" },
      apresentar: ["arvore-de-pastas"],
      ajudas: {
        pergunta: "Qual pasta guarda os papéis da escola e as receitas?",
        dica: "Tocar numa pasta abre e mostra o que está dentro dela.",
        linha: { alvo: "exposicao", estacao: "pastas", peca: "documentos", fala: "Esta é a pasta Documentos." },
        solucao: { fala: "Abri Documentos: tem Escola e Receitas.", acoes: [{ tipo: "comandoNaEstacao", estacao: "pastas", comando: "abrir:documentos" }] },
      },
      falaAoConcluir: { texto: "Pasta dentro de pasta! Documentos guarda Escola e Receitas.", expressao: "feliz" },
      solucaoDeTeste: [{ tipo: "comandoNaEstacao", estacao: "pastas", comando: "abrir:documentos" }],
    },
    {
      id: "a-receita",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Agora sozinho: ache cenoura.txt nos Downloads e mova para a pasta Receitas.",
        toque: "Agora sozinho: ache cenoura.txt nos Downloads e mova para a pasta Receitas.",
      },
      validador: { tipo: "marcoNaEstacao", estacao: "pastas", marco: "em:cenoura>receitas" },
      ajudas: {
        pergunta: "Onde a receita está agora? E onde mora o bolo.txt?",
        dica: "Abra Downloads, toque no arquivo e use o Mover para. O caminho em cima muda junto.",
      },
      falaAoConcluir: { texto: "Meu computador / Documentos / Receitas / cenoura.txt. Esse é o caminho dela agora.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "comandoNaEstacao", estacao: "pastas", comando: "abrir:downloads" },
        { tipo: "comandoNaEstacao", estacao: "pastas", comando: "escolher:cenoura" },
        { tipo: "comandoNaEstacao", estacao: "pastas", comando: "mover:cenoura>receitas" },
      ],
    },
    {
      id: "como-arvore",
      tipo: "previsao",
      modo: "guiado",
      enunciado: {
        mouse: "Clique em Ver como árvore: as mesmas pastas, desenhadas como a árvore das Estruturas de dados.",
        toque: "Toque em Ver como árvore: as mesmas pastas, desenhadas como a árvore das Estruturas de dados.",
      },
      previsao: {
        pergunta: "Desenhando as pastas como árvore, o que fica lá no alto, sozinho?",
        opcoes: ["A raiz: Meu computador", "Um arquivo qualquer", "A pasta mais cheia"],
        correta: 0,
        explicacao: "A raiz fica no topo e tudo sai dela: as pastas são galhos e os arquivos são as folhas.",
      },
      validador: { tipo: "marcoNaEstacao", estacao: "pastas", marco: "viu-arvore" },
      ajudas: {
        pergunta: "De onde saem todas as pastas?",
        dica: "Uma árvore de computação cresce de cabeça para baixo: a raiz em cima.",
        linha: { alvo: "exposicao", estacao: "pastas", peca: "ver-arvore", fala: "Este botão desenha a árvore." },
        solucao: { fala: "Desenhei as pastas como árvore: a raiz em cima.", acoes: [{ tipo: "comandoNaEstacao", estacao: "pastas", comando: "ver-arvore" }] },
      },
      falaAoConcluir: { texto: "Raiz, galhos e folhas! Na zona Estruturas de dados, você vai montar árvores assim com código.", expressao: "apontando" },
      solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }, { tipo: "comandoNaEstacao", estacao: "pastas", comando: "ver-arvore" }],
    },
  ],
  conclusao: [
    { texto: "Arquivos ficam em pastas dentro de pastas: uma árvore. O caminho é a trilha da raiz até o arquivo.", expressao: "apontando" },
    { texto: "Quem cuida dessa árvore toda é o sistema operacional, o mesmo gerente da fase anterior.", expressao: "feliz" },
  ],
  missaoDeCampo:
    "Abra o explorador de arquivos e clique na barra de endereço de uma pasta: aparece o caminho inteiro, desde a raiz (C:\\ no Windows, / no Mac e no Linux).",
  falaFinal: { texto: "Um site também é uma árvore de pastas: o index.html na raiz e o resto em volta.", expressao: "feliz" },
};
