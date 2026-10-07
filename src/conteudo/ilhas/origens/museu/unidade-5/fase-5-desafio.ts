/* Sala 5, desafio: o caminho de um clique inteiro, sem passo a passo (quebras, front e back, um cabo partido e a aba Rede). */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
import { ARQUIVOS_DO_SALAO, cabosDoMapa, ILHAS_DO_MAPA, PONTOS_DO_MAPA } from "./dados";

const viagem = (texto: string) => ({ tipo: "comandoNaEstacao", estacao: "viagem-2", comando: texto }) as const;
const pular = (no: string) => ({ tipo: "comandoNaEstacao", estacao: "mapa-2", comando: `pular:${no}` }) as const;
const ligar = (cartao: string, alvo: string) => ({ tipo: "ligarCartao", estacao: "lados-2", cartao, alvo }) as const;

export const FASE_ORIGENS_U5_F5: Fase = {
  id: "origens-museu-u5-f5",
  tipo: "desafio",
  unidadeId: "origens-museu-u5",
  titulo: "O site que não abria",
  conceitos: ["dns", "front-e-back", "cabo-submarino", "codigo-de-status"],
  revisa: ["roteador", "pacote-de-rede", "aba-rede"],
  prerequisitos: ["dns"],
  usaFerramentas: ["caminho-do-clique", "cartoes-de-ligar", "mapa-dos-cabos", "aba-rede-previa"],
  siteAlvo: SITE_DO_PROGRAMA,
  areas: ["exposicao"],
  exposicao: {
    anfitriao: "internet",
    placa: {
      titulo: "O site do Salão Girassol",
      texto: "A agenda do salão não abre. Pode ser o DNS, um cabo, o servidor... Investigue cada peça do caminho de um clique.",
    },
    falas: {
      abrir: "Socorro! O site do salão não abre, e a dona me ligou cinco vezes! Investiga comigo?",
      porEtapa: {
        quebras: "Viu? Com o DNS fora, nem adianta o servidor estar bem. Anotado!",
        lados: "Agenda guardada nos fundos, botão bonito na frente. Isso!",
        cabo: "O cabo da Lógica partiu, mas o pacote deu a volta pela Sites. Eu sempre acho um jeito!",
        status: "Achou! 500: o servidor da agenda falhou. Não era o caminho, era a cozinha!",
      },
      concluir: "Caso resolvido! Era o servidor da agenda. Sala 5 concluída, e eu já contei para todo mundo!",
    },
    estacoes: [
      { id: "viagem-2", tipo: "clique", titulo: "O clique", site: "salaogirassol.com.br", cenarios: ["normal", "dns-fora", "servidor-lento"] },
      {
        id: "lados-2",
        tipo: "ligar",
        titulo: "Front ou back?",
        pergunta: "No site do salão, cada coisa roda onde?",
        alvos: [
          { id: "front", nome: "Front-end", descricao: "No navegador da cliente" },
          { id: "back", nome: "Back-end", descricao: "No servidor do salão" },
        ],
        cartoes: [
          { id: "horarios-livres", texto: "Guardar os horários já marcados", alvo: "back", revela: "Se ficasse no navegador, cada cliente veria uma agenda diferente." },
          { id: "calendario", texto: "O calendário bonito para escolher o dia", alvo: "front", revela: "Desenhado na tela, com HTML, CSS e JavaScript." },
          { id: "conflito", texto: "Impedir duas clientes no mesmo horário", alvo: "back", revela: "Só o servidor vê todas as marcações ao mesmo tempo." },
          { id: "confirmacao", texto: "A mensagem verde de horário marcado", alvo: "front", revela: "Aparece na tela, depois que o back responde que deu certo." },
        ],
      },
      { id: "mapa-2", tipo: "pacote", titulo: "O cabo partido", ilhas: ILHAS_DO_MAPA, nos: PONTOS_DO_MAPA, cabos: cabosDoMapa(["logica>costa-rede"]), origem: "casa", destino: "servidor" },
      { id: "rede-2", tipo: "aba-rede", titulo: "A aba Rede", pagina: "salaogirassol.com.br", requisicoes: ARQUIVOS_DO_SALAO },
    ],
  },
  introducao: [
    { texto: "Desafio da sala 5! O site do salão não está abrindo direito. Vamos investigar cada parte do caminho.", expressao: "apontando" },
    { texto: "Sem passo a passo. Se travar, o Rever leva você de volta à exposição certa.", expressao: "feliz" },
  ],
  partes: [
    {
      id: "quebras",
      descricao: "No clique, ver a viagem normal até o fim e também a viagem com o DNS fora do ar",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "marcoNaEstacao", estacao: "viagem-2", marco: "viu:normal" },
          { tipo: "marcoNaEstacao", estacao: "viagem-2", marco: "viu:dns-fora" },
        ],
      },
      revisarEm: "origens-museu-u5-f1",
      solucaoDeTeste: [viagem("clicar"), ...Array.from({ length: 6 }, () => viagem("avancar")), viagem("cenario:dns-fora"), viagem("clicar"), viagem("avancar"), viagem("avancar")],
    },
    {
      id: "lados",
      descricao: "Separar o que roda no front e o que roda no back do site do salão",
      validador: { tipo: "cartoesLigados", estacao: "lados-2" },
      revisarEm: "origens-museu-u5-f2",
      solucaoDeTeste: [ligar("horarios-livres", "back"), ligar("calendario", "front"), ligar("conflito", "back"), ligar("confirmacao", "front")],
    },
    {
      id: "cabo",
      descricao: "Levar o pacote até o servidor, com o cabo da Lógica partido",
      validador: { tipo: "marcoNaEstacao", estacao: "mapa-2", marco: "entregue" },
      revisarEm: "origens-museu-u5-f3",
      solucaoDeTeste: [pular("bairro"), pular("costa-origens"), pular("sites"), pular("costa-rede"), pular("servidor")],
    },
    {
      id: "status",
      descricao: "Na aba Rede, achar o pedido em que o servidor falhou (status 500)",
      validador: { tipo: "marcoNaEstacao", estacao: "rede-2", marco: "escolhida:agenda" },
      revisarEm: "origens-museu-u5-f4",
      solucaoDeTeste: [{ tipo: "comandoNaEstacao", estacao: "rede-2", comando: "gravar" }, { tipo: "comandoNaEstacao", estacao: "rede-2", comando: "escolher:agenda" }],
    },
  ],
  conclusao: [
    { texto: "Você investigou o caminho inteiro: DNS, cabos, front, back e a aba Rede. Era o servidor da agenda!", expressao: "comemorando" },
    { texto: "Última sala: o primo celular mostra onde a programação vive, do semáforo ao banco.", expressao: "curioso" },
  ],
  missaoDeCampo:
    "Da próxima vez que um site não abrir, investigue como aqui: o endereço está certo? Outro site abre (o caminho funciona)? A aba Rede mostra algum 404 ou 500?",
  falaFinal: { texto: "Bora pra sala 6! O primo celular mandou notificação: está esperando.", expressao: "comemorando" },
};
