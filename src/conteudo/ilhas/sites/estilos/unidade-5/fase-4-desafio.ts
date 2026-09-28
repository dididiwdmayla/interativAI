/*
 * E5, Desafio: "Criar o Meu tema".
 *
 * DESVIO DO PADRÃO (registrado de propósito): o desafio de toda outra
 * unidade usa um site-alvo DIFERENTE dos micro-passos. A E5 não pode: a
 * meta da unidade (docs/MAPA-CURRICULAR.md) É criar um tema novo PRO
 * PRÓPRIO JOGO — não existe um "outro site" para isso, porque o
 * site-alvo inteiro da E5 é o jogo (SITE_ALVO_DO_JOGO, seção 15 do guia).
 * O desafio soma as duas habilidades das fases 1 a 3 (trocar variáveis e
 * salvar) sem passo a passo, o que continua cumprindo o espírito da regra
 * (prática livre depois do guiado).
 *
 * PARTES: três variáveis do :root (revisitando a Fase 1) e salvar como
 * Meu tema (revisitando a Fase 3). Sem a Fase 2 (escopo): o desafio pede
 * um tema completo, que é coisa de :root — a técnica de escopo já foi
 * provada na própria Fase 2 e volta nas próximas unidades quando fizer
 * sentido.
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { SITE_ALVO_DO_JOGO } from "@/motor/siteDoJogo";

export const FASE_E5_F4: FaseDesafio = {
  id: "sites-estilos-u5-f4",
  tipo: "desafio",
  unidadeId: "sites-estilos-u5",
  titulo: "Criar o Meu tema",
  conceitos: ["variavel-css", "salvar-como-meu-tema"],
  revisa: [],
  prerequisitos: ["variavel-css", "salvar-como-meu-tema"],
  usaFerramentas: ["painel-estilos", "editar-valor-css", "seletor-de-cor", "salvar-tema"],
  paineisElementos: ["estilos"],
  siteAlvo: SITE_ALVO_DO_JOGO,

  introducao: [
    { texto: "Hora do desafio: um tema seu, do zero, para o jogo inteiro.", expressao: "feliz" },
    { texto: "Sem passo a passo: escolha as cores, mude quantas variáveis quiser e salve como Meu tema.", expressao: "curioso" },
    { texto: "Travou? O Rever leva de volta para a fase onde aquilo foi ensinado.", expressao: "apontando" },
  ],

  partes: [
    {
      id: "primaria-nova",
      descricao: "Trocar --cor-primaria por uma cor sua",
      validador: { tipo: "variavelCss", nome: "--cor-primaria", diferenteDoInicial: true },
      revisarEm: "sites-estilos-u5-f1",
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ":root", propriedade: "--cor-primaria", valor: "#c2410c" }],
    },
    {
      id: "fundo-novo",
      descricao: "Trocar --cor-fundo por uma cor sua",
      validador: { tipo: "variavelCss", nome: "--cor-fundo", diferenteDoInicial: true },
      revisarEm: "sites-estilos-u5-f1",
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ":root", propriedade: "--cor-fundo", valor: "#1c1917" }],
    },
    {
      id: "texto-novo",
      descricao: "Trocar --cor-texto por uma cor sua",
      validador: { tipo: "variavelCss", nome: "--cor-texto", diferenteDoInicial: true },
      revisarEm: "sites-estilos-u5-f1",
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ":root", propriedade: "--cor-texto", valor: "#fafaf9" }],
    },
    {
      id: "tema-salvo",
      descricao: "Salvar o conjunto como Meu tema",
      validador: { tipo: "temaSalvo" },
      revisarEm: "sites-estilos-u5-f3",
      solucaoDeTeste: [{ tipo: "salvarTema" }],
    },
  ],

  conclusao: [
    { texto: "Meu tema pronto! Cores suas, do :root até o botão de salvar.", expressao: "comemorando" },
    { texto: "É a mesma ideia dos sites que deixam trocar entre claro e escuro: um conjunto de variáveis, e um botão para trocar.", expressao: "feliz" },
  ],
  missaoDeCampo: "Abra o Meu tema (menu do mapa) fora desta fase e mexa mais um pouco nas cores, sem pressa.",
  falaFinal: { texto: "Zona Estilos completa! Agora vem a Responsivo: ver o site em outros tamanhos de tela.", expressao: "feliz" },
};
