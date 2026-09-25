/*
 * TEMPLATE ANOTADO DE FASE
 *
 * Copie este arquivo para a pasta da unidade (ex.:
 * src/conteudo/ilhas/sites/elementos/unidade-3/fase-1-nome.ts), troque o
 * nome da constante e preencha. Leia antes o docs/GUIA-DE-CONTEUDO.md.
 *
 * Este arquivo compila de verdade (o `npm run build` confere os tipos),
 * mas NÃO está registrado no jogo. Para uma fase entrar no jogo, ela vai
 * no `unidade.ts` da unidade, e a unidade no `src/conteudo/index.ts`.
 *
 * Tudo aqui é dado: nada de função, nada de lógica. Se sentir falta de
 * algo que os validadores e ações não fazem, leia a seção "Validador
 * custom" do guia antes de inventar.
 */
import type { FaseDesafio, FasePratica } from "@/conteudo/tipos";

/*
 * O site-alvo mora num arquivo próprio em `sites/` (a única exceção à
 * regra das cores). Aqui ele vem inline só para o template ficar sozinho.
 */
const SITE_EXEMPLO = {
  url: "exemplo.site",
  titulo: "Site de exemplo",
  head: `<meta charset="utf-8"><title>Exemplo</title><style>body { margin: 0; }</style>`,
  body: `<header id="topo">Topo</header>
<main>
  <section id="lista">
    <article class="card" id="card-um"><h3>Um</h3><p>Texto um</p></article>
    <article class="card" id="card-dois"><h3>Dois</h3><p>Texto dois</p></article>
  </section>
</main>
<footer id="rodape">Rodapé</footer>`,
};

/*
 * No topo de cada fase de verdade, escreva um comentário com:
 * - O QUE ENSINA (os conceitos, em palavras de gente);
 * - REVISÃO ESPAÇADA (o que de antes entra misturado na tarefa);
 * - POR QUE ESTA ORDEM (cada objetivo, e o que o sozinho muda).
 * Veja os arquivos da Unidade 2 como modelo.
 */
export const TEMPLATE_PRATICA: FasePratica = {
  // "<ilha>-<zona>-u<unidade>-f<fase>". Nunca mude o id depois de publicado:
  // o progresso salvo do jogador usa ele.
  id: "sites-elementos-u9-f1",
  tipo: "pratica",
  unidadeId: "sites-elementos-u9",
  // Até 40 caracteres, jeito de título de episódio.
  titulo: "Nome curto e animado",

  // Conceitos que esta fase ENSINA (um objetivo guiado para cada, no mínimo).
  // Todos precisam existir em src/conteudo/conceitos.ts.
  conceitos: ["duplicar-elemento"],
  // Opcional: conceitos já ensinados (com guiado) numa fase ANTERIOR que
  // aqui voltam só para treinar sozinho. Fase só de sozinho (exceção, ver
  // o guia) deixa `conceitos: []` e põe tudo aqui.
  // pratica: ["editar-texto"],
  // Conceitos de fases ANTERIORES que voltam misturados na tarefa.
  revisa: ["editar-texto"],
  // O que o jogador já precisa saber (ensinado antes).
  prerequisitos: ["selecionar-pela-arvore"],

  // Toda ferramenta que a fase usa, inclusive nas soluções. Cada uma precisa
  // ter sido apresentada nesta fase (campo `apresentar`) ou antes.
  usaFerramentas: ["painel", "previa", "me-ajuda", "tutor", "arvore", "editar-duplo-clique", "duplicar"],
  // Ferramentas apresentadas logo depois da introdução (raro: prefira
  // apresentar no objetivo que usa a ferramenta pela primeira vez).
  apresentar: [],
  siteAlvo: SITE_EXEMPLO,

  // 2 ou 3 falas, até 160 caracteres cada: o gancho, o conceito do dia em
  // uma comparação do dia a dia, e o convite.
  introducao: [
    { texto: "Abertura animada que diz onde estamos e o que vai acontecer.", expressao: "feliz" },
    { texto: "O conceito do dia numa comparação do dia a dia, sem jargão solto.", expressao: "pensativo" },
    { texto: "Um convite curto para começar. Bora?", expressao: "curioso" },
  ],

  objetivos: [
    {
      // Único na fase, kebab-case.
      id: "duplicar-card",
      tipo: "acao",
      // Guiado: primeiro contato com a habilidade, com os 4 degraus de ajuda.
      modo: "guiado",
      // Até 140 caracteres. "mouse" fala em clicar; "toque" fala em tocar.
      enunciado: {
        mouse: "Duplique o primeiro card (botão direito nele, na árvore) e troque o título da cópia.",
        toque: "Duplique o primeiro card (toque nele e em Duplicar) e troque o título da cópia.",
      },
      // Apresenta a ferramenta nova exatamente quando ela faz falta.
      apresentar: ["duplicar"],
      // Validadores: veja a tabela no guia. Âncoras naturais (#id, .classe),
      // nada de posição (:nth-child).
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "contagem", seletor: "#lista .card", op: ">=", valor: 3 },
          { tipo: "textoDiferenteDoInicial", seletor: ".card h3" },
        ],
      },
      ajudas: {
        // Degrau 1: pergunta que faz pensar e NÃO entrega a resposta.
        pergunta: "Se você copiar a caixa inteira do card, o que vem junto com ela?",
        // Degrau 2: o conceito, em uma ou duas frases.
        dica: "Duplicar copia a peça com tudo o que tem dentro e põe a cópia logo depois da original.",
        // Degrau 3 (só guiado): mostra ONDE. Fala neutra (sem "clique"): ela
        // não tem versão de toque.
        linha: {
          alvo: "arvore",
          seletor: "#card-um",
          fala: "Esse card piscando é o primeiro. Duplique ele e troque o título da cópia.",
        },
        // Degrau 4 (só guiado, custa 1 estrela): faz e explica O QUE e POR QUÊ.
        solucao: {
          fala: "Dupliquei o card e troquei o título da cópia: a cópia nasce logo depois da original.",
          acoes: [
            { tipo: "duplicar", seletor: "#card-um" },
            // "$0" é o selecionado (depois de duplicar, a cópia).
            { tipo: "definirTexto", seletor: "$0 h3", valor: "Um título novo" },
          ],
        },
      },
      falaAoConcluir: { texto: "Comemora o que ele fez e dá nome ao conceito.", expressao: "comemorando" },
      // Obrigatória: o teste aplica isto e confere que o validador passa.
      solucaoDeTeste: [
        { tipo: "duplicar", seletor: "#card-um" },
        { tipo: "definirTexto", seletor: "$0 h3", valor: "Um título novo" },
      ],
    },
    {
      id: "prever-duplicar",
      // Previsão: o jogador dá um palpite antes, depois faz e vê acontecer.
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        // Até 160 caracteres. Uma pergunta concreta sobre o que VAI acontecer.
        pergunta: "Palpite: se duplicar o segundo card, onde a cópia vai aparecer?",
        // 2 a 4 opções curtas (até 80), todas plausíveis.
        opcoes: ["No fim da página", "Logo depois do segundo card", "No lugar do primeiro card"],
        correta: 1,
        // Até 160: o porquê da certa. Aparece acertando ou errando.
        explicacao: "A cópia nasce logo depois da original, dentro do mesmo pai. Por isso elas viram irmãs.",
      },
      // O enunciado aparece depois do palpite: é a ação para conferir.
      enunciado: {
        mouse: "Agora confira: duplique o segundo card e veja onde a cópia aparece.",
        toque: "Agora confira: duplique o segundo card e veja onde a cópia aparece.",
      },
      validador: { tipo: "contagem", seletor: "#lista .card", op: ">=", valor: 4 },
      ajudas: {
        pergunta: "Qual card é o segundo na árvore?",
        dica: "Duplicar vale para qualquer elemento: selecione o card e use Duplicar.",
        linha: { alvo: "arvore", seletor: "#card-dois", fala: "Esse é o segundo card. Duplique ele." },
        // A solução do "Me ajuda" NÃO responde a previsão (o jogador já respondeu).
        solucao: { fala: "Dupliquei o segundo card: a cópia apareceu logo depois dele.", acoes: [{ tipo: "duplicar", seletor: "#card-dois" }] },
      },
      falaAoConcluir: { texto: "Viu? Logo depois da original. Esse é o jeito do F12.", expressao: "comemorando" },
      // Numa previsão, a solucaoDeTeste COMEÇA respondendo.
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "duplicar", seletor: "#card-dois" },
      ],
    },
    {
      id: "duplicar-sozinho",
      tipo: "acao",
      // Sozinho: a MESMA habilidade numa situação diferente, com ajuda limitada.
      modo: "sozinho",
      // Mais curto, sem dizer qual ferramenta nem onde clicar. Sem o prefixo
      // "Sozinho:" (o selo já aparece na tela).
      enunciado: {
        mouse: "Deixe a lista com dois cards novos, cada um com um título diferente.",
        toque: "Deixe a lista com dois cards novos, cada um com um título diferente.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "contagem", seletor: "#lista .card", op: ">=", valor: 6 },
          { tipo: "textoDiferenteDoInicial", seletor: ".card h3", minimo: 2 },
        ],
      },
      // Sozinho só tem pergunta e dica. Linha e solução são proibidas.
      ajudas: {
        pergunta: "Depois de duplicar, qual card fica selecionado?",
        dica: "Cada cópia é uma irmã nova. Troque o título de cada uma com dois cliques.",
      },
      falaAoConcluir: { texto: "Fez tudo sem passo a passo! Lista cheia e cada título diferente.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "duplicar", seletor: "#card-dois" },
        { tipo: "definirTexto", seletor: "$0 h3", valor: "Outro título" },
        { tipo: "duplicar", seletor: "#card-dois" },
        { tipo: "definirTexto", seletor: "$0 h3", valor: "Mais um título" },
      ],
    },
  ],

  // 2 falas: comemora e liga ao F12 de verdade.
  conclusao: [
    { texto: "Comemoração do que ele aprendeu na fase.", expressao: "comemorando" },
    { texto: "Como isso funciona no F12 de verdade, com o atalho quando houver.", expressao: "feliz" },
  ],
  // Até 320 caracteres: algo para fazer num site real, lembrando que só ele vê.
  missaoDeCampo: "Num site de verdade, aperte F12 e faça a mesma coisa. Só você vê, e tudo volta ao recarregar.",
  // Última fala, depois da missão: uma curiosidade ou um desafio extra.
  falaFinal: { texto: "Uma curiosidade ou desafio extra para ele pensar depois.", expressao: "curioso" },
};

/*
 * O desafio da unidade: um site DIFERENTE, sem passo a passo, com um
 * checklist de partes. Sempre a última fase da unidade, e o `meta.desafioId`
 * da unidade aponta para ele.
 */
export const TEMPLATE_DESAFIO: FaseDesafio = {
  id: "sites-elementos-u9-f4",
  tipo: "desafio",
  unidadeId: "sites-elementos-u9",
  titulo: "Nome do site do desafio",
  // No desafio, `conceitos` é o que ele PRATICA (tudo ensinado antes na unidade).
  conceitos: ["duplicar-elemento"],
  revisa: ["editar-texto"],
  prerequisitos: ["duplicar-elemento"],
  // Nada de ferramenta nova no desafio (e nada de `apresentar`).
  usaFerramentas: ["painel", "previa", "me-ajuda", "tutor", "arvore", "editar-duplo-clique", "duplicar"],
  siteAlvo: SITE_EXEMPLO,
  introducao: [
    { texto: "Chegou o desafio! Quem pediu ajuda e por quê.", expressao: "feliz" },
    { texto: "Sem passo a passo: o checklist marca cada parte sozinho.", expressao: "curioso" },
    { texto: "Travou? O Rever leva de volta para a fase onde aquilo foi ensinado.", expressao: "apontando" },
  ],
  // Uma parte por habilidade da unidade. A validação do desafio é a soma delas.
  partes: [
    {
      id: "duplicar-card",
      // Até 140. Diz O QUE deixar pronto, nunca COMO.
      descricao: "Duplicar um card e dar um título novo à cópia",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "contagem", seletor: "#lista .card", op: ">=", valor: 3 },
          { tipo: "textoDiferenteDoInicial", seletor: ".card h3" },
        ],
      },
      // Fase da MESMA unidade onde isso foi ensinado: abre no "Rever".
      revisarEm: "sites-elementos-u9-f1",
      // Obrigatória: testes, /lab/fases e o "depois" da meta usam isto.
      solucaoDeTeste: [
        { tipo: "duplicar", seletor: "#card-um" },
        { tipo: "definirTexto", seletor: "$0 h3", valor: "Título do desafio" },
      ],
    },
  ],
  conclusao: [
    { texto: "Desafio vencido! O que ele fez, sem passo a passo.", expressao: "comemorando" },
    { texto: "Tudo o que a unidade ensinou, ligado ao F12 de verdade.", expressao: "feliz" },
  ],
  missaoDeCampo: "A faxina (ou a tarefa) num site real pelo F12, lembrando que só ele vê e tudo volta ao recarregar.",
  falaFinal: { texto: "Um fecho animado para a unidade.", expressao: "comemorando" },
};
