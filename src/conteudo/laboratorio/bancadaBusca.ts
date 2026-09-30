/*
 * Bancada da Busca: fase de LABORATÓRIO do motor, fora do currículo (só no
 * /lab/fases?fase=lab-motor-u1-f6). Uma página de padaria no modo
 * documento, com o título longo demais (cortado na busca), sem meta
 * description, com um noindex esquecido e um bloco de dados estruturados
 * com JSON quebrado. Mostra a aba Busca (Resultado na busca e Teste de
 * dados estruturados) e os três validadores dela: `resultadoBusca`,
 * `indexavel` e `dadosEstruturados`.
 */
import type { FasePratica } from "../tipos";

const DADOS_CERTOS = `{
  "@context": "https://schema.org",
  "@type": "Bakery",
  "name": "Padaria Estrela",
  "address": { "@type": "PostalAddress", "streetAddress": "Rua das Flores, 10", "addressLocality": "Campinas", "addressRegion": "SP" },
  "telephone": "(19) 3000-0000",
  "openingHours": "Mo-Sa 06:00-20:00"
}`;

export const SITE_BANCADA_BUSCA = {
  url: "padariaestrela.motor.site",
  titulo: "Bancada da Busca",
  head: `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Padaria Estrela: pães, bolos, salgados, doces, cafés e encomendas para festas em Campinas</title>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Bakery",
  "name": "Padaria Estrela"
  "telephone": "(19) 3000-0000"
}
</script>
<style>
  body { font-family: Verdana, sans-serif; margin: 0; padding: 16px; color: #3b2a1a; background: #fff8ec; }
</style>`,
  body: `<h1>Padaria Estrela</h1>
<p>Pão francês saindo a cada hora, das 6h às 20h.</p>
<p>Rua das Flores, 10, Campinas.</p>`,
};

export const FASE_BANCADA_BUSCA: FasePratica = {
  id: "lab-motor-u1-f6",
  tipo: "pratica",
  unidadeId: "lab-motor-u1",
  titulo: "Bancada da Busca",
  conceitos: ["elemento"],
  revisa: [],
  prerequisitos: [],
  usaFerramentas: ["arvore", "editor", "editar-duplo-clique", "apagar", "resultado-busca", "dados-estruturados"],
  apresentar: ["arvore", "editor", "editar-duplo-clique", "apagar", "resultado-busca", "dados-estruturados"],
  modoDocumento: true,
  introducao: [{ texto: "Bancada da Busca: uma padaria que não aparece direito na busca.", expressao: "curioso" }],
  siteAlvo: SITE_BANCADA_BUSCA,
  objetivos: [
    {
      id: "tirar-noindex",
      tipo: "acao",
      modo: "guiado",
      enunciado: { mouse: "Tire o noindex do head para a página voltar à busca.", toque: "Tire o noindex do head para a página voltar à busca." },
      validador: { tipo: "indexavel", valor: true },
      ajudas: {
        pergunta: "Qual linha do head manda a busca ignorar a página?",
        dica: "A meta robots com noindex.",
        linha: { alvo: "editor", seletor: 'meta[name="robots"]', fala: "Esta linha." },
        solucao: { fala: "Apaguei a meta robots.", acoes: [{ tipo: "apagar", seletor: 'meta[name="robots"]' }] },
      },
      falaAoConcluir: { texto: "Voltou para a busca!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "apagar", seletor: 'meta[name="robots"]' }],
    },
    {
      id: "titulo-sem-corte",
      tipo: "acao",
      modo: "guiado",
      enunciado: { mouse: "Encurte o title até ele caber sem corte na busca.", toque: "Encurte o title até ele caber sem corte na busca." },
      validador: { tipo: "resultadoBusca", campo: "titulo", contem: "Padaria Estrela", semCorte: true },
      ajudas: {
        pergunta: "O que é mais importante dizer no começo do título?",
        dica: "O nome e o que a padaria é, em uns 50 caracteres.",
        linha: { alvo: "arvore", seletor: "title", parte: "texto", fala: "O texto do title." },
        solucao: { fala: "Encurtei o título.", acoes: [{ tipo: "definirTexto", seletor: "title", valor: "Padaria Estrela | Pães e bolos em Campinas" }] },
      },
      falaAoConcluir: { texto: "Título inteiro na busca!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "definirTexto", seletor: "title", valor: "Padaria Estrela | Pães e bolos em Campinas" }],
    },
    {
      id: "descricao",
      tipo: "acao",
      modo: "guiado",
      enunciado: { mouse: "Crie uma meta description que fale do pão quentinho.", toque: "Crie uma meta description que fale do pão quentinho." },
      validador: { tipo: "resultadoBusca", campo: "descricao", contem: "pão" },
      ajudas: {
        pergunta: "Sem description, o que a busca mostra embaixo do título?",
        dica: 'Um meta com name="description" e o texto no content, no head.',
        linha: { alvo: "editor", seletor: "title", fala: "Escreva perto do title." },
        solucao: {
          fala: "Pus a description.",
          acoes: [
            {
              tipo: "inserirHTML",
              seletor: "title",
              posicao: "depois",
              html: '<meta name="description" content="Pão francês saindo a cada hora, bolos caseiros e café coado. Rua das Flores, 10, Campinas.">',
            },
          ],
        },
      },
      falaAoConcluir: { texto: "Descrição no lugar!", expressao: "comemorando" },
      solucaoDeTeste: [
        {
          tipo: "inserirHTML",
          seletor: "title",
          posicao: "depois",
          html: '<meta name="description" content="Pão francês saindo a cada hora, bolos caseiros e café coado. Rua das Flores, 10, Campinas.">',
        },
      ],
    },
    {
      id: "dados-estruturados",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Conserte o JSON-LD: a vírgula que falta e o address que falta.",
        toque: "Conserte o JSON-LD: a vírgula que falta e o address que falta.",
      },
      validador: { tipo: "dadosEstruturados", tipoSchema: "LocalBusiness", campos: ["name", "address.streetAddress"] },
      ajudas: {
        pergunta: "O que o Teste de dados estruturados aponta?",
        dica: "A linha do erro de JSON e os obrigatórios name e address.",
        linha: { alvo: "ferramenta", ferramenta: "dados-estruturados", fala: "O teste está aqui." },
        solucao: {
          fala: "Troquei o bloco por um certo.",
          acoes: [
            { tipo: "apagar", seletor: 'script[type="application/ld+json"]' },
            { tipo: "inserirHTML", seletor: "title", posicao: "depois", html: `<script type="application/ld+json">${DADOS_CERTOS}</script>` },
          ],
        },
      },
      falaAoConcluir: { texto: "Cartão do negócio no mapa!", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "apagar", seletor: 'script[type="application/ld+json"]' },
        { tipo: "inserirHTML", seletor: "title", posicao: "depois", html: `<script type="application/ld+json">${DADOS_CERTOS}</script>` },
      ],
    },
  ],
  conclusao: [{ texto: "Bancada da Busca testada.", expressao: "feliz" }],
  falaFinal: { texto: "Pode continuar mexendo.", expressao: "feliz" },
};
