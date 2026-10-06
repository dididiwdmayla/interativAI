/* Sala 1, desafio: a oficina da família. Tecer, escrever uma letra num byte e montar uma cor, sem passo a passo. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_ORIGENS_U1_F5: Fase = {
  id: "origens-museu-u1-f5",
  tipo: "desafio",
  unidadeId: "origens-museu-u1",
  titulo: "A oficina da família",
  conceitos: ["bit", "binario", "byte", "hexadecimal"],
  revisa: ["linguagem-de-maquina"],
  prerequisitos: ["bit", "binario", "byte", "hexadecimal"],
  usaFerramentas: ["tear-de-cartoes", "lampadas-de-bits", "mesa-de-cores"],
  siteAlvo: SITE_DO_PROGRAMA,
  areas: ["exposicao"],
  exposicao: {
    anfitriao: "tecela",
    placa: {
      titulo: "A oficina da família",
      texto: "Três bancadas, três épocas: o tear dos cartões, o byte das letras e a mesa das cores. Tudo feito de furo e sem furo.",
    },
    falas: {
      abrir: "Meu bem, a família preparou uma encomenda. Uma estrela no pano, a letra B num byte e uma cor amarela. Sem pressa.",
      porEtapa: {
        estrela: "Que estrela bonita! Cada furo no lugar certo.",
        letra: "A letra B! Você conta igual ao meu bisneto gigante.",
        amarelo: "Amarelo! Vermelho com verde, e nada de azul. Quem diria.",
      },
      concluir: "Encomenda entregue! Agora você entende a língua da família inteira.",
    },
    estacoes: [
      { id: "tear-estrela", tipo: "tear", titulo: "Tear", modelo: ["..#..", "#####", ".###.", "#...#"] },
      { id: "byte-letra", tipo: "bits", titulo: "Byte", quantos: 8, aparencia: "lampada", pesos: true, letra: true },
      { id: "mesa-amarela", tipo: "cor", titulo: "Mesa de cores", inicial: "#000000", css: { seletor: ".aviso", propriedade: "background" } },
    ],
  },
  introducao: [
    { texto: "Último desafio da sala 1! A família toda deixou uma encomenda na oficina. Desta vez, sem passo a passo.", expressao: "apontando" },
    { texto: "Se travar, o Rever leva você de volta à exposição onde aprendeu. Bora?", expressao: "feliz" },
  ],
  partes: [
    {
      id: "estrela",
      descricao: "Tecer a estrela no tear, igualzinha ao desenho pedido",
      validador: { tipo: "tecidoIgual", estacao: "tear-estrela" },
      revisarEm: "origens-museu-u1-f1",
      solucaoDeTeste: [
        { tipo: "furarCartao", estacao: "tear-estrela", linha: 0, coluna: 2 },
        ...[0, 1, 2, 3, 4].map((coluna) => ({ tipo: "furarCartao", estacao: "tear-estrela", linha: 1, coluna }) as const),
        ...[1, 2, 3].map((coluna) => ({ tipo: "furarCartao", estacao: "tear-estrela", linha: 2, coluna }) as const),
        { tipo: "furarCartao", estacao: "tear-estrela", linha: 3, coluna: 0 },
        { tipo: "furarCartao", estacao: "tear-estrela", linha: 3, coluna: 4 },
      ],
    },
    {
      id: "letra",
      descricao: "Mostrar a letra B no byte (ela vem logo depois do A, que é o 65)",
      validador: { tipo: "bitsValem", estacao: "byte-letra", valor: 66 },
      revisarEm: "origens-museu-u1-f4",
      solucaoDeTeste: [
        { tipo: "alternarBit", estacao: "byte-letra", indice: 1 },
        { tipo: "alternarBit", estacao: "byte-letra", indice: 6 },
      ],
    },
    {
      id: "amarelo",
      descricao: "Montar o amarelo #ffff00 na mesa de cores",
      validador: { tipo: "corHex", estacao: "mesa-amarela", valor: "#ffff00" },
      revisarEm: "origens-museu-u1-f4",
      solucaoDeTeste: [{ tipo: "definirCor", estacao: "mesa-amarela", valor: "#ffff00" }],
    },
  ],
  conclusao: [
    { texto: "Furo, válvula, lâmpada, dígito: tudo era o mesmo bit com outra roupa. Você fala a língua da máquina!", expressao: "comemorando" },
    { texto: "Na sala 2, a família conta a história inteira: quem veio antes de quem, e o que cada um mudou.", expressao: "apontando" },
  ],
  missaoDeCampo:
    "Inglês técnico: abra developer.mozilla.org, busque hex-color e abra a página (ela é em inglês). Na parte Syntax, descubra quantos dígitos uma cor em hexadecimal pode ter. Dica: procure por #RGB.",
  falaFinal: { texto: "Sala 1 completa! A família está orgulhosa. Eu também.", expressao: "comemorando" },
};
