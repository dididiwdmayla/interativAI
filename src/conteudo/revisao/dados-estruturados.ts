/*
 * Revisão: dados estruturados (S3, Fase 3).
 *
 * Uma ação (consertar um JSON-LD com vírgula sobrando, no modo documento, com
 * o Teste de dados estruturados) e uma previsão sobre para que serve o bloco.
 */
import type { ItemRevisao } from "../tipos";
import { cabecaComTitulo } from "./sites/cabecas";

export const ITENS_DADOS_ESTRUTURADOS: ItemRevisao[] = [
  {
    id: "dados-estruturados-1",
    conceito: "dados-estruturados",
    tipo: "acao",
    enunciado: {
      mouse: "O JSON do bloco de dados do estúdio tem um erro. Conserte no editor de código até o teste ler o nome e o telefone.",
      toque: "O JSON do bloco de dados do estúdio tem um erro. Conserte no Código até o teste ler o nome e o telefone.",
    },
    siteAlvo: {
      url: "estudioraiodesol.exemplo",
      titulo: "Estúdio Raio de Sol",
      head: cabecaComTitulo("Estúdio Raio de Sol | Pilates em Belo Horizonte", `<script id="dados" type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Estúdio Raio de Sol",
  "telephone": "(31) 3555-0166",
}
</script>`),
      body: `<h1>Estúdio Raio de Sol</h1>
<p>Pilates para todas as idades.</p>`,
    },
    modoDocumento: true,
    validador: { tipo: "dadosEstruturados", tipoSchema: "LocalBusiness", campos: ["name", "telephone"] },
    ajudas: {
      pergunta: "Em que linha o teste aponta o erro, e o que tem nela que não devia?",
      dica: "Depois do último item do JSON não pode ter vírgula.",
    },
    solucaoDeTeste: [
      {
        tipo: "definirTexto",
        seletor: "#dados",
        valor: `{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Estúdio Raio de Sol",
  "telephone": "(31) 3555-0166"
}`,
      },
    ],
  },
  {
    id: "dados-estruturados-2",
    conceito: "dados-estruturados",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "ofertascasadosvinhos.exemplo",
      titulo: "Casa dos Vinhos",
      body: `<h1>Casa dos Vinhos</h1>
<p>Vinhos, queijos e petiscos.</p>`,
    },
    previsao: {
      pergunta: "Para que serve o bloco JSON-LD (dados estruturados) no head de um site de negócio local?",
      opcoes: [
        "Para mudar as cores da página",
        "Para dizer à busca, em formato que ela lê fácil, o que o negócio é",
        "Para a página abrir mais rápido",
      ],
      correta: 1,
      explicacao: "É um bloco de dados que descreve o negócio (nome, endereço, telefone) num formato que a busca lê sem adivinhar. Ajuda; não garante o cartão no mapa.",
    },
    ajudas: {
      pergunta: "O bloco aparece para quem visita a página, ou é para a busca?",
      dica: "Ele é para a busca: descreve o negócio em formato de dados.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
