/*
 * S3, Fase 3: "O JSON que a busca lê" (Café Grão Dourado, modo documento).
 *
 * O QUE ENSINA: dados estruturados (JSON-LD): um bloco de dados num
 * script no head, em formato que a busca lê sem adivinhar. Apresenta o
 * "Teste de dados estruturados", que mostra a linha do erro do JSON e o
 * que falta. Os campos essenciais são name e address.
 *
 * REVISA: o head e o que mora nele (U6).
 *
 * ORDEM: 1) guiado, com previsão sobre um JSON com vírgula sobrando,
 * depois consertar o bloco; 2) sozinho, acrescentar o endereço
 * (address com streetAddress e addressLocality). Confusão de leigo: dados
 * estruturados garantem o cartão no mapa (só ajudam; quem decide é a busca).
 */
import type { FasePratica } from "@/conteudo/tipos";
import { CAFE_GRAO_DOURADO } from "./sites/cafeGraoDourado";

const JSON_CONSERTADO = `{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Café Grão Dourado",
  "telephone": "(27) 3555-0188"
}`;

const JSON_COM_ENDERECO = `{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Café Grão Dourado",
  "telephone": "(27) 3555-0188",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua Sete de Setembro, 95",
    "addressLocality": "Vitória"
  }
}`;

export const FASE_S3_F3: FasePratica = {
  id: "sites-ser-encontrado-u3-f3",
  tipo: "pratica",
  unidadeId: "sites-ser-encontrado-u3",
  titulo: "O JSON que a busca lê",
  conceitos: ["dados-estruturados"],
  revisa: ["head-vs-body"],
  prerequisitos: ["head-vs-body", "nome-endereco-telefone"],
  usaFerramentas: ["dados-estruturados", "arvore", "editor", "editar-duplo-clique"],
  modoDocumento: true,
  siteAlvo: CAFE_GRAO_DOURADO,
  introducao: [
    { texto: "Dados estruturados são um bloco de informação escrito num formato que a busca lê fácil, sem ter que adivinhar.", expressao: "curioso" },
    { texto: "Ele usa JSON, um jeito de escrever dados com chaves e aspas, dentro de um script ld+json no head. É um teste simulado e aproximado.", expressao: "pensativo" },
    { texto: "O Café Grão Dourado já tem um bloco, mas tem algo errado nele. Vamos olhar o Teste de dados estruturados.", expressao: "apontando" },
  ],
  objetivos: [
    {
      id: "consertar-o-json",
      tipo: "previsao",
      modo: "guiado",
      apresentar: ["dados-estruturados"],
      previsao: {
        pergunta: "O JSON do café tem uma vírgula sobrando no fim. O que a busca faz com um bloco de JSON com erro?",
        opcoes: ["Corrige sozinha e usa do mesmo jeito", "Não consegue ler o bloco: ele não serve para nada", "Ignora a vírgula e lê o resto"],
        correta: 1,
        explicacao: "JSON é rígido: uma vírgula sobrando quebra a leitura do bloco inteiro. O Teste mostra a linha do erro para você achar.",
      },
      enunciado: {
        mouse: "Na aba Dados, veja a linha do erro. Depois tire a vírgula sobrando do bloco, no script do head (pelo editor de código).",
        toque: "Na aba Dados, veja a linha do erro. Depois tire a vírgula sobrando do bloco, no script do head (pelo Código).",
      },
      validador: { tipo: "dadosEstruturados", tipoSchema: "LocalBusiness", campos: ["name", "telephone"] },
      ajudas: {
        pergunta: "Em qual linha o teste diz que o erro está? O que tem no fim dela que não devia?",
        dica: "Vírgula só separa um item do próximo. Depois do último item, não pode ter vírgula.",
        linha: { alvo: "arvore", seletor: "#dados-cafe", fala: "Este é o script com o bloco de dados. A vírgula sobrando está depois do telefone." },
        solucao: {
          fala: "Tirei a vírgula depois do telefone: agora o JSON é válido e o teste lê o nome e o telefone do café.",
          acoes: [{ tipo: "definirTexto", seletor: "#dados-cafe", valor: JSON_CONSERTADO }],
        },
      },
      falaAoConcluir: { texto: "JSON válido! Agora a busca lê o que o bloco diz: o nome e o telefone do café.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "definirTexto", seletor: "#dados-cafe", valor: JSON_CONSERTADO },
      ],
    },
    {
      id: "acrescentar-endereco",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "O teste avisa que falta o endereço. Acrescente address (PostalAddress) com streetAddress e addressLocality no bloco.",
        toque: "O teste avisa que falta o endereço. Acrescente address (PostalAddress) com streetAddress e addressLocality no bloco.",
      },
      validador: {
        tipo: "dadosEstruturados",
        tipoSchema: "LocalBusiness",
        campos: ["name", "address.streetAddress", "address.addressLocality"],
      },
      ajudas: {
        pergunta: "O que o Teste diz que falta? Em que lugar do bloco isso entra?",
        dica: "address é um objeto: \"@type\": \"PostalAddress\", streetAddress (rua e número) e addressLocality (a cidade). Cuidado com as vírgulas.",
      },
      falaAoConcluir: { texto: "name e address, os essenciais, no lugar. O teste aprovou. Fez sozinho!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "definirTexto", seletor: "#dados-cafe", valor: JSON_COM_ENDERECO }],
    },
  ],
  conclusao: [
    { texto: "Os campos essenciais são name e address. Telefone, url, horário, geo, image e priceRange são comuns e recomendados.", expressao: "feliz" },
    { texto: "Dados estruturados ajudam a busca a entender o negócio. Quem decide mostrar o cartão no mapa é ela, não você.", expressao: "pensativo" },
  ],
  missaoDeCampo:
    "Abra o site de um negócio local, aperte F12 e procure, na aba Elementos, por ld+json. Tem um bloco? Ele tem name e address? Confira se batem com o que o site mostra.",
  falaFinal: { texto: "Próxima fase: o tipo certo de negócio.", expressao: "feliz" },
};
