/*
 * Checagem de uma cena (dado de conteúdo): peças do kit que existem,
 * dispositivos com nomes de variável válidos e linha do tempo dentro da
 * duração. Usada pela regra "composicao" do testar:conteudo.
 */
import { CATALOGO_DISPOSITIVOS, ehTipoDispositivo, NOMES_RESERVADOS } from "./catalogo";
import { type DadosCena, DURACAO_MAXIMA_MS, DURACAO_MINIMA_MS, PECAS_CENARIO } from "./modelo";

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const NOME_JS = /^[A-Za-z_$][\w$]*$/;
/** Palavras do JavaScript que não podem ser nome de variável. */
const PALAVRAS = new Set(["break", "case", "catch", "class", "const", "continue", "debugger", "default", "delete", "do", "else", "export", "extends", "false", "finally", "for", "function", "if", "import", "in", "instanceof", "let", "new", "null", "return", "super", "switch", "this", "throw", "true", "try", "typeof", "var", "void", "while", "with", "yield"]);

/** No máximo tantos dispositivos e peças numa cena (cabe no celular e fica legível). */
export const MAXIMO_DISPOSITIVOS = 6;
export const MAXIMO_PECAS = 30;

export function conferirCena(cena: DadosCena): string[] {
  const problemas: string[] = [];
  if (!KEBAB.test(cena.id)) problemas.push(`cena.id "${cena.id}" não está em kebab-case`);
  if (!cena.titulo.trim() || cena.titulo.length > 40) problemas.push(`cena.titulo tem ${cena.titulo.length} caracteres (de 1 a 40)`);
  if (!KEBAB.test(cena.ambiente)) problemas.push(`cena.ambiente "${cena.ambiente}" não está em kebab-case`);
  if (cena.periodo !== "dia" && cena.periodo !== "noite") problemas.push(`cena.periodo "${String(cena.periodo)}" (use "dia" ou "noite")`);
  if (!Number.isInteger(cena.duracaoMs) || cena.duracaoMs < DURACAO_MINIMA_MS || cena.duracaoMs > DURACAO_MAXIMA_MS) {
    problemas.push(`cena.duracaoMs ${cena.duracaoMs} (de ${DURACAO_MINIMA_MS} a ${DURACAO_MAXIMA_MS}, em milissegundos inteiros)`);
  }
  if (cena.cenario.length > MAXIMO_PECAS) problemas.push(`o cenário tem ${cena.cenario.length} peças (no máximo ${MAXIMO_PECAS})`);
  cena.cenario.forEach((peca, i) => {
    if (!(PECAS_CENARIO as readonly string[]).includes(peca.peca)) problemas.push(`cenario[${i}]: a peça "${peca.peca}" não existe no kit`);
    for (const [nome, valor] of [["x", peca.x], ["y", peca.y], ["largura", peca.largura], ["altura", peca.altura]] as const) {
      if (valor !== undefined && !Number.isFinite(valor)) problemas.push(`cenario[${i}].${nome} não é um número`);
    }
    if ((peca.largura !== undefined && peca.largura <= 0) || (peca.altura !== undefined && peca.altura <= 0)) problemas.push(`cenario[${i}] com tamanho zero ou negativo`);
  });
  if (cena.dispositivos.length === 0) problemas.push("a cena precisa de pelo menos um dispositivo (é ele que o código controla)");
  if (cena.dispositivos.length > MAXIMO_DISPOSITIVOS) problemas.push(`a cena tem ${cena.dispositivos.length} dispositivos (no máximo ${MAXIMO_DISPOSITIVOS})`);
  const ids = new Set<string>();
  for (const dispositivo of cena.dispositivos) {
    const { id } = dispositivo;
    if (!NOME_JS.test(id) || PALAVRAS.has(id)) problemas.push(`o dispositivo "${id}" não tem um nome de variável válido`);
    if (NOMES_RESERVADOS.has(id)) problemas.push(`o dispositivo "${id}" usa um nome que o código já tem (${id})`);
    if (ids.has(id)) problemas.push(`dispositivo com id repetido: "${id}"`);
    ids.add(id);
    if (!ehTipoDispositivo(dispositivo.tipo)) {
      problemas.push(`o dispositivo "${id}" tem o tipo "${String(dispositivo.tipo)}", que não existe no catálogo`);
      continue;
    }
    if (!Number.isFinite(dispositivo.x) || !Number.isFinite(dispositivo.y)) problemas.push(`o dispositivo "${id}" sem posição (x, y)`);
    const ficha = CATALOGO_DISPOSITIVOS[dispositivo.tipo];
    for (const [nome, valor] of Object.entries(dispositivo.inicial ?? {})) {
      const propriedade = ficha.propriedades.find((p) => p.nome === nome);
      if (!propriedade || propriedade.doMundo) {
        problemas.push(`o dispositivo "${id}" começa com "${nome}", que não é do estado de ${ficha.nome.toLowerCase()}`);
        continue;
      }
      const tipo = typeof valor === "boolean" ? "booleano" : typeof valor === "number" ? "número" : "texto";
      if (tipo !== propriedade.tipo) problemas.push(`o dispositivo "${id}" começa com ${nome} do tipo ${tipo} (é ${propriedade.tipo})`);
    }
  }
  cena.linhaDoTempo.forEach((item, i) => {
    const onde = `linhaDoTempo[${i}]`;
    const dentro = (ms: number) => Number.isFinite(ms) && ms >= 0 && ms < cena.duracaoMs;
    if (item.tipo === "pessoa") {
      if (!dentro(item.chegaMs)) problemas.push(`${onde}: a pessoa chega em ${item.chegaMs} ms, fora da cena (de 0 a ${cena.duracaoMs})`);
      if (item.saiMs !== undefined && (!Number.isFinite(item.saiMs) || item.saiMs <= item.chegaMs)) problemas.push(`${onde}: a pessoa sai em ${item.saiMs} ms, antes de chegar`);
      if (item.saiMs !== undefined && item.saiMs > cena.duracaoMs) problemas.push(`${onde}: a pessoa sai em ${item.saiMs} ms, depois do fim da cena`);
    } else if (item.tipo === "interruptor") {
      if (!dentro(item.noMs)) problemas.push(`${onde}: o interruptor é apertado em ${item.noMs} ms, fora da cena`);
      const alvo = cena.dispositivos.find((d) => d.id === item.dispositivo);
      if (!alvo || alvo.tipo !== "interruptor") problemas.push(`${onde}: "${item.dispositivo}" não é um interruptor da cena`);
    } else {
      problemas.push(`${onde}: acontecimento de tipo desconhecido`);
    }
  });
  const temSensor = cena.dispositivos.some((d) => d.tipo === "sensor");
  const temPessoa = cena.linhaDoTempo.some((item) => item.tipo === "pessoa");
  if (temSensor && !temPessoa) problemas.push("a cena tem sensor de presença, mas ninguém aparece na linha do tempo");
  return problemas;
}
