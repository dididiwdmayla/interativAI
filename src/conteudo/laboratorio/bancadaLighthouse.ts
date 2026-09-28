/*
 * Bancada do Lighthouse: fase de LABORATÓRIO do motor, fora do currículo
 * (só no /lab/fases?fase=lab-motor-u1-f5). Uma página com um problema de
 * cada verificação da auditoria simplificada (src/motor/auditoria.ts):
 * imagem sem alt, texto apagado, título pulando nível, link e botão sem
 * texto, sem main, id repetido, sem descrição e "clique aqui". No modo
 * documento, para o head também dar para consertar (o documento inteiro
 * começa com <html lang="pt-BR">, então o idioma já vem certo).
 *
 * Mostra os validadores da aba: `semProblema` (uma verificação) e
 * `notaAuditoria` (a nota de uma categoria).
 */
import type { FasePratica } from "../tipos";

export const SITE_BANCADA_LIGHTHOUSE = {
  url: "farol.motor.site",
  titulo: "Bancada do Lighthouse",
  head: `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pousada Maré Mansa</title>
<style>
  body { font-family: Verdana, sans-serif; margin: 0; color: #22313f; background: #fdfbf7; }
  header, #conteudo, footer { padding: 16px; }
  .foto { display: block; width: 100%; max-width: 320px; height: 120px; background: #9fd3e6; }
  .rodape { color: #c9c3b8; }
  .menu, .icone { display: inline-block; width: 32px; height: 32px; background: #22313f; border: 0; border-radius: 8px; }
</style>`,
  body: `<header>
  <h1>Pousada Maré Mansa</h1>
  <button class="menu" type="button"></button>
</header>
<div id="conteudo">
  <img class="foto" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">
  <h4 id="quartos">Nossos quartos</h4>
  <p id="quartos">Quartos com vista para o mar e café da manhã.</p>
  <p>Para reservar, <a href="#contato">clique aqui</a>.</p>
</div>
<footer id="contato">
  <a class="icone" href="https://exemplo.site/mapa"></a>
  <p class="rodape">Rua das Conchas, 12. Aberto o ano todo.</p>
</footer>`,
};

export const FASE_BANCADA_LIGHTHOUSE: FasePratica = {
  id: "lab-motor-u1-f5",
  tipo: "pratica",
  unidadeId: "lab-motor-u1",
  titulo: "Bancada do Lighthouse",
  conceitos: ["elemento"],
  revisa: [],
  prerequisitos: [],
  usaFerramentas: ["arvore", "editor", "editar-duplo-clique", "adicionar-atributo", "renomear-tag", "lighthouse", "modo-dispositivo", "girar-dispositivo"],
  apresentar: ["arvore", "editor", "editar-duplo-clique", "adicionar-atributo", "renomear-tag", "lighthouse", "modo-dispositivo", "girar-dispositivo"],
  modoDocumento: true,
  introducao: [{ texto: "Bancada do Lighthouse: uma página com um problema de cada tipo. Analise e conserte.", expressao: "curioso" }],
  siteAlvo: SITE_BANCADA_LIGHTHOUSE,
  objetivos: [
    {
      id: "analisar",
      tipo: "acao",
      modo: "guiado",
      enunciado: { mouse: "Abra a aba Lighthouse e clique em Analisar.", toque: "Abra a aba Lighthouse e toque em Analisar." },
      validador: { tipo: "evento", evento: "auditou" },
      ajudas: {
        pergunta: "Onde fica a auditoria da página?",
        dica: "É a última aba lá em cima no painel: Lighthouse.",
        linha: { alvo: "ferramenta", ferramenta: "lighthouse", fala: "Aqui." },
        solucao: { fala: "Rodei a análise: as notas apareceram.", acoes: [{ tipo: "analisarAuditoria" }] },
      },
      falaAoConcluir: { texto: "Notas na tela!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "analisarAuditoria" }],
    },
    {
      id: "alt-da-foto",
      tipo: "acao",
      modo: "guiado",
      enunciado: { mouse: "Ponha um alt na foto da pousada.", toque: "Ponha um alt na foto da pousada." },
      validador: { tipo: "semProblema", regra: "imagem-sem-alt" },
      ajudas: {
        pergunta: "Qual atributo descreve uma imagem para quem não vê?",
        dica: "O alt, pelo Adicionar atributo do menu do nó.",
        linha: { alvo: "arvore", seletor: ".foto", fala: "A foto." },
        solucao: {
          fala: "Pus alt na foto.",
          acoes: [{ tipo: "adicionarAtributo", seletor: ".foto", nome: "alt", valor: "Fachada azul da pousada" }],
        },
      },
      falaAoConcluir: { texto: "Foto descrita!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "adicionarAtributo", seletor: ".foto", nome: "alt", valor: "Fachada azul da pousada" }],
    },
    {
      id: "acessibilidade-90",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Conserte o resto até a Acessibilidade passar de 90.",
        toque: "Conserte o resto até a Acessibilidade passar de 90.",
      },
      validador: { tipo: "notaAuditoria", categoria: "acessibilidade", minimo: 90 },
      ajudas: {
        pergunta: "O que a lista do Lighthouse ainda aponta?",
        dica: "Contraste (o rodapé e o texto do botão), título, link, botão e o main.",
        linha: { alvo: "ferramenta", ferramenta: "lighthouse", fala: "A lista está aqui." },
        solucao: {
          fala: "Consertei tudo o que a lista apontava.",
          acoes: [
            { tipo: "adicionarAtributo", seletor: ".rodape", nome: "style", valor: "color: #4a4a4a" },
            { tipo: "renomearTag", seletor: "h4#quartos", novaTag: "h2" },
            { tipo: "definirTexto", seletor: ".icone", valor: "Mapa" },
            { tipo: "definirTexto", seletor: ".menu", valor: "Menu" },
            { tipo: "adicionarAtributo", seletor: ".menu", nome: "style", valor: "color: #ffffff" },
            { tipo: "renomearTag", seletor: "#conteudo", novaTag: "main" },
          ],
        },
      },
      falaAoConcluir: { texto: "Acessibilidade verde!", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "adicionarAtributo", seletor: ".rodape", nome: "style", valor: "color: #4a4a4a" },
        { tipo: "renomearTag", seletor: "h4#quartos", novaTag: "h2" },
        { tipo: "definirTexto", seletor: ".icone", valor: "Mapa" },
        { tipo: "definirTexto", seletor: ".menu", valor: "Menu" },
        { tipo: "adicionarAtributo", seletor: ".menu", nome: "style", valor: "color: #ffffff" },
        { tipo: "renomearTag", seletor: "#conteudo", novaTag: "main" },
      ],
    },
  ],
  conclusao: [{ texto: "Bancada do Lighthouse testada.", expressao: "feliz" }],
  falaFinal: { texto: "Pode continuar consertando.", expressao: "feliz" },
};
