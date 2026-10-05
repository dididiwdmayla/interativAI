/*
 * Checagem de uma cena (dado de conteúdo): peças do kit que existem,
 * dispositivos com nomes de variável válidos e linha do tempo dentro da
 * duração. Usada pela regra "composicao" do testar:conteudo.
 */
import type { Validador } from "@/conteudo/tipos";
import { ACOES_DO_TIPO, CATALOGO_DISPOSITIVOS, ehTipoDispositivo, NOMES_RESERVADOS } from "./catalogo";
import { type AcontecimentoCena, type DadosCena, DURACAO_MAXIMA_MS, DURACAO_MINIMA_MS, PECAS_CENARIO, type ValorCena } from "./modelo";

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
    if (dispositivo.nome !== undefined && (!dispositivo.nome.trim() || dispositivo.nome.length > 24)) problemas.push(`o dispositivo "${id}" tem nome com ${dispositivo.nome.length} letras (de 1 a 24)`);
    for (const [nome, valor] of Object.entries(dispositivo.inicial ?? {})) {
      // O relógio começa na hora que a cena diz (o resto do tempo é o mundo que conta).
      if (dispositivo.tipo === "relogio" && nome === "hora") {
        if (typeof valor !== "number" || !Number.isInteger(valor) || valor < 0 || valor > 23) problemas.push(`o relógio "${id}" começa na hora ${String(valor)} (de 0 a 23)`);
        continue;
      }
      const propriedade = ficha.propriedades.find((p) => p.nome === nome);
      if (!propriedade || (propriedade.doMundo && !propriedade.entradaTemporal)) {
        problemas.push(`o dispositivo "${id}" começa com "${nome}", que não é do estado de ${ficha.nome.toLowerCase()}`);
        continue;
      }
      const tipo = typeof valor === "boolean" ? "booleano" : typeof valor === "number" ? "número" : "texto";
      if (tipo !== propriedade.tipo) problemas.push(`o dispositivo "${id}" começa com ${nome} do tipo ${tipo} (é ${propriedade.tipo})`);
    }
  }
  const atores = new Set<string>();
  for (const ator of cena.atores ?? []) {
    if (!KEBAB.test(ator.id) || atores.has(ator.id)) problemas.push(`ator inválido ou repetido: ${ator.id}`);
    atores.add(ator.id);
    if (![ator.x, ator.y, ator.escala ?? 1].every(Number.isFinite) || (ator.escala ?? 1) <= 0) problemas.push(`ator ${ator.id}: posição/escala inválida`);
    if (!["pessoa", "carro"].includes(ator.desenho)) problemas.push(`ator ${ator.id}: desenho desconhecido`);
    if (ator.visivelQuando) { const c = ator.visivelQuando; problemas.push(...conferirPropriedade(cena, ator.id, c.dispositivo, c.propriedade, c.valor)); }
    for (const [nome, acao] of Object.entries(ator.acoes)) {
      if (!KEBAB.test(nome) || !Number.isFinite(acao.duracaoMs) || acao.duracaoMs <= 0 || acao.duracaoMs > cena.duracaoMs || ![acao.destino.x, acao.destino.y].every(Number.isFinite)) problemas.push(`ator ${ator.id}: ação inválida`);
      for (const c of acao.aoConcluir ?? []) problemas.push(...conferirEntrada(cena, ator.id, c.dispositivo, c.propriedade, c.valor));
    }
  }
  for (const regra of cena.reacoes ?? []) {
    const ator = cena.atores?.find(a => a.id === regra.entao.ator);
    if (!ator?.acoes[regra.entao.acao]) problemas.push(`reação: ator/ação inexistente`);
    if (!Number.isFinite(regra.atrasoMs ?? 0) || (regra.atrasoMs ?? 0) < 0 || (regra.atrasoMs ?? 0) > cena.duracaoMs) problemas.push(`reação: atraso inválido`);
    for (const c of [regra.quando, ...(regra.se ?? [])]) problemas.push(...conferirPropriedade(cena, "reação", c.dispositivo, c.propriedade, c.valor));
  }
  if (cena.periodoPor) problemas.push(...conferirPropriedade(cena, "periodoPor", cena.periodoPor.dispositivo, cena.periodoPor.propriedade, true));
  problemas.push(...conferirLinhaDoTempo(cena, cena.linhaDoTempo));
  const temSensor = cena.dispositivos.some((d) => d.tipo === "sensor");
  const temPessoa = cena.linhaDoTempo.some((item) => item.tipo === "pessoa");
  const temEntrada = cena.linhaDoTempo.some(e => e.tipo === undefined && cena.dispositivos.some(d => d.id === e.dispositivo && d.tipo === "sensor"));
  if (temSensor && !temPessoa && !temEntrada) problemas.push("a cena tem sensor de presença, mas ninguém aparece na linha do tempo");
  return problemas;
}

/** Os acontecimentos de uma linha do tempo (a da cena ou uma do variosCenarios) dentro da duração e com dispositivos que existem. */
export function conferirLinhaDoTempo(cena: DadosCena, linha: readonly AcontecimentoCena[], rotulo = "linhaDoTempo"): string[] {
  const problemas: string[] = [];
  linha.forEach((item, i) => {
    const onde = `${rotulo}[${i}]`;
    const dentro = (ms: number) => Number.isFinite(ms) && ms >= 0 && ms < cena.duracaoMs;
    if (item.tipo === "pessoa") {
      if (!dentro(item.chegaMs)) problemas.push(`${onde}: a pessoa chega em ${item.chegaMs} ms, fora da cena (de 0 a ${cena.duracaoMs})`);
      if (item.saiMs !== undefined && (!Number.isFinite(item.saiMs) || item.saiMs <= item.chegaMs)) problemas.push(`${onde}: a pessoa sai em ${item.saiMs} ms, antes de chegar`);
      if (item.saiMs !== undefined && item.saiMs > cena.duracaoMs) problemas.push(`${onde}: a pessoa sai em ${item.saiMs} ms, depois do fim da cena`);
    } else if (item.tipo === "interruptor") {
      if (!dentro(item.noMs)) problemas.push(`${onde}: o interruptor é apertado em ${item.noMs} ms, fora da cena`);
      const alvo = cena.dispositivos.find((d) => d.id === item.dispositivo);
      if (!alvo || alvo.tipo !== "interruptor") problemas.push(`${onde}: "${item.dispositivo}" não é um interruptor da cena`);
    } else if (item.tipo === undefined && ("em" in item || "de" in item)) {
      const valores = "em" in item ? [item.valor] : [item.valorInicial, item.valorFinal];
      for (const valor of valores) problemas.push(...conferirEntrada(cena, onde, item.dispositivo, item.propriedade, valor));
      if ("em" in item) {
        if (!dentro(item.em)) problemas.push(`${onde}: instante fora da cena`);
      } else {
        if (!dentro(item.de) || !Number.isFinite(item.ate) || item.ate <= item.de || item.ate > cena.duracaoMs) problemas.push(`${onde}: intervalo gradual inválido`);
        if (typeof item.valorInicial !== "number" || typeof item.valorFinal !== "number") problemas.push(`${onde}: mudança gradual exige números`);
      }
    } else {
      problemas.push(`${onde}: acontecimento de tipo desconhecido`);
    }
  });
  return problemas;
}

function tipoDoValor(valor: ValorCena): "booleano" | "número" | "texto" {
  return typeof valor === "boolean" ? "booleano" : typeof valor === "number" ? "número" : "texto";
}

/** A propriedade existe no dispositivo e o valor é do tipo dela. */
function conferirPropriedade(cena: DadosCena, onde: string, dispositivo: string, propriedade: string, valor: ValorCena): string[] {
  const alvo = cena.dispositivos.find((d) => d.id === dispositivo);
  if (!alvo) return [`${onde}: a cena não tem o dispositivo "${dispositivo}"`];
  const ficha = CATALOGO_DISPOSITIVOS[alvo.tipo];
  const prop = ficha.propriedades.find((p) => p.nome === propriedade);
  if (!prop) return [`${onde}: ${ficha.nome.toLowerCase()} não tem a propriedade "${propriedade}" (tem ${ficha.propriedades.map((p) => p.nome).join(", ")})`];
  if (tipoDoValor(valor) !== prop.tipo) return [`${onde}: ${dispositivo}.${propriedade} é ${prop.tipo}, e o valor é ${tipoDoValor(valor)}`];
  return [];
}

/** Entradas externas só alteram propriedades do mundo, com tipo e faixa válidos. */
function conferirEntrada(cena: DadosCena, onde: string, dispositivo: string, propriedade: string, valor: ValorCena): string[] {
  const problemas = conferirPropriedade(cena, onde, dispositivo, propriedade, valor);
  const alvo = cena.dispositivos.find(d => d.id === dispositivo);
  const prop = alvo && CATALOGO_DISPOSITIVOS[alvo.tipo]?.propriedades.find(p => p.nome === propriedade);
  if (prop && !prop.doMundo) problemas.push(`${onde}: ${dispositivo}.${propriedade} é controlada pelo código, não pelo mundo`);
  if (typeof valor === "number" && (!Number.isFinite(valor) || (prop?.faixa && (valor < prop.faixa[0] || valor > prop.faixa[1])))) problemas.push(`${onde}: valor numérico fora da faixa`);
  return problemas;
}

/** A ação existe no tipo do dispositivo (as que aparecem no rastro). */
function conferirAcao(cena: DadosCena, onde: string, dispositivo: string, acao: string): string[] {
  const alvo = cena.dispositivos.find((d) => d.id === dispositivo);
  if (!alvo) return [`${onde}: a cena não tem o dispositivo "${dispositivo}"`];
  const acoes = ACOES_DO_TIPO[alvo.tipo];
  if (!acoes.includes(acao)) return [`${onde}: ${dispositivo} não faz "${acao}" (${acoes.length ? `faz ${acoes.join(", ")}` : "ele só é lido, não faz ações"})`];
  return [];
}

/**
 * Um validador de cena (estadoNaCena, sequenciaNaCena, reagiu,
 * variosCenarios) com dispositivos, propriedades, ações e instantes que
 * existem na cena.
 */
export function conferirValidadorDeCena(validador: Validador, cena: DadosCena, onde: string): string[] {
  const problemas: string[] = [];
  switch (validador.tipo) {
    case "estadoNaCena":
      problemas.push(...conferirPropriedade(cena, onde, validador.dispositivo, validador.propriedade, validador.valor));
      if (validador.noTempo !== undefined && (validador.noTempo < 0 || validador.noTempo > cena.duracaoMs)) problemas.push(`${onde}: estadoNaCena no instante ${validador.noTempo} ms, fora da cena`);
      break;
    case "sequenciaNaCena":
      if (!validador.eventos.length) problemas.push(`${onde}: sequenciaNaCena sem eventos`);
      for (const evento of validador.eventos) {
        problemas.push(...conferirAcao(cena, onde, validador.dispositivo, evento.acao));
        if ((evento.aposMs !== undefined && evento.aposMs < 0) || (evento.toleranciaMs !== undefined && evento.toleranciaMs < 0)) problemas.push(`${onde}: sequenciaNaCena com tempo negativo`);
      }
      break;
    case "reagiu":
      problemas.push(...conferirPropriedade(cena, onde, validador.quando.dispositivo, validador.quando.propriedade, validador.quando.valor));
      problemas.push(...conferirAcao(cena, onde, validador.entao.dispositivo, validador.entao.acao));
      if (!(validador.prazoMs > 0) || validador.prazoMs > cena.duracaoMs) problemas.push(`${onde}: reagiu com prazoMs ${validador.prazoMs} (de 1 até a duração da cena)`);
      break;
    case "variosCenarios": {
      if (validador.linhasDoTempo.length < 2) problemas.push(`${onde}: variosCenarios com ${validador.linhasDoTempo.length} linha(s) do tempo (pelo menos 2: é o que impede o código decorado)`);
      validador.linhasDoTempo.forEach((linha, i) => problemas.push(...conferirLinhaDoTempo(cena, linha, `${onde}: linhasDoTempo[${i}]`)));
      const dentro = (v: Validador): Validador[] => (v.tipo === "todos" || v.tipo === "algum" ? [v, ...v.validadores.flatMap(dentro)] : v.tipo === "nao" ? [v, ...dentro(v.validador)] : [v]);
      if (validador.porLinha && validador.porLinha.length !== validador.linhasDoTempo.length) {
        problemas.push(`${onde}: variosCenarios com ${validador.porLinha.length} validador(es) em porLinha para ${validador.linhasDoTempo.length} linhas do tempo (um para cada)`);
      }
      for (const item of [...dentro(validador.validador), ...(validador.porLinha ?? []).flatMap(dentro)]) {
        if (item.tipo === "variosCenarios") problemas.push(`${onde}: variosCenarios dentro de variosCenarios`);
        else if (!["estadoNaCena", "sequenciaNaCena", "reagiu", "todos", "algum", "nao"].includes(item.tipo)) problemas.push(`${onde}: dentro do variosCenarios só valem validadores de cena (veio ${item.tipo})`);
      }
      break;
    }
    default:
      break;
  }
  return problemas;
}
