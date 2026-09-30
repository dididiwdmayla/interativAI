/*
 * S3, Desafio: "Padaria Pão de Mel" (docs/MAPA-CURRICULAR.md: "uma padaria
 * com três endereços diferentes espalhados").
 *
 * Site NOVO com um problema de cada fase: o endereço escrito de três
 * jeitos (o perfil diz Rua das Flores, 120, Sarandi), o bloco de dados
 * estruturados com vírgula sobrando e tipo genérico, e uma avaliação de
 * uma estrela sem resposta. Cada parte é avaliada ao vivo.
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { PADARIA_PAO_DE_MEL } from "./sites/padariaPaoDeMel";

const JSON_LOCAL = `{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Padaria Pão de Mel",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua das Flores, 120",
    "addressLocality": "Sarandi"
  },
  "telephone": "(44) 3555-0100"
}`;

const JSON_BAKERY = JSON_LOCAL.replace('"LocalBusiness"', '"Bakery"');

export const FASE_S3_F5: FaseDesafio = {
  id: "sites-ser-encontrado-u3-f5",
  tipo: "desafio",
  unidadeId: "sites-ser-encontrado-u3",
  titulo: "Padaria Pão de Mel",
  conceitos: ["nome-endereco-telefone", "avaliacoes-do-cliente", "dados-estruturados", "local-business"],
  revisa: [],
  prerequisitos: ["nome-endereco-telefone", "dados-estruturados", "local-business"],
  usaFerramentas: ["dados-estruturados", "arvore", "editor", "editar-duplo-clique"],
  modoDocumento: true,
  siteAlvo: PADARIA_PAO_DE_MEL,
  introducao: [
    { texto: "A Padaria Pão de Mel escreveu o endereço de três jeitos, e a busca não sabe qual é o certo. No perfil do Google é Rua das Flores, 120, Sarandi.", expressao: "pensativo" },
    { texto: "Iguale os endereços, conserte os dados estruturados, use o tipo certo e responda a avaliação. Sem passo a passo.", expressao: "curioso" },
    { texto: "Travou? O Rever leva de volta para a fase onde cada coisa foi ensinada.", expressao: "apontando" },
  ],
  partes: [
    {
      id: "enderecos-iguais",
      descricao: "Os três endereços da página iguais ao do perfil: Rua das Flores, 120, Sarandi",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "textoIgual", seletor: "#end-topo", valor: "Rua das Flores, 120, Sarandi" },
          { tipo: "textoIgual", seletor: "#end-contato", valor: "Rua das Flores, 120, Sarandi" },
          { tipo: "textoIgual", seletor: "#end-rodape", valor: "Rua das Flores, 120, Sarandi" },
        ],
      },
      revisarEm: "sites-ser-encontrado-u3-f1",
      solucaoDeTeste: [
        { tipo: "definirTexto", seletor: "#end-contato", valor: "Rua das Flores, 120, Sarandi" },
        { tipo: "definirTexto", seletor: "#end-rodape", valor: "Rua das Flores, 120, Sarandi" },
      ],
    },
    {
      id: "json-sem-erro",
      descricao: "O bloco de dados estruturados sem erro, com nome e endereço",
      validador: { tipo: "dadosEstruturados", tipoSchema: "LocalBusiness", campos: ["name", "address.streetAddress"] },
      revisarEm: "sites-ser-encontrado-u3-f3",
      solucaoDeTeste: [{ tipo: "definirTexto", seletor: "#dados-padaria", valor: JSON_LOCAL }],
    },
    {
      id: "tipo-bakery",
      descricao: "O tipo mais específico para padaria (Bakery), com endereço e telefone",
      validador: { tipo: "dadosEstruturados", tipoSchema: "Bakery", campos: ["name", "address.streetAddress", "telephone"] },
      revisarEm: "sites-ser-encontrado-u3-f4",
      solucaoDeTeste: [{ tipo: "definirTexto", seletor: "#dados-padaria", valor: JSON_BAKERY }],
    },
    {
      id: "resposta-a-cliente",
      descricao: "Uma resposta educada à avaliação de 1 estrela",
      validador: { tipo: "textoDiferenteDoInicial", seletor: "#resposta-1" },
      revisarEm: "sites-ser-encontrado-u3-f2",
      solucaoDeTeste: [{ tipo: "definirTexto", seletor: "#resposta-1", valor: "Sentimos muito. Vamos assar de hora em hora para o pão chegar quente. Volte para provar." }],
    },
  ],
  conclusao: [
    { texto: "A Pão de Mel diz a mesma coisa em todo lugar, com dados que a busca lê e uma resposta ao cliente.", expressao: "comemorando" },
    { texto: "Dados estruturados ajudam a busca a entender; quem decide o cartão no mapa é ela. E o perfil do Google é onde a mágica aparece.", expressao: "feliz" },
  ],
  missaoDeCampo:
    "Escolha um negócio que você conhece e liste onde o nome, o endereço e o telefone dele aparecem (site, perfil, redes). Eles são iguais em todos? O que você acertaria primeiro?",
  falaFinal: { texto: "Unidade concluída! A próxima da zona é medir quem chega.", expressao: "comemorando" },
};
