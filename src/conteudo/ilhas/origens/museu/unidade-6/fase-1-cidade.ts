/* Sala 6, fase 1: a cidade com código em todo lugar, e quem programa cada coisa (a ponte com a tela de Profissões). */
import type { Fase } from "@/conteudo/tipos";
import type { LugarDaCidade } from "@/motor/exposicao/simulacoes/cidade";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

/*
 * Os códigos são pseudocódigo com cara de JavaScript (a ideia, não o
 * programa de verdade de cada aparelho). Fatos conferidos (rodada 38):
 * carros modernos têm dezenas de pequenos computadores (as centrais
 * eletrônicas); o painel do ponto usa o GPS do ônibus para prever a
 * chegada.
 */
export const LUGARES_DA_CIDADE: LugarDaCidade[] = [
  {
    id: "semaforo",
    nome: "O semáforo",
    figura: "semaforo",
    codigo: ["while (ligado) {", "  verde(); esperar(30);", "  amarelo(); esperar(4);", "  vermelho(); esperar(30);", "}"],
    explica: "Um laço que nunca acaba, trocando as cores no tempo certo. Alguns mudam o tempo conforme o trânsito.",
    quem: "Quem programa aparelhos e automação (software embarcado)",
  },
  {
    id: "caixa",
    nome: "O caixa eletrônico",
    figura: "caixa-eletronico",
    codigo: ["if (senhaCerta(cartao, senha)) {", "  if (saldo >= valor) entregar(valor);", "} else {", "  tentativas++;", "}"],
    explica: "Confere a senha e o saldo antes de soltar o dinheiro. Um erro aqui custa caro: segurança em primeiro lugar.",
    quem: "Gente de segurança e de back-end",
    profissao: "seguranca",
  },
  {
    id: "app",
    nome: "O app do banco",
    figura: "app-banco",
    codigo: ["botaoSaldo.onclick = async () => {", "  const saldo = await pedir(\"/saldo\");", "  tela.mostrar(saldo);", "};"],
    explica: "A tela que a pessoa toca é front-end; o saldo vem do servidor do banco, o back-end.",
    quem: "Gente de front-end e de back-end",
    profissao: "front-end",
  },
  {
    id: "padaria",
    nome: "A padaria",
    figura: "padaria",
    codigo: ["let total = pao + leite + bolo;", "total = total - desconto;", "caixa.mostrar(total);"],
    explica: "A conta da sala 3, de verdade: o programa da registradora e o site de encomendas.",
    quem: "Gente full-stack, que faz o site e o sistema",
    profissao: "full-stack",
  },
  {
    id: "carro",
    nome: "O carro",
    figura: "carro",
    codigo: ["if (distancia(frente) < 2) {", "  frear();", "  apitar();", "}"],
    explica: "Carros modernos têm dezenas de pequenos computadores: no freio, no motor, no painel e no sensor de ré.",
    quem: "Quem programa aparelhos (software embarcado)",
  },
  {
    id: "ponto",
    nome: "O ponto de ônibus",
    figura: "ponto-onibus",
    codigo: ["const minutos = prever(onibus.gps);", "painel.mostrar(minutos + \" min\");"],
    explica: "O painel calcula quando o ônibus chega pelo GPS dele e pelas viagens de antes: trabalho com dados.",
    quem: "Gente de dados",
    profissao: "dados",
  },
];

export const FASE_ORIGENS_U6_F1: Fase = {
  id: "origens-museu-u6-f1",
  tipo: "pratica",
  unidadeId: "origens-museu-u6",
  titulo: "A cidade do código",
  conceitos: ["software-embarcado", "carreiras-em-programacao"],
  revisa: ["front-e-back", "processador"],
  prerequisitos: ["front-e-back"],
  usaFerramentas: ["cidade-do-codigo"],
  siteAlvo: SITE_DO_PROGRAMA,
  areas: ["exposicao"],
  exposicao: {
    anfitriao: "celular",
    placa: {
      titulo: "Onde a programação vive",
      texto: "Semáforo, caixa eletrônico, app, carro, padaria, ponto de ônibus. Cada um esconde um programa, e alguém programou cada um.",
    },
    falas: {
      abrir: "Oi. Olha a rua. Tem código em tudo. Toca para ver.",
      porEtapa: {
        todos: "Seis lugares. Seis programas. Abre todos.",
      },
      concluir: "Viu? Código em todo lugar. Alguém escreveu cada um. Pode ser você.",
    },
    estacoes: [{ id: "rua", tipo: "cidade", titulo: "A rua", lugares: LUGARES_DA_CIDADE }],
  },
  introducao: [
    { texto: "Esse é o meu primo mais velho, o celular. Ele fala pouco: uma notificação por vez.", expressao: "apontando" },
    { texto: "Ele quer mostrar que programação não mora só no computador. Mora na rua inteira!", expressao: "curioso" },
  ],
  objetivos: [
    {
      id: "semaforo",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Clique no semáforo e veja o programa que mora dentro dele.",
        toque: "Toque no semáforo e veja o programa que mora dentro dele.",
      },
      validador: { tipo: "marcoNaEstacao", estacao: "rua", marco: "aberto:semaforo" },
      apresentar: ["cidade-do-codigo"],
      ajudas: {
        pergunta: "Quem troca as cores do semáforo, sem ninguém apertar botão?",
        dica: "Tocar num lugar da rua abre o código de dentro dele.",
        linha: { alvo: "exposicao", estacao: "rua", peca: "semaforo", fala: "Este é o semáforo." },
        solucao: { fala: "Abri o semáforo: um laço que nunca acaba.", acoes: [{ tipo: "comandoNaEstacao", estacao: "rua", comando: "abrir:semaforo" }] },
      },
      falaAoConcluir: { texto: "Um laço sem fim, como o while da Ilha Lógica! O semáforo é um computadorzinho escondido.", expressao: "feliz" },
      solucaoDeTeste: [{ tipo: "comandoNaEstacao", estacao: "rua", comando: "abrir:semaforo" }],
    },
    {
      id: "todos",
      tipo: "previsao",
      modo: "sozinho",
      enunciado: {
        mouse: "Agora sozinho: abra todos os outros lugares da rua e veja quem programa cada um.",
        toque: "Agora sozinho: abra todos os outros lugares da rua e veja quem programa cada um.",
      },
      previsao: {
        pergunta: "Antes de abrir: em quantos desses lugares você acha que tem um programa?",
        opcoes: ["Só no app do banco", "Em metade deles", "Em todos"],
        correta: 2,
        explicacao: "Em todos. Até a padaria e o ponto de ônibus têm um programa trabalhando.",
      },
      validador: { tipo: "marcoNaEstacao", estacao: "rua", marco: "todos-abertos" },
      ajudas: {
        pergunta: "Qual lugar da rua você ainda não abriu?",
        dica: "Os lugares fechados têm uma bolinha piscando. Os abertos ganham um selinho de código.",
      },
      falaAoConcluir: { texto: "Seis lugares, seis programas, e muita gente diferente programando. Tem um caminho para cada gosto!", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 2 },
        ...["caixa", "app", "padaria", "carro", "ponto"].map((id) => ({ tipo: "comandoNaEstacao", estacao: "rua", comando: `abrir:${id}` }) as const),
      ],
    },
  ],
  conclusao: [
    { texto: "Programa embarcado mora dentro dos aparelhos; app e site moram no celular e no servidor.", expressao: "apontando" },
    { texto: "A tela de Profissões mostra cada caminho: front-end, back-end, dados, segurança e mais.", expressao: "feliz" },
  ],
  missaoDeCampo:
    "Hoje, conte quantos aparelhos com programa você usa até a hora de dormir: celular, micro-ondas, ônibus, catraca, elevador... Passou de dez?",
  falaFinal: { texto: "Daqui a pouco, alguns desses programas podem ser seus.", expressao: "feliz" },
};
