/* Sala 1, fase 4: um byte vira letra, e dois dígitos hexadecimais guardam um byte de cor (a ponte com o CSS). */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_ORIGENS_U1_F4: Fase = {
  id: "origens-museu-u1-f4",
  tipo: "pratica",
  unidadeId: "origens-museu-u1",
  titulo: "Letras e cores",
  conceitos: ["byte", "hexadecimal"],
  revisa: ["binario", "bit"],
  prerequisitos: ["binario"],
  usaFerramentas: ["lampadas-de-bits", "mesa-de-cores"],
  siteAlvo: SITE_DO_PROGRAMA,
  areas: ["exposicao"],
  exposicao: {
    anfitriao: "pc",
    placa: {
      titulo: "O computador em casa",
      texto: "Anos 1980. Computadores pessoais mostravam letras e cores na tela, e cada letra e cada pedacinho de cor era guardado em bytes.",
    },
    falas: {
      abrir: "Oiê! Aqui em casa eu guardava tudo em bytes: oito lâmpadas juntinhas! Cada número de 0 a 255 pode ser uma letra.",
      porEtapa: {
        "letra-a": "Acende o 65 pra mim? 64 + 1! Olha a letra que aparece!",
        vermelho: "Agora a minha mesa de cores! Dois dígitos de vermelho, dois de verde e dois de azul.",
        laranja: "Sozinho agora: o laranja do botão. Muito vermelho, metade de verde, nada de azul. Bip!",
      },
      concluir: "PRONTO! Letra, número e cor: tudo byte. Bip bip!",
    },
    estacoes: [
      { id: "byte", tipo: "bits", titulo: "Um byte", quantos: 8, aparencia: "lampada", pesos: true, letra: true },
      {
        id: "mesa",
        tipo: "cor",
        titulo: "A mesa de cores",
        inicial: "#000000",
        css: { seletor: ".botao", propriedade: "background" },
        amostra: { valor: "#ff8800", nome: "laranja" },
      },
    ],
  },
  introducao: [
    { texto: "Esse é o meu tio, o computador bege! Ele trouxe o computador para dentro de casa. E nunca larga os disquetes.", expressao: "apontando" },
    { texto: "Oito bits juntos têm nome: byte. Com um byte, o computador escreve uma letra. Com três, monta uma cor.", expressao: "feliz" },
  ],
  objetivos: [
    {
      id: "letra-a",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "No byte, acenda as lâmpadas que somam 65 e veja a letra que aparece.",
        toque: "No byte, acenda as lâmpadas que somam 65 e veja a letra que aparece.",
      },
      validador: { tipo: "bitsValem", estacao: "byte", valor: 65 },
      apresentar: ["lampadas-de-bits"],
      ajudas: {
        pergunta: "Os pesos de um byte vão de 128 até 1. Quais dois somam 65?",
        dica: "Um byte são 8 bits: guarda de 0 a 255. Numa tabela que todo computador usa, o 65 é a letra A maiúscula.",
        linha: { alvo: "exposicao", estacao: "byte", peca: "1", fala: "Esta lâmpada vale 64. Quanto falta para 65?" },
        solucao: {
          fala: "Acendi a do 64 e a do 1: 64 + 1 = 65, a letra A.",
          acoes: [
            { tipo: "alternarBit", estacao: "byte", indice: 1, ligado: true },
            { tipo: "alternarBit", estacao: "byte", indice: 7, ligado: true },
          ],
        },
      },
      falaAoConcluir: { texto: "A! Quando você digita uma letra, o computador guarda um número assim, num byte.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "alternarBit", estacao: "byte", indice: 1 },
        { tipo: "alternarBit", estacao: "byte", indice: 7 },
      ],
    },
    {
      id: "vermelho",
      tipo: "previsao",
      modo: "guiado",
      enunciado: {
        mouse: "Agora confira: na mesa de cores, monte #ff0000 com as setinhas.",
        toque: "Agora confira: na mesa de cores, monte #ff0000 com as setinhas.",
      },
      previsao: {
        pergunta: "Na cor #ff0000, os dois dígitos do vermelho estão no máximo (ff) e o resto é zero. Que cor aparece?",
        opcoes: ["Verde", "Preto", "Azul", "Vermelho"],
        correta: 3,
        explicacao: "ff é o máximo de vermelho, e 00 é nada de verde e nada de azul. Só vermelho, no máximo.",
      },
      validador: { tipo: "corHex", estacao: "mesa", valor: "#ff0000" },
      apresentar: ["mesa-de-cores"],
      ajudas: {
        pergunta: "Depois do 9 vem a, b, c, d, e, f. Qual é o maior dígito hexadecimal?",
        dica: "Hexadecimal conta de 16 em 16: 0 a 9 e depois a a f. Dois dígitos fazem um byte: ff é 255, o máximo.",
        linha: { alvo: "exposicao", estacao: "mesa", peca: "r", fala: "Estes dois dígitos são o vermelho." },
        solucao: { fala: "Montei #ff0000: vermelho no máximo, verde e azul em zero.", acoes: [{ tipo: "definirCor", estacao: "mesa", valor: "#ff0000" }] },
      },
      falaAoConcluir: { texto: "Vermelho puro! ff é 255 em hexadecimal: o mesmo byte de antes, escrito com dois dígitos.", expressao: "feliz" },
      solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 3 }, { tipo: "definirCor", estacao: "mesa", valor: "#ff0000" }],
    },
    {
      id: "laranja",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Monte o laranja do botão, #ff8800: vermelho no máximo, verde pela metade, azul em zero.",
        toque: "Monte o laranja do botão, #ff8800: vermelho no máximo, verde pela metade, azul em zero.",
      },
      validador: { tipo: "corHex", estacao: "mesa", valor: "#ff8800" },
      ajudas: {
        pergunta: "Qual par de dígitos é o verde? E quanto é metade de ff?",
        dica: "Os pares são vermelho, verde e azul, nessa ordem. 88 fica no meio do caminho entre 00 e ff.",
      },
      falaAoConcluir: { texto: "#ff8800! É assim que se escreve laranja no CSS. Você vai ver muito disso na Ilha Sites.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "definirCor", estacao: "mesa", valor: "#FF8800" }],
    },
  ],
  conclusao: [
    { texto: "Um byte são 8 bits. Em hexadecimal, um byte cabe em dois dígitos: de 00 a ff, que é de 0 a 255.", expressao: "apontando" },
    { texto: "Por isso as cores do CSS têm seis dígitos: três bytes, um de vermelho, um de verde e um de azul.", expressao: "feliz" },
  ],
  missaoDeCampo:
    "Abra o F12 num site colorido, aba Elementos, e veja o painel Estilos. Ache uma cor como #1a73e8 e clique no quadradinho ao lado dela: o seletor de cores mostra o vermelho, o verde e o azul. Shift + clique no quadradinho troca o jeito de escrever.",
  falaFinal: { texto: "Toda cor da tela é uma mistura de vermelho, verde e azul. Agora você sabe ler a receita.", expressao: "feliz" },
};
