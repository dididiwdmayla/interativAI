/* Sala 4, fase 3: o sistema operacional, o gerente que divide o tempo e a memória entre os programas. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

const VEZES_SEM_ENGASGO = ["navegador", "jogo", "musica", "navegador", "jogo", "musica", "navegador", "jogo", "musica", "jogo"];

export const FASE_ORIGENS_U4_F3: Fase = {
  id: "origens-museu-u4-f3",
  tipo: "pratica",
  unidadeId: "origens-museu-u4",
  titulo: "O gerente",
  conceitos: ["sistema-operacional"],
  revisa: ["processador", "memoria-ram"],
  prerequisitos: ["processador"],
  usaFerramentas: ["gerente-do-sistema"],
  siteAlvo: SITE_DO_PROGRAMA,
  areas: ["exposicao"],
  exposicao: {
    anfitriao: "pc",
    placa: {
      titulo: "O sistema operacional",
      texto: "Música, navegador e jogo abertos ao mesmo tempo, e um processador só. Quem divide a vez é o sistema operacional. Simulação simplificada.",
    },
    falas: {
      abrir: "Eu toco música, abro a internet e rodo jogo. Tudo junto! Quer dizer... um de cada vez, bem rapidinho.",
      porEtapa: {
        todos: "A música não pode esperar muito, senão engasga! Os outros aguentam. Reparte bem!",
        automatico: "Agora deixa o gerente de verdade fazer. Ele é rapidinho, ó!",
      },
      concluir: "Isso! Quem faz esse malabarismo é o sistema operacional. No computador, milhares de vezes por segundo.",
    },
    estacoes: [
      {
        id: "gerente",
        tipo: "sistema",
        titulo: "Três programas, um processador",
        memoriaTotal: 8,
        programas: [
          { id: "musica", nome: "Música", figura: "musica", fatias: 4, memoria: 1, ritmo: 2 },
          { id: "navegador", nome: "Navegador", figura: "navegador", fatias: 3, memoria: 3 },
          { id: "jogo", nome: "Jogo", figura: "jogo", fatias: 4, memoria: 3 },
        ],
      },
    ],
  },
  introducao: [
    { texto: "Você já ouviu música enquanto navega? O processador faz uma coisa por vez. Como pode?", expressao: "curioso" },
    { texto: "Tem um gerente que dá a vez para cada programa, em fatias de tempo. Hoje o gerente é você.", expressao: "apontando" },
  ],
  objetivos: [
    {
      id: "a-vez",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Clique na Música para dar a primeira fatia de tempo do processador a ela.",
        toque: "Toque na Música para dar a primeira fatia de tempo do processador a ela.",
      },
      validador: { tipo: "marcoNaEstacao", estacao: "gerente", marco: "vez:musica" },
      apresentar: ["gerente-do-sistema"],
      ajudas: {
        pergunta: "Qual dos três tem pressa?",
        dica: "Tocar num programa dá a próxima fatia de tempo a ele. A música tem pressa: começa por ela.",
        linha: { alvo: "exposicao", estacao: "gerente", peca: "musica", fala: "Dê a vez para a música aqui." },
        solucao: { fala: "Dei a primeira fatia para a música.", acoes: [{ tipo: "comandoNaEstacao", estacao: "gerente", comando: "vez:musica" }] },
      },
      falaAoConcluir: { texto: "A música tocou um pedacinho. Agora ela espera a vez de novo, enquanto os outros trabalham.", expressao: "feliz" },
      solucaoDeTeste: [{ tipo: "comandoNaEstacao", estacao: "gerente", comando: "vez:musica" }],
    },
    {
      id: "todos",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Agora sozinho: divida o tempo até todos terminarem, sem a música ficar mais de 2 fatias sem a vez.",
        toque: "Agora sozinho: divida o tempo até todos terminarem, sem a música ficar mais de 2 fatias sem a vez.",
      },
      validador: { tipo: "marcoNaEstacao", estacao: "gerente", marco: "terminou-sem-engasgo" },
      ajudas: {
        pergunta: "Se você der três vezes seguidas para o jogo, o que acontece com a música?",
        dica: "Faça uma roda: música, navegador, jogo, música... Se engasgar, Recomeçar e tente de novo.",
      },
      falaAoConcluir: { texto: "Ninguém engasgou! Repartir a vez em roda é o jeito mais antigo de fazer isso.", expressao: "comemorando" },
      solucaoDeTeste: VEZES_SEM_ENGASGO.map((id) => ({ tipo: "comandoNaEstacao", estacao: "gerente", comando: `vez:${id}` }) as const),
    },
    {
      id: "automatico",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Recomece e clique em Automático: veja o sistema operacional fazer sozinho.",
        toque: "Recomece e toque em Automático: veja o sistema operacional fazer sozinho.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "marcoNaEstacao", estacao: "gerente", marco: "automatico" },
          { tipo: "marcoNaEstacao", estacao: "gerente", marco: "terminou-sem-engasgo" },
        ],
      },
      ajudas: {
        pergunta: "Com tudo terminado, o Automático não tem o que fazer. O que precisa vir antes?",
        dica: "Recomeçar limpa as fatias. Depois, o Automático reparte do jeito dele.",
        linha: { alvo: "exposicao", estacao: "gerente", peca: "automatico", fala: "Recomece e use este botão." },
        solucao: {
          fala: "Recomecei e deixei o gerente fazer sozinho.",
          acoes: [
            { tipo: "comandoNaEstacao", estacao: "gerente", comando: "reiniciar" },
            { tipo: "comandoNaEstacao", estacao: "gerente", comando: "automatico" },
          ],
        },
      },
      falaAoConcluir: { texto: "Em roda, sempre lembrando da pressa da música. E a memória? Cada um no seu pedaço, sem mexer no do outro.", expressao: "apontando" },
      solucaoDeTeste: [
        { tipo: "comandoNaEstacao", estacao: "gerente", comando: "reiniciar" },
        { tipo: "comandoNaEstacao", estacao: "gerente", comando: "automatico" },
      ],
    },
  ],
  conclusao: [
    { texto: "O sistema operacional é o gerente: divide o tempo do processador e a memória entre os programas.", expressao: "apontando" },
    { texto: "Windows, Android, Linux e iOS são sistemas operacionais. Todo programa roda em cima de um.", expressao: "feliz" },
  ],
  missaoDeCampo:
    "Abra o Gerenciador de tarefas (Ctrl + Shift + Esc no Windows, ou o Monitor de Atividade no Mac) e olhe a coluna CPU por uns segundos: os números trocam o tempo todo. É o gerente repartindo a vez.",
  falaFinal: { texto: "Quando o computador trava, muitas vezes é um programa que não larga a vez. Agora você sabe o porquê.", expressao: "curioso" },
};
