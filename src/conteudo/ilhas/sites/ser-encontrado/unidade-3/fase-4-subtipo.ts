/*
 * S3, Fase 4: "O tipo certo de negócio" (Guia do bairro Boa Vista, modo
 * documento).
 *
 * O QUE ENSINA: LocalBusiness e seus subtipos: a recomendação é usar o
 * subtipo mais específico que existir (IceCreamShop, Bakery, Plumber...).
 * Os subtipos vêm da schema.org (conferido em 30/09/2026, no ANEXO do
 * prompt; a lista do validador está em src/motor/busca.ts).
 *
 * REVISA: dados estruturados (a Fase 3).
 *
 * ORDEM: 1) guiado, com previsão: a sorveteria vira IceCreamShop; 2)
 * sozinho, o encanador (Plumber), num segundo bloco da mesma página (é um
 * guia com dois negócios).
 */
import type { FasePratica } from "@/conteudo/tipos";
import { GUIA_BOA_VISTA } from "./sites/guiaBoaVista";

const SORVETERIA = `{
  "@context": "https://schema.org",
  "@type": "IceCreamShop",
  "name": "Sorveteria Gelato Bello",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Praça da Boa Vista, 8",
    "addressLocality": "Recife"
  },
  "telephone": "(81) 3555-0120"
}`;

const ENCANADOR = `{
  "@context": "https://schema.org",
  "@type": "Plumber",
  "name": "Hidráulica Seu Nilo",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua do Cais, 77",
    "addressLocality": "Recife"
  },
  "telephone": "(81) 3555-0177"
}`;

export const FASE_S3_F4: FasePratica = {
  id: "sites-ser-encontrado-u3-f4",
  tipo: "pratica",
  unidadeId: "sites-ser-encontrado-u3",
  titulo: "O tipo certo de negócio",
  conceitos: ["local-business"],
  revisa: ["dados-estruturados"],
  prerequisitos: ["dados-estruturados"],
  usaFerramentas: ["dados-estruturados", "arvore", "editor", "editar-duplo-clique"],
  modoDocumento: true,
  siteAlvo: GUIA_BOA_VISTA,
  introducao: [
    { texto: "LocalBusiness é o tipo geral de negócio local. A recomendação é usar o subtipo mais específico que existir.", expressao: "pensativo" },
    { texto: "Sorveteria é IceCreamShop, padaria é Bakery, encanador é Plumber. Este guia do bairro tem dois negócios, os dois ainda genéricos.", expressao: "curioso" },
  ],
  objetivos: [
    {
      id: "sorveteria-especifica",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "A sorveteria está como LocalBusiness. O que é melhor para descrever ela?",
        opcoes: ["Trocar por IceCreamShop, que diz exatamente o que ela é", "Manter LocalBusiness, que serve para tudo", "Trocar por Store, que também serve para tudo"],
        correta: 0,
        explicacao: "O subtipo mais específico diz o que o negócio é sem a busca ter que adivinhar. IceCreamShop é um tipo de estabelecimento de comida.",
      },
      enunciado: {
        mouse: "No primeiro bloco (Sorveteria Gelato Bello), troque o tipo LocalBusiness por IceCreamShop, pelo editor de código.",
        toque: "No primeiro bloco (Sorveteria Gelato Bello), troque o tipo LocalBusiness por IceCreamShop, pelo Código.",
      },
      validador: { tipo: "dadosEstruturados", tipoSchema: "IceCreamShop", campos: ["name", "address.streetAddress"] },
      ajudas: {
        pergunta: "Qual palavra do bloco diz que tipo de negócio é aquele?",
        dica: "É o valor de \"@type\". Troque LocalBusiness pelo subtipo IceCreamShop, mantendo as aspas.",
        linha: { alvo: "arvore", seletor: "#dados-sorveteria", fala: "Este é o bloco da sorveteria. O tipo genérico está na linha do @type." },
        solucao: {
          fala: "Troquei o @type para IceCreamShop: o resto do bloco continua igual, mas agora o tipo diz exatamente o que a sorveteria é.",
          acoes: [{ tipo: "definirTexto", seletor: "#dados-sorveteria", valor: SORVETERIA }],
        },
      },
      falaAoConcluir: { texto: "IceCreamShop! O teste mostra o tipo novo. Mais específico, mais claro para a busca.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 0 },
        { tipo: "definirTexto", seletor: "#dados-sorveteria", valor: SORVETERIA },
      ],
    },
    {
      id: "encanador-especifico",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "O segundo bloco, da Hidráulica Seu Nilo, também está genérico. Use o subtipo que combina com um encanador.",
        toque: "O segundo bloco, da Hidráulica Seu Nilo, também está genérico. Use o subtipo que combina com um encanador.",
      },
      validador: { tipo: "dadosEstruturados", tipoSchema: "Plumber", campos: ["name", "address.streetAddress", "telephone"] },
      ajudas: {
        pergunta: "Como se diz encanador em inglês, o idioma dos tipos da schema.org?",
        dica: "Encanador é Plumber, um subtipo de negócio de casa e construção. Troque o @type do segundo bloco.",
      },
      falaAoConcluir: { texto: "Plumber! Cada negócio com o seu tipo. Fez sozinho!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "definirTexto", seletor: "#dados-encanador", valor: ENCANADOR }],
    },
  ],
  conclusao: [
    { texto: "Subtipo mais específico, sempre que existir: comida, beleza, saúde, casa e construção, carros, lojas. Cada grupo tem os seus.", expressao: "feliz" },
    { texto: "A lista de tipos mora na schema.org e cresce com o tempo (conferido em 30/09/2026). Se não achar o seu, use LocalBusiness.", expressao: "pensativo" },
  ],
  missaoDeCampo:
    "Pense em três negócios do seu bairro e procure, no site schema.org, o subtipo de LocalBusiness mais específico para cada um. Algum não tem um tipo só dele?",
  falaFinal: { texto: "Hora do desafio da unidade!", expressao: "comemorando" },
};
