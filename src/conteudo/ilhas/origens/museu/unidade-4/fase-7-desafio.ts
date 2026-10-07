/* Sala 4, desafio: o computador inteiro, sem passo a passo (processador, gerente, arquivos e a memória que lembra). */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
import { BANCADA_DO_ALARME } from "./circuitos";

const vez = (id: string) => ({ tipo: "comandoNaEstacao", estacao: "gerente-2", comando: `vez:${id}` }) as const;

export const FASE_ORIGENS_U4_F7: Fase = {
  id: "origens-museu-u4-f7",
  tipo: "desafio",
  unidadeId: "origens-museu-u4",
  titulo: "O computador inteiro",
  conceitos: ["processador", "sistema-operacional", "sistema-de-arquivos", "realimentacao"],
  revisa: ["memoria-ram", "endereco-de-memoria", "meio-somador"],
  prerequisitos: ["processador"],
  usaFerramentas: ["processador-de-brinquedo", "gerente-do-sistema", "arvore-de-pastas", "painel-de-cabos"],
  siteAlvo: SITE_DO_PROGRAMA,
  areas: ["exposicao"],
  exposicao: {
    anfitriao: "pc",
    placa: {
      titulo: "O computador, aberto",
      texto: "Processador, memória, sistema operacional, arquivos e portões: as peças que você já conhece, num computador só.",
    },
    falas: {
      abrir: "Desafio da sala 4! Tudo aberto, tudo seu. Eu só fico aqui torcendo. Bip bip!",
      porEtapa: {
        processador: "O preço mais duas vezes o frete: 28! Conta certinha.",
        gerente: "Vídeo sem travar! O gerente aprovou.",
        arquivos: "Trabalho na pasta da escola. Organizado!",
        alarme: "O alarme lembra que a porta abriu. Como uma contatora selada!",
      },
      concluir: "Você abriu o computador e entendeu cada peça. Sala 4 concluída: CARREGADO COM SUCESSO!",
    },
    estacoes: [
      {
        id: "cpu-2",
        tipo: "processador",
        titulo: "O processador",
        memoria: [
          { ordem: "PEGA", endereco: 6 },
          { ordem: "SOMA", endereco: 7 },
          { ordem: "SOMA", endereco: 7 },
          { ordem: "GUARDA", endereco: 8 },
          { ordem: "PARA", endereco: 0 },
          { valor: null },
          { valor: 12, nome: "preco" },
          { valor: 8, nome: "frete" },
          { valor: null, nome: "total" },
        ],
      },
      {
        id: "gerente-2",
        tipo: "sistema",
        titulo: "O gerente",
        memoriaTotal: 8,
        programas: [
          { id: "video", nome: "Vídeo", figura: "video", fatias: 3, memoria: 3, ritmo: 2 },
          { id: "mensagens", nome: "Mensagens", figura: "mensagens", fatias: 2, memoria: 2 },
          { id: "editor", nome: "Editor", figura: "editor", fatias: 3, memoria: 3 },
        ],
      },
      {
        id: "pastas-2",
        tipo: "arquivos",
        titulo: "Os arquivos",
        raiz: {
          id: "computador",
          nome: "Meu computador",
          tipo: "pasta",
          filhos: [
            { id: "escola", nome: "Escola", tipo: "pasta", filhos: [{ id: "redacao", nome: "redacao.txt", tipo: "arquivo" }] },
            { id: "musicas", nome: "Músicas", tipo: "pasta", filhos: [{ id: "samba", nome: "samba.mp3", tipo: "arquivo" }] },
            { id: "downloads", nome: "Downloads", tipo: "pasta", filhos: [{ id: "trabalho", nome: "trabalho-de-ciencias.txt", tipo: "arquivo" }] },
          ],
        },
      },
      { id: "alarme", tipo: "circuito", titulo: "O alarme", aparencia: "portoes", inicial: BANCADA_DO_ALARME, paleta: ["e", "ou", "nao"] },
    ],
  },
  introducao: [
    { texto: "Desafio da sala 4! Quatro peças do computador para pôr para funcionar, sem passo a passo.", expressao: "apontando" },
    { texto: "Se travar, o Rever leva você de volta à exposição certa.", expressao: "feliz" },
  ],
  partes: [
    {
      id: "processador",
      descricao: "Rodar o processador até o fim e guardar o total (preço mais duas vezes o frete) na caixa 8",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "marcoNaEstacao", estacao: "cpu-2", marco: "fim" },
          { tipo: "marcoNaEstacao", estacao: "cpu-2", marco: "caixa:8=28" },
        ],
      },
      revisarEm: "origens-museu-u4-f2",
      solucaoDeTeste: [{ tipo: "comandoNaEstacao", estacao: "cpu-2", comando: "rodar" }],
    },
    {
      id: "gerente",
      descricao: "Dividir o tempo até os três terminarem, sem o vídeo ficar mais de 2 fatias sem a vez",
      validador: { tipo: "marcoNaEstacao", estacao: "gerente-2", marco: "terminou-sem-engasgo" },
      revisarEm: "origens-museu-u4-f3",
      solucaoDeTeste: ["video", "mensagens", "editor", "video", "mensagens", "editor", "video", "editor"].map(vez),
    },
    {
      id: "arquivos",
      descricao: "Mover o trabalho de ciências dos Downloads para a pasta Escola",
      validador: { tipo: "marcoNaEstacao", estacao: "pastas-2", marco: "em:trabalho>escola" },
      revisarEm: "origens-museu-u4-f4",
      solucaoDeTeste: [
        { tipo: "comandoNaEstacao", estacao: "pastas-2", comando: "abrir:downloads" },
        { tipo: "comandoNaEstacao", estacao: "pastas-2", comando: "escolher:trabalho" },
        { tipo: "comandoNaEstacao", estacao: "pastas-2", comando: "mover:trabalho>escola" },
      ],
    },
    {
      id: "alarme",
      descricao: "Fazer o alarme lembrar: a porta abre e fecha, e ele continua tocando até o botão de silêncio",
      validador: { tipo: "circuitoLembra", estacao: "alarme", saida: "alarme", liga: "sensor", desliga: "botao" },
      revisarEm: "origens-museu-u4-f6",
      solucaoDeTeste: [{ tipo: "mexerNoCircuito", estacao: "alarme", mudanca: { tipo: "fio", de: "e1", para: "ou1", porta: 1 } }],
    },
  ],
  conclusao: [
    { texto: "Processador, memória, sistema operacional, arquivos e portões: você abriu o computador inteiro.", expressao: "comemorando" },
    { texto: "Próxima sala: a tia internet mostra o caminho de um clique, do seu dedo até o outro lado do mundo.", expressao: "curioso" },
  ],
  missaoDeCampo:
    "Desenhe num papel o computador por dentro, como uma cidade: o processador é a fábrica, a memória é a mesa de trabalho, o disco é o armário e o sistema operacional é o gerente. Mostre para alguém.",
  falaFinal: { texto: "Bora pra sala 5! A tia internet já está conectando... iiiiiii, pronto.", expressao: "comemorando" },
};
