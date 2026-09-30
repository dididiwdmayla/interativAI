/*
 * S5, Fase 3: "A página que decide" (Doceria Casa de Bolo, modo documento).
 * Simulador de campanha com a página fraca (o anúncio já está em 1º lugar,
 * caro e com pouco cliente).
 *
 * O QUE ENSINA: a página de destino (a página onde a pessoa cai depois do
 * clique) decide quantos cliques viram clientes e quanto cada cliente custa:
 * uma página melhor barateia o cliente. E o Índice de qualidade: um
 * diagnóstico (1 a 10, por palavra-chave) que NÃO entra no leilão, em três
 * partes (taxa de cliques esperada, relevância do anúncio e experiência na
 * página de destino). NUNCA dizer que o Índice de qualidade é multiplicado
 * no leilão. A qualidade do simulador é uma simplificação nossa.
 *
 * REVISA: o Resultado na busca e o Lighthouse (S1, S2 e P1): title e
 * description, e o alt da foto.
 *
 * ORDEM: 1) guiado, com previsão sobre o Índice de qualidade: analisar a
 * página no Lighthouse; 2) guiado, com previsão "mais lance ajuda?": title e
 * description até a nota passar de 80; 3) sozinho: o alt da foto, até o
 * custo por cliente cair a R$ 20 ou menos.
 */
import type { DadosCampanha } from "@/motor/campanha";
import type { FaseSimuladorCampanha } from "@/conteudo/tipos";
import { DOCERIA_CASA_DE_BOLO } from "./sites/doceriaCasaDeBolo";

export const CAMPANHA_S5_F3: DadosCampanha = {
  anunciante: "Doceria Casa de Bolo",
  palavras: [
    { id: "bolo-de-pote", texto: "bolo de pote em Recife", buscasPorDia: 2000, cpcMedio: 1.8, concorrencia: "alta" },
    { id: "doces-para-festa", texto: "doces para festa", buscasPorDia: 700, cpcMedio: 1.1, concorrencia: "media" },
    { id: "brigadeiro-gourmet", texto: "brigadeiro gourmet", buscasPorDia: 350, cpcMedio: 0.6, concorrencia: "baixa" },
  ],
  concorrentes: [
    { nome: "Doces Mega", lance: 2.2, qualidade: 6 },
    { nome: "Bolos Express", lance: 1.5, qualidade: 8 },
    { nome: "Confeitaria Sabor", lance: 1.8, qualidade: 5 },
  ],
  orcamentoInicial: 200,
  palavraInicial: "bolo-de-pote",
  lanceInicial: 4,
};

const TITULO_E_DESCRICAO = {
  tipo: "inserirHTML" as const,
  seletor: "meta[name=viewport]",
  posicao: "depois" as const,
  html: '<title>Doceria Casa de Bolo | Bolos de pote e doces em Recife</title>\n<meta name="description" content="Bolos de pote e doces para festa feitos por encomenda em Recife. Peça pelo WhatsApp e receba o orçamento na hora.">',
};

export const FASE_S5_F3: FaseSimuladorCampanha = {
  id: "sites-ser-encontrado-u5-f3",
  tipo: "simulador-campanha",
  unidadeId: "sites-ser-encontrado-u5",
  titulo: "A página que decide",
  conceitos: ["pagina-de-destino", "indice-de-qualidade"],
  revisa: ["titulo-na-busca", "descricao-na-busca", "auditoria-lighthouse"],
  prerequisitos: ["leilao-de-anuncio", "conversao", "auditoria-lighthouse"],
  usaFerramentas: ["simulador-campanha", "lighthouse", "resultado-busca", "arvore", "editor", "adicionar-atributo"],
  modoDocumento: true,
  siteAlvo: DOCERIA_CASA_DE_BOLO,
  campanha: CAMPANHA_S5_F3,
  introducao: [
    { texto: "A Doceria Casa de Bolo já está em 1º lugar, pagando caro, e vem pouco cliente. Olhe o que o painel diz da página de destino.", expressao: "pensativo" },
    { texto: "Página de destino é a página onde a pessoa cai depois do clique. Se ela é ruim, o dinheiro do clique vai embora.", expressao: "apontando" },
  ],
  objetivos: [
    {
      id: "diagnostico-da-pagina",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "O Índice de qualidade do Google (1 a 10) é multiplicado pelo lance no leilão?",
        opcoes: ["Sim: é a nota que multiplica o lance", "Não: é só um diagnóstico do anúncio e da página", "Só nas palavras mais caras"],
        correta: 1,
        explicacao: "O Índice de qualidade é uma ferramenta de diagnóstico e não entra no leilão. Ele mostra onde você está fraco. A qualidade daqui é só uma simplificação.",
      },
      enunciado: {
        mouse: "Na aba Lighthouse, analise a página de destino da doceria e veja o que ela precisa melhorar.",
        toque: "Na aba Lighthouse, analise a página de destino da doceria e veja o que ela precisa melhorar.",
      },
      validador: { tipo: "evento", evento: "auditou" },
      ajudas: {
        pergunta: "Um diagnóstico serve para quê: para pagar mais ou para descobrir o que consertar?",
        dica: "A análise do Lighthouse lista o que falta na página. É parecido com uma das três partes do diagnóstico do Google: a experiência na página de destino.",
        linha: { alvo: "ferramenta", ferramenta: "lighthouse", fala: "A análise da página é feita aqui. Aperte Analisar." },
        solucao: { fala: "Analisei a página: o Lighthouse mostra o que consertar. É a lista de tarefas da próxima etapa.", acoes: [{ tipo: "analisarAuditoria" }] },
      },
      falaAoConcluir: { texto: "Diagnóstico feito. Repare que faltam title, descrição e alt: coisas que o programador conserta.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }, { tipo: "analisarAuditoria" }],
    },
    {
      id: "melhorar-a-busca-da-pagina",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Primeiro lugar, R$ 66 por cliente e quase nenhum cliente. O que mais ajuda?",
        opcoes: ["Subir mais o lance", "Trocar de palavra-chave", "Melhorar a página de destino"],
        correta: 2,
        explicacao: "A página decide quantos cliques viram clientes, e uma página melhor barateia o clique. Lance maior só compra a mesma página fraca.",
      },
      enunciado: {
        mouse: "Ponha title e meta description na página (pelo editor) até a nota da página passar de 80 na aba Campanha.",
        toque: "Ponha title e meta description na página (pelo Código) até a nota da página passar de 80 na aba Campanha.",
      },
      validador: { tipo: "simulacao", metrica: "notaPagina", op: ">=", valor: 80 },
      ajudas: {
        pergunta: "O que a aba Busca mostra hoje para esta página, e o que falta nela?",
        dica: "Faltam o title e a meta description no head. Escreva os dois falando de bolos de pote e de Recife, sem passar do espaço.",
        linha: { alvo: "ferramenta", ferramenta: "resultado-busca", fala: "A aba Busca mostra o que falta: título e descrição." },
        solucao: { fala: "Pus title e meta description: a nota da página subiu e o custo por cliente despencou, com o mesmo lance.", acoes: [TITULO_E_DESCRICAO] },
      },
      falaAoConcluir: { texto: "Página melhor, conversão maior. Olhe os clientes e o custo por cliente no dia simulado!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }, TITULO_E_DESCRICAO],
    },
    {
      id: "alt-e-custo-por-cliente",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "A foto está sem alt. Consiga um custo por cliente de R$ 20 ou menos, com o mesmo lance e a mesma verba.",
        toque: "A foto está sem alt. Consiga um custo por cliente de R$ 20 ou menos, com o mesmo lance e a mesma verba.",
      },
      validador: { tipo: "simulacao", metrica: "custoPorCliente", op: "<=", valor: 20 },
      ajudas: {
        pergunta: "O que o Lighthouse diz da foto? Isso pesa na nota da página?",
        dica: "Adicione o atributo alt na foto (pelo menu da tag, na árvore) e olhe o custo por cliente na aba Campanha.",
      },
      falaAoConcluir: { texto: "Custo por cliente lá embaixo, com o mesmo lance e a mesma verba. Fez sozinho!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "adicionarAtributo", seletor: ".foto", nome: "alt", valor: "Potes de bolo com cobertura de brigadeiro" }],
    },
  ],
  conclusao: [
    { texto: "O Índice de qualidade (1 a 10, por palavra-chave) NÃO é multiplicado no leilão: é só um diagnóstico. A qualidade daqui é uma simplificação nossa.", expressao: "pensativo" },
    { texto: "Ele compara você, nos últimos 90 dias, com outros anunciantes da mesma palavra, em três partes.", expressao: "curioso" },
    { texto: "Taxa de cliques esperada, relevância do anúncio e experiência na página de destino: cada uma acima da média, na média ou abaixo (conferido em 30/09/2026).", expressao: "apontando" },
  ],
  missaoDeCampo:
    "Abra a página de um negócio local que você conhece e olhe como se fosse o cliente vindo de um anúncio: ela abre rápido? Diz logo o que o negócio faz? Tem um jeito claro de pedir? Anote o que melhoraria.",
  falaFinal: { texto: "Hora do desafio: a mesma verba, mais clientes.", expressao: "comemorando" },
};
