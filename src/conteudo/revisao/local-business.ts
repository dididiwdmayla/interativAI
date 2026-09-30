/*
 * Revisão: LocalBusiness e subtipos (S3, Fase 4).
 *
 * Uma ação (trocar o tipo genérico de uma clínica de dentista pelo subtipo
 * Dentist) e uma previsão sobre o subtipo mais específico.
 */
import type { ItemRevisao } from "../tipos";
import { cabecaComTitulo } from "./sites/cabecas";

export const ITENS_LOCAL_BUSINESS: ItemRevisao[] = [
  {
    id: "local-business-1",
    conceito: "local-business",
    tipo: "acao",
    enunciado: {
      mouse: "Este bloco descreve uma clínica de dentista como LocalBusiness. Troque o tipo pelo subtipo mais específico.",
      toque: "Este bloco descreve uma clínica de dentista como LocalBusiness. Troque o tipo pelo subtipo mais específico (no Código).",
    },
    siteAlvo: {
      url: "sorrisosereno.exemplo",
      titulo: "Clínica Sorriso Sereno",
      head: cabecaComTitulo("Clínica Sorriso Sereno | Dentista em Curitiba", `<script id="dados" type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Clínica Sorriso Sereno",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua das Palmeiras, 40",
    "addressLocality": "Curitiba"
  }
}
</script>`),
      body: `<h1>Clínica Sorriso Sereno</h1>
<p>Limpeza, clareamento e ortodontia.</p>`,
    },
    modoDocumento: true,
    validador: { tipo: "dadosEstruturados", tipoSchema: "Dentist", campos: ["name", "address.streetAddress"] },
    ajudas: {
      pergunta: "Existe um tipo só para dentista? Como ele se chama na schema.org?",
      dica: "O subtipo é Dentist. Troque o valor de \"@type\", mantendo as aspas.",
    },
    solucaoDeTeste: [
      {
        tipo: "definirTexto",
        seletor: "#dados",
        valor: `{
  "@context": "https://schema.org",
  "@type": "Dentist",
  "name": "Clínica Sorriso Sereno",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua das Palmeiras, 40",
    "addressLocality": "Curitiba"
  }
}`,
      },
    ],
  },
  {
    id: "local-business-2",
    conceito: "local-business",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "lojapatasepelos.exemplo",
      titulo: "Loja Patas e Pelos",
      body: `<h1>Loja Patas e Pelos</h1>
<p>Ração, brinquedos e acessórios para cães e gatos.</p>`,
    },
    previsao: {
      pergunta: "Qual é o tipo mais específico, na schema.org, para uma loja que vende artigos para animais?",
      opcoes: ["LocalBusiness", "Bakery", "PetStore"],
      correta: 2,
      explicacao: "PetStore é um subtipo de loja (Store), mais específico que LocalBusiness. A recomendação é usar sempre o mais específico que existir.",
    },
    ajudas: {
      pergunta: "Qual das três opções tem a ver com animais?",
      dica: "O nome do tipo é em inglês: pet é animal de estimação, store é loja.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
