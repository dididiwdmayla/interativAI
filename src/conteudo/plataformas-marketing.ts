/*
 * Passo a passo das plataformas de marketing (zona opcional "Ser
 * encontrado"): o perfil da empresa no Google, o Search Console, as
 * plataformas de medição e de anúncio.
 *
 * Filosofia da zona (docs/MAPA-CURRICULAR.md): o jogo ensina o que o
 * programador faz e os conceitos que não envelhecem. O passo a passo de
 * cada plataforma muda de tela, de nome e de regra o tempo todo, então
 * ele mora AQUI, só como dado, com a data em que foi conferido. A tela
 * mostra "conferido em <data>" (`rotuloConferido`). Quando uma plataforma
 * mudar, atualize os passos e a data, sem mexer em código.
 *
 * Os textos entram na produção de conteúdo (S3 a S5), conferidos na
 * época, nunca de memória. Conferido em 30/09/2026 (S3 a S5).
 * O `testar:conteudo` confere ids únicos, data no formato AAAA-MM-DD,
 * passos ou fatos não vazios, fontes e que cada unidade em `usadaEm`
 * mostre o "conferido em <data>" em alguma fala ou missão de campo (o
 * jogo ainda não tem uma tela que liste os passos: as fases carregam o
 * caminho geral e o rótulo).
 */

export type IdPlataformaMarketing = string;

export type PassoPlataforma = {
  /** Estável, kebab-case (pode ir para o progresso um dia). */
  id: string;
  /** O que fazer, em uma frase. */
  titulo: string;
  /** Um detalhe que tira a dúvida mais comum desse passo. */
  detalhe: string;
};

/** Um fato que não é passo a passo (regra, limite, boa prática). */
export type FatoPlataforma = {
  /** Estável, kebab-case. */
  id: string;
  titulo: string;
  detalhe: string;
};

export type PlataformaMarketing = {
  id: IdPlataformaMarketing;
  /** Nome como aparece na tela ("Perfil da Empresa no Google"). */
  nome: string;
  /** Para que serve, em uma frase de leigo. */
  paraQue: string;
  /** Endereço onde a pessoa vai (texto; abre no navegador, fora do jogo). */
  endereco: string;
  /** Quando os passos foram conferidos pela última vez (AAAA-MM-DD). */
  verificadoEm: string;
  /** Unidades do currículo que citam esta plataforma. */
  usadaEm: readonly string[];
  /** O caminho, na ordem. Vazio quando a plataforma não tem passo a passo (só fatos). */
  passos: readonly PassoPlataforma[];
  /** O que vale saber além dos passos (regras, limites, boas práticas). */
  fatos: readonly FatoPlataforma[];
  /** De onde os fatos foram conferidos (endereços de ajuda e artigos). */
  fontes: readonly string[];
};

/**
 * Conferido em 30/09/2026. Só o que está nas fontes de cada plataforma:
 * nada de nomes de menu, telas ou passos de memória. Quando uma plataforma
 * mudar, atualize os fatos, as fontes e a data, sem mexer em código.
 */
export const PLATAFORMAS_MARKETING: readonly PlataformaMarketing[] = [
  {
    id: "perfil-da-empresa",
    nome: "Perfil da Empresa no Google (antigo Google Meu Negócio)",
    paraQue:
      "É o que faz o negócio aparecer na Pesquisa e no Maps: a ficha com endereço, telefone, horário, fotos e avaliações.",
    endereco: "support.google.com/business",
    verificadoEm: "2026-09-30",
    usadaEm: ["sites-ser-encontrado-u3"],
    passos: [
      { id: "conta-google", titulo: "Entrar com uma Conta Google", detalhe: "É a conta que vai cuidar do perfil." },
      { id: "procurar-empresa", titulo: "Procurar a empresa no Google", detalhe: "Ela pode já ter um perfil: nesse caso, o caminho é reivindicar." },
      {
        id: "adicionar-ou-reivindicar",
        titulo: "Adicionar a empresa, ou reivindicar o perfil se ele já existir",
        detalhe: "Reivindicar é dizer que aquele perfil é seu, para poder cuidar dele.",
      },
      { id: "nome-e-categoria", titulo: "Informar o nome e a categoria", detalhe: "O nome igual ao do site, e a categoria que melhor descreve o negócio." },
      {
        id: "endereco-ou-area",
        titulo: "Informar o endereço físico ou a área de atendimento",
        detalhe: "Quem atende a domicílio, como um encanador, usa a área de atendimento.",
      },
      { id: "contato", titulo: "Informar o contato", detalhe: "Telefone e site, iguais aos que aparecem em todo lugar." },
      {
        id: "verificar",
        titulo: "Verificar",
        detalhe:
          "A verificação prova que você é o responsável. Os métodos dependem do caso: carta com código, telefone, e-mail ou vídeo. Pode levar dias.",
      },
    ],
    fatos: [
      {
        id: "pacote-local",
        titulo: "O pacote local",
        detalhe: 'Em buscas locais ("padaria perto de mim", "padaria em Sarandi"), aparece o pacote local: um mapa e uma lista de empresas.',
      },
      {
        id: "sem-loja-fisica",
        titulo: "Serve também para quem não tem loja física",
        detalhe: "Um encanador que atende a domicílio pode ter perfil, usando a área de atendimento.",
      },
      {
        id: "depois-de-verificado",
        titulo: "O que só vale depois de verificado",
        detalhe: "Só depois de verificado dá para editar tudo, responder avaliações, publicar fotos e posts e ver as estatísticas.",
      },
      {
        id: "boas-praticas",
        titulo: "Boas práticas",
        detalhe:
          "Dados iguais em todo lugar (nome, endereço e telefone no site, no perfil e nas redes), horários certos, fotos reais, pedir e responder avaliações.",
      },
    ],
    fontes: [
      "support.google.com/business",
      "metricool.com/pt/como-verificar-perfil-da-empresa-no-google",
      "pt.semrush.com/blog/google-meu-negocio",
    ],
  },
  {
    id: "dados-estruturados-schema",
    nome: "Dados estruturados (schema.org, LocalBusiness)",
    paraQue: "Um bloco de dados que descreve o negócio para a busca, no vocabulário da schema.org.",
    endereco: "schema.org/LocalBusiness",
    verificadoEm: "2026-09-30",
    usadaEm: ["sites-ser-encontrado-u3"],
    passos: [],
    fatos: [
      {
        id: "subtipo-mais-especifico",
        titulo: "LocalBusiness e o subtipo mais específico",
        detalhe: "LocalBusiness é subtipo de Organization e de Place. A recomendação é usar o subtipo mais específico que existir.",
      },
      {
        id: "subtipos-de-comida",
        titulo: "Subtipos de comida",
        detalhe: "Bakery, CafeOrCoffeeShop, Restaurant, BarOrPub, IceCreamShop e FastFoodRestaurant (todos em FoodEstablishment).",
      },
      {
        id: "subtipos-de-beleza",
        titulo: "Subtipos de beleza",
        detalhe: "HairSalon, BeautySalon, NailSalon, DaySpa e TattooParlor (em HealthAndBeautyBusiness).",
      },
      { id: "subtipo-de-saude", titulo: "Subtipo de saúde", detalhe: "Dentist." },
      {
        id: "subtipos-de-casa-e-construcao",
        titulo: "Subtipos de casa e construção",
        detalhe: "Plumber, Electrician, RoofingContractor e HousePainter (em HomeAndConstructionBusiness).",
      },
      {
        id: "subtipos-automotivos",
        titulo: "Subtipos automotivos",
        detalhe: "AutoRepair, AutoWash e AutoDealer (em AutomotiveBusiness).",
      },
      {
        id: "outros-subtipos",
        titulo: "Outros subtipos",
        detalhe: "LegalService e RealEstateAgent; lojas como PetStore e ClothingStore (em Store).",
      },
      {
        id: "campos",
        titulo: "Campos",
        detalhe:
          "name e address são os essenciais. Comuns e recomendados: telephone, url, openingHoursSpecification, geo, image e priceRange.",
      },
    ],
    fontes: [
      "schemaapp.com/tutorial/how-to-do-schema-markup-for-local-business",
      "unhead.unjs.io/docs/schema-org/api/schema/local-business",
    ],
  },
];

/** "conferido em 30/09/2026", para a tela. */
export function rotuloConferido(verificadoEm: string): string {
  const [ano, mes, dia] = verificadoEm.split("-");
  return ano && mes && dia ? `conferido em ${dia}/${mes}/${ano}` : `conferido em ${verificadoEm}`;
}

/** Problemas no arquivo de plataformas (regra geral do testar:conteudo). */
export function conferirPlataformas(plataformas: readonly PlataformaMarketing[]): string[] {
  const problemas: string[] = [];
  const vistos = new Set<string>();
  for (const plataforma of plataformas) {
    if (vistos.has(plataforma.id)) problemas.push(`plataforma com id repetido: "${plataforma.id}"`);
    vistos.add(plataforma.id);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(plataforma.verificadoEm)) {
      problemas.push(`a plataforma "${plataforma.id}" precisa de verificadoEm no formato AAAA-MM-DD`);
    }
    if (plataforma.passos.length === 0 && plataforma.fatos.length === 0) problemas.push(`a plataforma "${plataforma.id}" não tem passos nem fatos`);
    if (plataforma.fontes.length === 0) problemas.push(`a plataforma "${plataforma.id}" não diz de onde os fatos foram conferidos (fontes)`);
    if (plataforma.usadaEm.length === 0) problemas.push(`a plataforma "${plataforma.id}" não é usada em nenhuma unidade (usadaEm)`);
    const itens = new Set<string>();
    for (const item of [...plataforma.passos, ...plataforma.fatos]) {
      if (itens.has(item.id)) problemas.push(`a plataforma "${plataforma.id}" repete o passo ou fato "${item.id}"`);
      itens.add(item.id);
    }
  }
  return problemas;
}
