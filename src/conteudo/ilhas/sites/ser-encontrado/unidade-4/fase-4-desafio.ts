/*
 * S4, Desafio: "Casa de Sucos Vitamina" (docs/MAPA-CURRICULAR.md:
 * "descobrir qual divulgação trouxe clientes").
 *
 * Site NOVO: duas divulgações do verão (Instagram e folheto com QR code)
 * sem rastreamento e um botão de pedido sem medição. Cada parte é
 * avaliada ao vivo; as visitas simuladas travam no checklist.
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { CASA_DE_SUCOS_VITAMINA } from "./sites/casaDeSucosVitamina";

const LINK_INSTAGRAM = "https://casadesucosvitamina.exemplo/?utm_source=instagram&utm_medium=social&utm_campaign=verao";
const LINK_FOLHETO = "https://casadesucosvitamina.exemplo/?utm_source=folheto&utm_medium=impresso&utm_campaign=verao";

export const FASE_S4_F4: FaseDesafio = {
  id: "sites-ser-encontrado-u4-f4",
  tipo: "desafio",
  unidadeId: "sites-ser-encontrado-u4",
  titulo: "Casa de Sucos Vitamina",
  conceitos: ["evento-de-medicao", "conversao", "link-rastreavel-utm"],
  revisa: [],
  prerequisitos: ["evento-de-medicao", "conversao", "link-rastreavel-utm"],
  usaFerramentas: ["link-rastreavel", "medicao", "arvore", "adicionar-atributo", "editar-duplo-clique"],
  siteAlvo: CASA_DE_SUCOS_VITAMINA,
  introducao: [
    { texto: "A Vitamina divulgou a promoção de verão no Instagram e num folheto com QR code. Ninguém sabe qual trouxe mais clientes.", expressao: "pensativo" },
    { texto: "Ponha um link rastreável em cada divulgação, meça o pedido e simule uma visita de cada uma. Sem passo a passo.", expressao: "curioso" },
    { texto: "Travou? O Rever leva de volta para a fase onde cada coisa foi ensinada.", expressao: "apontando" },
  ],
  partes: [
    {
      id: "link-do-instagram",
      descricao: "O link do Instagram rastreável: instagram, social, verao",
      validador: { tipo: "linkRastreavel", seletor: "#link-insta", utm: { source: "instagram", medium: "social", campaign: "verao" } },
      revisarEm: "sites-ser-encontrado-u4-f3",
      solucaoDeTeste: [{ tipo: "definirAtributo", seletor: "#link-insta", nome: "href", valor: LINK_INSTAGRAM }],
    },
    {
      id: "link-do-folheto",
      descricao: "O link do folheto rastreável: folheto, impresso, verao",
      validador: { tipo: "linkRastreavel", seletor: "#link-folheto", utm: { source: "folheto", medium: "impresso", campaign: "verao" } },
      revisarEm: "sites-ser-encontrado-u4-f3",
      solucaoDeTeste: [{ tipo: "definirAtributo", seletor: "#link-folheto", nome: "href", valor: LINK_FOLHETO }],
    },
    {
      id: "pedido-medido",
      descricao: "O botão Fazer pedido medido com o evento pedido_enviado, e um clique nele",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "atributo", seletor: "#fazer-pedido", nome: "data-evento", valor: "pedido_enviado" },
          { tipo: "eventoMedido", nome: "pedido_enviado" },
        ],
      },
      revisarEm: "sites-ser-encontrado-u4-f1",
      solucaoDeTeste: [
        { tipo: "adicionarAtributo", seletor: "#fazer-pedido", nome: "data-evento", valor: "pedido_enviado" },
        { tipo: "clicarNaPrevia", seletor: "#fazer-pedido" },
      ],
    },
    {
      id: "uma-visita-de-cada",
      descricao: "Uma visita simulada de cada divulgação (duas visitas ao todo)",
      validador: { tipo: "evento", evento: "visitaSimulada", minimo: 2 },
      revisarEm: "sites-ser-encontrado-u4-f3",
      solucaoDeTeste: [
        { tipo: "simularVisita", utm: { source: "instagram", medium: "social", campaign: "verao" } },
        { tipo: "simularVisita", utm: { source: "folheto", medium: "impresso", campaign: "verao" } },
      ],
    },
  ],
  conclusao: [
    { texto: "Agora a Vitamina separa as visitas do Instagram e do folheto e sabe quantas viraram pedido. Isso é medir o que importa.", expressao: "comemorando" },
    { texto: "Visita não é cliente: a conversão é o que conta. E o link rastreável mostra de qual divulgação ela veio.", expressao: "feliz" },
  ],
  missaoDeCampo:
    "Pense numa divulgação que um negócio do seu bairro faz (cartaz, post, panfleto). Como ele saberia quantos clientes vieram dela? Escreva o link rastreável que você montaria.",
  falaFinal: { texto: "Unidade concluída! A última da zona é o anúncio pago por dentro.", expressao: "comemorando" },
};
