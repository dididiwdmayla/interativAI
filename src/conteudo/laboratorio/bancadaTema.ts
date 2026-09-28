/*
 * Bancada do tema: fase de LABORATÓRIO do motor, fora do currículo (só no
 * /lab/fases?fase=lab-motor-u1-f4). Abre o próprio jogo como site-alvo
 * (`SITE_ALVO_DO_JOGO`, E5): a maquete pintada só com as variáveis
 * `--cor-*`, o estilo.css com o :root do tema aberto e o botão "Salvar
 * como Meu tema" em cima da tela.
 *
 * Mostra os dois validadores da E5: `variavelCss` (com
 * `diferenteDoInicial`, porque o valor de partida depende do tema do
 * jogador) e `temaSalvo`.
 */
import { SITE_ALVO_DO_JOGO } from "@/motor/siteDoJogo";
import type { FasePratica } from "../tipos";

export const FASE_BANCADA_TEMA: FasePratica = {
  id: "lab-motor-u1-f4",
  tipo: "pratica",
  unidadeId: "lab-motor-u1",
  titulo: "Bancada do tema (o jogo)",
  conceitos: ["elemento"],
  revisa: [],
  prerequisitos: [],
  usaFerramentas: ["editor-css", "painel-estilos", "editar-valor-css", "seletor-de-cor", "salvar-tema"],
  apresentar: ["editor-css", "painel-estilos", "editar-valor-css", "seletor-de-cor", "salvar-tema"],
  paineisElementos: ["estilos"],
  introducao: [{ texto: "Bancada do tema: o site-alvo é o próprio jogo. Mude as variáveis do :root e salve como Meu tema.", expressao: "curioso" }],
  siteAlvo: SITE_ALVO_DO_JOGO,
  objetivos: [
    {
      id: "trocar-primaria",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Troque a cor da variável --cor-primaria (a dos botões) por outra.",
        toque: "Troque a cor da variável --cor-primaria (a dos botões) por outra.",
      },
      validador: { tipo: "variavelCss", nome: "--cor-primaria", diferenteDoInicial: true },
      ajudas: {
        pergunta: "Onde mora a cor do botão Próximo objetivo?",
        dica: "O botão usa var(--cor-primaria), declarada no :root.",
        linha: { alvo: "css", seletorRegra: ":root", propriedade: "--cor-primaria", fala: "A variável mora aqui, no :root." },
        solucao: {
          fala: "Troquei --cor-primaria no :root: o botão e o que mais usa ela mudaram juntos.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: ":root", propriedade: "--cor-primaria", valor: "#1d4ed8" }],
        },
      },
      falaAoConcluir: { texto: "Cor nova no botão!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ":root", propriedade: "--cor-primaria", valor: "#1d4ed8" }],
    },
    {
      id: "salvar",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Clique em Salvar como Meu tema.",
        toque: "Toque em Salvar como Meu tema.",
      },
      validador: { tipo: "temaSalvo" },
      ajudas: {
        pergunta: "Qual botão guarda as cores?",
        dica: "Fica em cima da tela do site, na barra de endereço.",
        linha: { alvo: "ferramenta", ferramenta: "salvar-tema", fala: "Este botão." },
        solucao: { fala: "Salvei o Meu tema.", acoes: [{ tipo: "salvarTema" }] },
      },
      falaAoConcluir: { texto: "Tema salvo!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "salvarTema" }],
    },
  ],
  conclusao: [{ texto: "Bancada do tema testada.", expressao: "feliz" }],
  falaFinal: { texto: "Pode continuar mexendo nas cores.", expressao: "feliz" },
};
