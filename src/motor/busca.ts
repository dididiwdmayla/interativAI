/*
 * Busca simulada (zona "Ser encontrado", S1 a S3): como o documento do
 * site-alvo apareceria num resultado de busca do Google, e um teste de
 * dados estruturados simplificado. Só DOM comum: roda igual no navegador,
 * num Document solto e no jsdom.
 *
 * É uma SIMULAÇÃO APROXIMADA, e a tela diz isso:
 * - o corte dos textos longos é por largura em pixels, não por letras. Em
 *   2026-09 as referências públicas (guias de SEO que medem a página de
 *   resultados) falam em uns 580 a 600 px para o título no computador (uns
 *   50 a 60 caracteres) e uns 920 px para a descrição no computador (uns
 *   155 a 160 caracteres), uns 680 px no celular (uns 120). O jogo estima a
 *   largura com uma tabela de larguras médias por letra (Arial), corta na
 *   palavra inteira e põe "...". O Google pode mostrar outro texto: ele
 *   reescreve títulos e descrições quando acha que outro trecho da página
 *   responde melhor à busca.
 * - sem <title>, o Google inventa um título com o que acha na página; aqui,
 *   o primeiro h1. Sem description, ele mostra um trecho da página; aqui, o
 *   primeiro parágrafo.
 * - `noindex` (meta robots ou googlebot) tira a página da busca: ela
 *   continua no ar, só não aparece no resultado.
 * - o cartão do negócio no mapa aparece quando há dados estruturados de
 *   negócio local válidos (name e address, os obrigatórios da documentação
 *   do Google para LocalBusiness) e a página pode ser indexada. Na vida real,
 *   quem decide mostrar o cartão é a busca; os dados só ajudam a entender.
 */

/* ------------------------------------------------------------------ */
/* Largura aproximada e corte                                         */
/* ------------------------------------------------------------------ */

export type Aparelho = "computador" | "celular";

/** Limites aproximados em pixels (ver o topo do arquivo). */
export const LIMITES_BUSCA = {
  titulo: { px: 580, fonte: 20 },
  descricao: { computador: 920, celular: 680, fonte: 13 },
} as const;

const ESTREITAS = new Set("iljI!|.,;:'`ı".split(""));
const MEIO_ESTREITAS = new Set("frt()[]{}-/\\\" ".split(""));
const LARGAS = new Set("mwMW@%".split(""));

/**
 * Largura de uma letra, em frações do tamanho da fonte (Arial, médias).
 * Calibrada para um texto comum em português dar uns 60 caracteres no
 * título (20 px, 580 px) e uns 150 na descrição (13 px, 920 px), perto das
 * referências do topo do arquivo.
 */
function larguraDaLetra(letra: string): number {
  if (ESTREITAS.has(letra)) return 0.23;
  if (MEIO_ESTREITAS.has(letra)) return 0.28;
  if (LARGAS.has(letra)) return 0.83;
  if (/[0-9]/.test(letra)) return 0.55;
  if (letra !== letra.toLowerCase()) return 0.66;
  return 0.5;
}

/** Largura aproximada do texto em pixels, numa fonte desse tamanho. */
export function larguraAproximada(texto: string, fonte: number): number {
  let total = 0;
  for (const letra of texto) total += larguraDaLetra(letra);
  return total * fonte;
}

/** Corta o texto na última palavra inteira que cabe, com "...". */
export function cortarTexto(texto: string, limitePx: number, fonte: number): { texto: string; cortou: boolean } {
  const limpo = texto.replace(/\s+/g, " ").trim();
  if (larguraAproximada(limpo, fonte) <= limitePx) return { texto: limpo, cortou: false };
  const reticencias = larguraAproximada(" ...", fonte);
  const palavras = limpo.split(" ");
  let saida = "";
  for (const palavra of palavras) {
    const tentativa = saida ? `${saida} ${palavra}` : palavra;
    if (larguraAproximada(tentativa, fonte) + reticencias > limitePx) break;
    saida = tentativa;
  }
  return { texto: `${saida || limpo.slice(0, 10)} ...`, cortou: true };
}

/* ------------------------------------------------------------------ */
/* Resultado na busca                                                 */
/* ------------------------------------------------------------------ */

function textoLimpo(texto: string | null | undefined): string {
  return (texto ?? "").replace(/\s+/g, " ").trim();
}

/** O que a página declara (nulo quando não declara). */
export type CampoDaPagina = {
  /** O texto que a página declara (o <title>, a meta description), ou null. */
  declarado: string | null;
  /** O que aparece no resultado: o declarado, ou o que a busca inventou, já cortado. */
  exibido: string;
  cortou: boolean;
  /** A página não declarou: a busca usou outro trecho (h1, primeiro parágrafo). */
  inventado: boolean;
};

export type ResultadoBusca = {
  titulo: CampoDaPagina;
  descricao: CampoDaPagina;
  /** Endereço como a busca mostra (site › caminho). */
  endereco: string;
  indexavel: boolean;
  /** Por que não é indexável (o conteúdo da meta), se não for. */
  motivoNaoIndexavel: string | null;
  /** O cartão do negócio no mapa, com dados estruturados válidos. */
  negocio: NegocioNoMapa | null;
};

export type NegocioNoMapa = { nome: string; tipo: string; endereco: string; horario: string | null; telefone: string | null };

/** Meta robots (ou googlebot) com noindex. */
export function motivoNoindex(documento: Document): string | null {
  for (const meta of Array.from(documento.querySelectorAll("meta[name]"))) {
    const nome = (meta.getAttribute("name") ?? "").toLowerCase();
    if (nome !== "robots" && nome !== "googlebot") continue;
    const conteudo = (meta.getAttribute("content") ?? "").toLowerCase();
    if (/\b(noindex|none)\b/.test(conteudo)) return `<meta name="${nome}" content="${meta.getAttribute("content") ?? ""}">`;
  }
  return null;
}

/** A meta description declarada, ou null. */
function descricaoDeclarada(documento: Document): string | null {
  const meta = Array.from(documento.querySelectorAll("meta[name]")).find((item) => (item.getAttribute("name") ?? "").toLowerCase() === "description");
  const texto = textoLimpo(meta?.getAttribute("content"));
  return texto.length > 0 ? texto : null;
}

function tituloDeclarado(documento: Document): string | null {
  const texto = textoLimpo(documento.querySelector("title")?.textContent);
  return texto.length > 0 ? texto : null;
}

/** "padariaestrela.exemplo › cardapio", como a busca mostra o endereço. */
export function enderecoNaBusca(url: string): string {
  const semProtocolo = url.replace(/^[a-z]+:\/\//i, "").replace(/\/+$/, "");
  const [dominio, ...caminho] = semProtocolo.split("/");
  return [dominio, ...caminho.filter(Boolean)].join(" › ");
}

export function resultadoNaBusca(documento: Document, url: string, aparelho: Aparelho = "computador"): ResultadoBusca {
  const titulo = tituloDeclarado(documento);
  const inventadoTitulo = titulo ?? (textoLimpo(documento.querySelector("h1")?.textContent) || enderecoNaBusca(url).split(" › ")[0]);
  const corteTitulo = cortarTexto(inventadoTitulo, LIMITES_BUSCA.titulo.px, LIMITES_BUSCA.titulo.fonte);
  const descricao = descricaoDeclarada(documento);
  const trecho = descricao ?? textoLimpo(documento.querySelector("body p")?.textContent);
  const corteDescricao = cortarTexto(trecho, LIMITES_BUSCA.descricao[aparelho], LIMITES_BUSCA.descricao.fonte);
  const motivo = motivoNoindex(documento);
  const negocio = motivo ? null : negocioDosDados(analisarDadosEstruturados(documento));
  return {
    titulo: { declarado: titulo, exibido: corteTitulo.texto, cortou: corteTitulo.cortou, inventado: titulo === null },
    descricao: { declarado: descricao, exibido: corteDescricao.texto, cortou: corteDescricao.cortou, inventado: descricao === null },
    endereco: enderecoNaBusca(url),
    indexavel: motivo === null,
    motivoNaoIndexavel: motivo,
    negocio,
  };
}

/* ------------------------------------------------------------------ */
/* JSON com a linha do erro                                           */
/* ------------------------------------------------------------------ */

export type Json = null | boolean | number | string | Json[] | { [chave: string]: Json };

export type LeituraJson = { ok: true; valor: Json } | { ok: false; linha: number; coluna: number; mensagem: string };

class ErroJson extends Error {
  constructor(
    mensagem: string,
    readonly posicao: number,
  ) {
    super(mensagem);
  }
}

/**
 * Lê JSON (o padrão, sem comentários e sem vírgula sobrando) dizendo a
 * linha e a coluna do primeiro erro, com uma mensagem em português. Próprio
 * do jogo: a mensagem do JSON.parse muda de navegador para navegador.
 */
export function lerJsonComLinha(texto: string): LeituraJson {
  let i = 0;
  const espacos = () => {
    while (i < texto.length && /\s/.test(texto[i])) i++;
  };
  const falhar = (mensagem: string): never => {
    throw new ErroJson(mensagem, i);
  };
  const letra = () => (i < texto.length ? texto[i] : "fim do texto");

  const lerTexto = (): string => {
    i++; // aspas de abertura
    let saida = "";
    while (i < texto.length && texto[i] !== '"') {
      if (texto[i] === "\n") falhar("um texto entre aspas não pode quebrar a linha (faltou fechar as aspas?)");
      if (texto[i] === "\\") {
        const proxima = texto[i + 1];
        const mapa: Record<string, string> = { '"': '"', "\\": "\\", "/": "/", b: "\b", f: "\f", n: "\n", r: "\r", t: "\t" };
        if (proxima === "u" && /^[0-9a-fA-F]{4}$/.test(texto.slice(i + 2, i + 6))) {
          saida += String.fromCharCode(parseInt(texto.slice(i + 2, i + 6), 16));
          i += 6;
          continue;
        }
        if (proxima === undefined || !(proxima in mapa)) falhar("barra invertida seguida de uma letra que o JSON não conhece");
        saida += mapa[proxima];
        i += 2;
        continue;
      }
      saida += texto[i++];
    }
    if (i >= texto.length) falhar("faltou fechar as aspas");
    i++;
    return saida;
  };

  const lerValor = (): Json => {
    espacos();
    const c = texto[i];
    if (c === "{") return lerObjeto();
    if (c === "[") return lerLista();
    if (c === '"') return lerTexto();
    if (c === "'") falhar("o JSON usa aspas duplas (\"), não simples (')");
    const numero = /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/.exec(texto.slice(i));
    if (numero) {
      i += numero[0].length;
      return Number(numero[0]);
    }
    for (const [palavra, valor] of [
      ["true", true],
      ["false", false],
      ["null", null],
    ] as const) {
      if (texto.startsWith(palavra, i)) {
        i += palavra.length;
        return valor;
      }
    }
    return falhar(i >= texto.length ? "o texto acabou antes de um valor" : `não esperava "${letra()}" aqui (faltou aspas num texto?)`);
  };

  const lerObjeto = (): Json => {
    i++;
    const saida: { [chave: string]: Json } = {};
    espacos();
    if (texto[i] === "}") {
      i++;
      return saida;
    }
    for (;;) {
      espacos();
      if (texto[i] === "}") falhar("vírgula sobrando antes do }");
      if (texto[i] !== '"') falhar(texto[i] === "'" ? "o nome do campo usa aspas duplas (\"), não simples (')" : "o nome do campo precisa estar entre aspas duplas");
      const chave = lerTexto();
      espacos();
      if (texto[i] !== ":") falhar(`faltou os dois-pontos depois de "${chave}"`);
      i++;
      saida[chave] = lerValor();
      espacos();
      if (texto[i] === ",") {
        i++;
        continue;
      }
      if (texto[i] === "}") {
        i++;
        return saida;
      }
      falhar(i >= texto.length ? "faltou fechar o } do objeto" : "faltou uma vírgula entre dois campos (ou o } do fim)");
    }
  };

  const lerLista = (): Json => {
    i++;
    const saida: Json[] = [];
    espacos();
    if (texto[i] === "]") {
      i++;
      return saida;
    }
    for (;;) {
      espacos();
      if (texto[i] === "]") falhar("vírgula sobrando antes do ]");
      saida.push(lerValor());
      espacos();
      if (texto[i] === ",") {
        i++;
        continue;
      }
      if (texto[i] === "]") {
        i++;
        return saida;
      }
      falhar(i >= texto.length ? "faltou fechar o ] da lista" : "faltou uma vírgula entre dois itens (ou o ] do fim)");
    }
  };

  try {
    const valor = lerValor();
    espacos();
    if (i < texto.length) falhar("sobrou texto depois do fim do JSON");
    return { ok: true, valor };
  } catch (erro) {
    if (!(erro instanceof ErroJson)) throw erro;
    const antes = texto.slice(0, erro.posicao);
    const linhas = antes.split("\n");
    return { ok: false, linha: linhas.length, coluna: linhas[linhas.length - 1].length + 1, mensagem: erro.message };
  }
}

/* ------------------------------------------------------------------ */
/* Dados estruturados (JSON-LD)                                       */
/* ------------------------------------------------------------------ */

/**
 * LocalBusiness e subtipos comuns da schema.org (hierarquia de
 * schema.org/LocalBusiness: FoodEstablishment, Store, HealthAndBeautyBusiness,
 * AutomotiveBusiness...). A lista é curta de propósito: os que um pequeno
 * negócio de bairro usa. Confere com os subtipos comuns de
 * src/conteudo/plataformas-marketing.ts (dados-estruturados-schema,
 * conferido em 30/09/2026); testes/conteudo/busca.test.ts trava isso.
 */
export const TIPOS_DE_NEGOCIO_LOCAL: readonly string[] = [
  "LocalBusiness",
  "FoodEstablishment",
  "Restaurant",
  "Bakery",
  "CafeOrCoffeeShop",
  "BarOrPub",
  "IceCreamShop",
  "FastFoodRestaurant",
  "Store",
  "ClothingStore",
  "BookStore",
  "GroceryStore",
  "PetStore",
  "HealthAndBeautyBusiness",
  "BeautySalon",
  "HairSalon",
  "NailSalon",
  "DaySpa",
  "TattooParlor",
  "HomeAndConstructionBusiness",
  "Plumber",
  "Electrician",
  "RoofingContractor",
  "HousePainter",
  "AutomotiveBusiness",
  "AutoRepair",
  "AutoWash",
  "AutoDealer",
  "Dentist",
  "ProfessionalService",
  "LegalService",
  "RealEstateAgent",
];

/** Obrigatórios para o negócio local (documentação de dados estruturados do Google). */
export const CAMPOS_OBRIGATORIOS_NEGOCIO = ["name", "address"] as const;

/** Recomendados (os principais): ajudam a busca a mostrar horário, telefone e o lugar certo no mapa. */
export const CAMPOS_RECOMENDADOS_NEGOCIO = ["telephone", "openingHoursSpecification", "url", "geo", "priceRange", "image"] as const;

export type ItemEstruturado = {
  /** O @type (o primeiro, se vier uma lista). */
  tipo: string | null;
  /** É LocalBusiness ou um subtipo conhecido. */
  negocioLocal: boolean;
  /** Obrigatórios que faltam (só no negócio local). */
  faltam: string[];
  /** Recomendados ausentes (só no negócio local). */
  recomendadosAusentes: string[];
  /** Avisos (sem @context, endereço sem rua ou cidade...). */
  avisos: string[];
  valor: { [chave: string]: Json };
};

export type BlocoEstruturado = {
  /** Posição do <script> na página (a partir de 1). */
  numero: number;
  /** A linha do erro no texto do script, se o JSON é inválido. */
  erro: { linha: number; coluna: number; mensagem: string } | null;
  itens: ItemEstruturado[];
};

function ehObjetoJson(valor: Json | undefined): valor is { [chave: string]: Json } {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

/** O valor de um campo, com caminho de pontos ("address.streetAddress"). */
export function campoDoItem(valor: { [chave: string]: Json }, caminho: string): Json | undefined {
  let atual: Json | undefined = valor;
  for (const parte of caminho.split(".")) {
    if (!ehObjetoJson(atual)) return undefined;
    atual = atual[parte];
  }
  return atual;
}

/** Tem um valor de verdade (texto não vazio, número, objeto ou lista com algo). */
export function campoPreenchido(valor: Json | undefined): boolean {
  if (valor === undefined || valor === null) return false;
  if (typeof valor === "string") return valor.trim().length > 0;
  if (Array.isArray(valor)) return valor.length > 0;
  if (ehObjetoJson(valor)) return Object.keys(valor).length > 0;
  return true;
}

function tipoDe(valor: { [chave: string]: Json }): string | null {
  const tipo = valor["@type"];
  if (typeof tipo === "string") return tipo;
  if (Array.isArray(tipo) && typeof tipo[0] === "string") return tipo[0];
  return null;
}

function analisarItem(valor: { [chave: string]: Json }, contextoHerdado: boolean): ItemEstruturado {
  const tipo = tipoDe(valor);
  const negocioLocal = tipo !== null && TIPOS_DE_NEGOCIO_LOCAL.includes(tipo);
  const avisos: string[] = [];
  if (tipo === null) avisos.push("sem @type: a busca não sabe o que isto descreve");
  const contexto = valor["@context"];
  if (!contextoHerdado && !(typeof contexto === "string" && /schema\.org/.test(contexto))) {
    avisos.push('sem "@context": "https://schema.org" (o vocabulário que a busca entende)');
  }
  const faltam = negocioLocal ? CAMPOS_OBRIGATORIOS_NEGOCIO.filter((campo) => !campoPreenchido(valor[campo])) : [];
  const recomendadosAusentes = negocioLocal
    ? CAMPOS_RECOMENDADOS_NEGOCIO.filter((campo) =>
        campo === "openingHoursSpecification" ? !campoPreenchido(valor.openingHoursSpecification) && !campoPreenchido(valor.openingHours) : !campoPreenchido(valor[campo]),
      )
    : [];
  const endereco = valor.address;
  if (negocioLocal && ehObjetoJson(endereco)) {
    for (const campo of ["streetAddress", "addressLocality"]) {
      if (!campoPreenchido(endereco[campo])) avisos.push(`o endereço (address) está sem ${campo}`);
    }
  }
  return { tipo, negocioLocal, faltam, recomendadosAusentes, avisos, valor };
}

/** Todos os <script type="application/ld+json"> da página, lidos e conferidos. */
export function analisarDadosEstruturados(documento: Document): BlocoEstruturado[] {
  const scripts = Array.from(documento.querySelectorAll("script")).filter(
    (script) => (script.getAttribute("type") ?? "").trim().toLowerCase() === "application/ld+json",
  );
  return scripts.map((script, indice) => {
    const leitura = lerJsonComLinha(script.textContent ?? "");
    if (!leitura.ok) return { numero: indice + 1, erro: { linha: leitura.linha, coluna: leitura.coluna, mensagem: leitura.mensagem }, itens: [] };
    const raiz = leitura.valor;
    const lista: { valor: { [chave: string]: Json }; herdado: boolean }[] = [];
    if (Array.isArray(raiz)) {
      for (const item of raiz) if (ehObjetoJson(item)) lista.push({ valor: item, herdado: false });
    } else if (ehObjetoJson(raiz)) {
      const grafo = raiz["@graph"];
      if (Array.isArray(grafo)) {
        const temContexto = typeof raiz["@context"] === "string";
        for (const item of grafo) if (ehObjetoJson(item)) lista.push({ valor: item, herdado: temContexto });
      } else {
        lista.push({ valor: raiz, herdado: false });
      }
    }
    return { numero: indice + 1, erro: null, itens: lista.map(({ valor, herdado }) => analisarItem(valor, herdado)) };
  });
}

function textoDe(valor: Json | undefined): string {
  if (typeof valor === "string") return valor.trim();
  if (typeof valor === "number") return String(valor);
  return "";
}

/** Endereço em uma linha: o texto, ou rua, cidade e estado do PostalAddress. */
function enderecoEmUmaLinha(valor: Json | undefined): string {
  if (typeof valor === "string") return valor.trim();
  if (!ehObjetoJson(valor)) return "";
  return ["streetAddress", "addressLocality", "addressRegion"].map((campo) => textoDe(valor[campo])).filter(Boolean).join(", ");
}

const DIAS: Record<string, string> = {
  Monday: "seg",
  Tuesday: "ter",
  Wednesday: "qua",
  Thursday: "qui",
  Friday: "sex",
  Saturday: "sáb",
  Sunday: "dom",
};

function nomeDoDia(valor: Json): string {
  const texto = textoDe(valor).replace(/^https?:\/\/schema\.org\//, "");
  return DIAS[texto] ?? texto;
}

/** Horário em uma linha: openingHours (texto) ou o primeiro openingHoursSpecification. */
function horarioEmUmaLinha(valor: { [chave: string]: Json }): string | null {
  const simples = valor.openingHours;
  if (typeof simples === "string" && simples.trim()) return simples.trim();
  if (Array.isArray(simples) && simples.length > 0) return simples.map(textoDe).filter(Boolean).join("; ");
  const especificacao = valor.openingHoursSpecification;
  const primeira = Array.isArray(especificacao) ? especificacao[0] : especificacao;
  if (!ehObjetoJson(primeira)) return null;
  const dias = primeira.dayOfWeek;
  const nomes = Array.isArray(dias) ? dias.map(nomeDoDia) : dias !== undefined ? [nomeDoDia(dias)] : [];
  const abre = textoDe(primeira.opens);
  const fecha = textoDe(primeira.closes);
  if (!abre || !fecha) return null;
  return `${nomes.length > 0 ? `${nomes.join(", ")}: ` : ""}${abre} às ${fecha}`;
}

/** O cartão no mapa: o primeiro negócio local válido (sem obrigatório faltando). */
export function negocioDosDados(blocos: readonly BlocoEstruturado[]): NegocioNoMapa | null {
  for (const bloco of blocos) {
    for (const item of bloco.itens) {
      if (!item.negocioLocal || item.faltam.length > 0 || !item.tipo) continue;
      const endereco = enderecoEmUmaLinha(item.valor.address);
      if (!endereco) continue;
      return {
        nome: textoDe(item.valor.name),
        tipo: item.tipo,
        endereco,
        horario: horarioEmUmaLinha(item.valor),
        telefone: textoDe(item.valor.telephone) || null,
      };
    }
  }
  return null;
}

/**
 * O validador `dadosEstruturados`: algum bloco válido tem um item do tipo
 * pedido (LocalBusiness aceita os subtipos conhecidos) com todos os campos
 * preenchidos (caminhos com ponto valem: "address.streetAddress").
 */
export function conferirDadosEstruturados(
  documento: Document,
  tipoSchema: string,
  campos: readonly string[],
): { passou: boolean; detalhe: string } {
  const blocos = analisarDadosEstruturados(documento);
  if (blocos.length === 0) return { passou: false, detalhe: "nenhum script application/ld+json na página" };
  const invalido = blocos.find((bloco) => bloco.erro !== null);
  const itens = blocos.flatMap((bloco) => bloco.itens);
  const doTipo = itens.filter((item) => item.tipo === tipoSchema || (tipoSchema === "LocalBusiness" && item.negocioLocal));
  if (doTipo.length === 0) {
    const achados = itens.map((item) => item.tipo ?? "sem @type").join(", ");
    return {
      passou: false,
      detalhe: invalido ? `JSON inválido no bloco ${invalido.numero} (linha ${invalido.erro?.linha})` : `nenhum item ${tipoSchema} (achei: ${achados || "nada"})`,
    };
  }
  for (const item of doTipo) {
    const faltam = campos.filter((campo) => !campoPreenchido(campoDoItem(item.valor, campo)));
    if (faltam.length === 0) return { passou: true, detalhe: `${item.tipo} com ${campos.join(", ") || "o tipo certo"}` };
    if (item === doTipo[doTipo.length - 1]) return { passou: false, detalhe: `${item.tipo} sem ${faltam.join(", ")}` };
  }
  return { passou: false, detalhe: "" };
}
