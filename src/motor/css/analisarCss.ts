/*
 * Analisador de CSS próprio, pequeno e com posições.
 *
 * Ele não tenta entender o CSS inteiro: só separa regras, seletores e
 * declarações e guarda ONDE cada pedaço mora no texto (início e fim do
 * nome, do valor, da declaração inteira e da linha). É isso que deixa o
 * painel Estilos editar o texto da folha sem bagunçar a formatação de quem
 * escreveu, e o link "estilo.css:12" levar à linha certa.
 *
 * Como o Chrome, declarações comentadas dentro de uma regra
 * (`/* color: red; *\/`) viram declarações DESLIGADAS: é assim que a
 * checkbox do painel desliga uma propriedade (devtools-frontend,
 * CSSProperty.setDisabled).
 *
 * Coisas que o motor não sabe ordenar na cascata (@layer, @import, CSS
 * aninhado, @container, @scope) marcam a folha como `incerta`: aí o motor
 * não risca nada (é melhor deixar de riscar do que riscar errado).
 *
 * Sem DOM: roda igual no navegador e no jsdom dos testes.
 */

export type Declaracao = {
  /** Nome em minúsculas (propriedades personalizadas, `--algo`, mantêm o que foi escrito). */
  propriedade: string;
  /** Valor sem o `!important` e sem espaços nas pontas. */
  valor: string;
  /** O valor como está escrito (com o `!important`, se tiver). */
  valorBruto: string;
  importante: boolean;
  /** Falso quando a declaração está comentada (a checkbox do painel desligada). */
  ativa: boolean;
  /** Trecho inteiro no texto: do nome ao `;` (ou o comentário inteiro, se desligada). */
  inicio: number;
  fim: number;
  inicioNome: number;
  fimNome: number;
  /** Onde o valor bruto mora (com o `!important`). */
  inicioValor: number;
  fimValor: number;
  /** Linha (a partir de 1) onde a declaração começa. */
  linha: number;
  /** A declaração termina com `;` no texto. */
  temPontoEVirgula: boolean;
};

/** @media e @supports em volta de uma regra. */
export type Condicao = { tipo: "media" | "supports"; texto: string };

export type Regra = {
  /** Texto do seletor, aparado (pode ser uma lista: "h1, h2"). */
  seletor: string;
  /** Do começo do seletor ao `}`. */
  inicio: number;
  fim: number;
  inicioSeletor: number;
  fimSeletor: number;
  /** Entre as chaves (sem as chaves). */
  inicioCorpo: number;
  fimCorpo: number;
  /** Linha (a partir de 1) do seletor. */
  linha: number;
  declaracoes: Declaracao[];
  condicoes: Condicao[];
};

export type FolhaAnalisada = {
  texto: string;
  regras: Regra[];
  /** Tem algo que o motor não sabe ordenar (@layer, @import, aninhamento...). */
  incerta: boolean;
  /** O porquê de `incerta`, para mensagens. */
  motivoIncerta: string | null;
};

type Leitor = {
  texto: string;
  pos: number;
  linhas: number[];
  incerta: string | null;
};

/** Começo de cada linha, para achar a linha de uma posição. */
function inicioDasLinhas(texto: string): number[] {
  const inicios = [0];
  for (let i = 0; i < texto.length; i++) if (texto[i] === "\n") inicios.push(i + 1);
  return inicios;
}

/** Linha (a partir de 1) de uma posição. */
export function linhaDaPosicao(linhas: readonly number[], posicao: number): number {
  let baixo = 0;
  let alto = linhas.length - 1;
  while (baixo < alto) {
    const meio = (baixo + alto + 1) >> 1;
    if (linhas[meio] <= posicao) baixo = meio;
    else alto = meio - 1;
  }
  return baixo + 1;
}

function ehEspaco(caractere: string | undefined): boolean {
  return caractere === " " || caractere === "\n" || caractere === "\t" || caractere === "\r" || caractere === "\f";
}

/** Fim de um comentário que começa em `inicio` (logo depois do `*\/`). */
function fimDoComentario(texto: string, inicio: number): number {
  const fim = texto.indexOf("*/", inicio + 2);
  return fim < 0 ? texto.length : fim + 2;
}

/** Fim de uma string que começa em `inicio` (logo depois da aspa de fechar). */
function fimDaString(texto: string, inicio: number): number {
  const aspa = texto[inicio];
  let i = inicio + 1;
  while (i < texto.length) {
    if (texto[i] === "\\") i += 2;
    else if (texto[i] === aspa || texto[i] === "\n") return i + 1;
    else i++;
  }
  return texto.length;
}

/**
 * Avança até um dos `paradas`, fora de strings, comentários, parênteses e
 * colchetes. Devolve a posição da parada (ou o fim do texto).
 */
function avancarAte(texto: string, inicio: number, paradas: string): number {
  let profundidade = 0;
  let i = inicio;
  while (i < texto.length) {
    const c = texto[i];
    if (c === "/" && texto[i + 1] === "*") {
      i = fimDoComentario(texto, i);
      continue;
    }
    if (c === '"' || c === "'") {
      i = fimDaString(texto, i);
      continue;
    }
    if (c === "\\") {
      i += 2;
      continue;
    }
    if (c === "(" || c === "[") profundidade++;
    else if ((c === ")" || c === "]") && profundidade > 0) profundidade--;
    else if (profundidade === 0 && paradas.includes(c)) return i;
    i++;
  }
  return texto.length;
}

/** Fim de um bloco `{...}` que começa em `abre` (logo depois do `}` que fecha). */
function fimDoBloco(texto: string, abre: number): number {
  let profundidade = 0;
  let i = abre;
  while (i < texto.length) {
    const c = texto[i];
    if (c === "/" && texto[i + 1] === "*") {
      i = fimDoComentario(texto, i);
      continue;
    }
    if (c === '"' || c === "'") {
      i = fimDaString(texto, i);
      continue;
    }
    if (c === "\\") {
      i += 2;
      continue;
    }
    if (c === "{") profundidade++;
    else if (c === "}") {
      profundidade--;
      if (profundidade === 0) return i + 1;
    }
    i++;
  }
  return texto.length;
}

function aparar(texto: string, inicio: number, fim: number): { inicio: number; fim: number } {
  let a = inicio;
  let b = fim;
  while (a < b && ehEspaco(texto[a])) a++;
  while (b > a && ehEspaco(texto[b - 1])) b--;
  return { inicio: a, fim: b };
}

const IMPORTANTE = /!\s*important\s*$/i;

/** Nome de propriedade aceito (com ou sem prefixo, ou personalizada). */
const NOME_PROPRIEDADE = /^-{0,2}[a-zA-Z_][a-zA-Z0-9_-]*$/;

/**
 * Monta uma declaração a partir do trecho `nome: valor` que vai de
 * `inicio` a `fim` (sem o `;`). Devolve null se não tem dois pontos ou o
 * nome não serve.
 */
function montarDeclaracao(
  leitor: Leitor,
  inicio: number,
  fim: number,
  extra: { ativa: boolean; inicioTrecho: number; fimTrecho: number; temPontoEVirgula: boolean },
): Declaracao | null {
  const { texto } = leitor;
  const doisPontos = avancarAte(texto, inicio, ":");
  if (doisPontos >= fim) return null;
  const nome = aparar(texto, inicio, doisPontos);
  const valor = aparar(texto, doisPontos + 1, fim);
  const nomeTexto = texto.slice(nome.inicio, nome.fim);
  if (!NOME_PROPRIEDADE.test(nomeTexto)) return null;
  const valorBruto = texto.slice(valor.inicio, valor.fim);
  const importante = IMPORTANTE.test(valorBruto);
  return {
    propriedade: nomeTexto.startsWith("--") ? nomeTexto : nomeTexto.toLowerCase(),
    valor: importante ? valorBruto.replace(IMPORTANTE, "").trim() : valorBruto,
    valorBruto,
    importante,
    ativa: extra.ativa,
    inicio: extra.inicioTrecho,
    fim: extra.fimTrecho,
    inicioNome: nome.inicio,
    fimNome: nome.fim,
    inicioValor: valor.inicio,
    fimValor: valor.fim,
    linha: linhaDaPosicao(leitor.linhas, extra.inicioTrecho),
    temPontoEVirgula: extra.temPontoEVirgula,
  };
}

/**
 * Lê as declarações entre `inicio` e `fim` (o corpo de uma regra ou o
 * atributo style inteiro). Comentário com uma declaração dentro vira
 * declaração desligada.
 */
function lerDeclaracoes(leitor: Leitor, inicio: number, fim: number): Declaracao[] {
  const { texto } = leitor;
  const declaracoes: Declaracao[] = [];
  let i = inicio;
  while (i < fim) {
    const c = texto[i];
    if (ehEspaco(c) || c === ";") {
      i++;
      continue;
    }
    if (c === "/" && texto[i + 1] === "*") {
      const fimComentario = Math.min(fimDoComentario(texto, i), fim);
      // Conteúdo do comentário, sem o /* e o */.
      const dentroInicio = i + 2;
      const dentroFim = texto.slice(fimComentario - 2, fimComentario) === "*/" ? fimComentario - 2 : fimComentario;
      const miolo = aparar(texto, dentroInicio, dentroFim);
      let fimMiolo = miolo.fim;
      const temPontoEVirgula = texto[fimMiolo - 1] === ";";
      if (temPontoEVirgula) fimMiolo--;
      // Só vira declaração se for UMA declaração (sem ; no meio).
      if (avancarAte(texto, miolo.inicio, ";") >= fimMiolo) {
        const desligada = montarDeclaracao(leitor, miolo.inicio, fimMiolo, {
          ativa: false,
          inicioTrecho: i,
          fimTrecho: fimComentario,
          temPontoEVirgula,
        });
        if (desligada) declaracoes.push(desligada);
      }
      i = fimComentario;
      continue;
    }
    if (c === "{") {
      // CSS aninhado: o motor não sabe ordenar.
      leitor.incerta ??= "CSS aninhado (uma regra dentro de outra)";
      i = fimDoBloco(texto, i);
      continue;
    }
    const parada = Math.min(avancarAte(texto, i, ";{}"), fim);
    if (texto[parada] === "{") {
      // Um seletor aninhado dentro da regra: pula o bloco inteiro.
      leitor.incerta ??= "CSS aninhado (uma regra dentro de outra)";
      i = fimDoBloco(texto, parada);
      continue;
    }
    const temPontoEVirgula = texto[parada] === ";" && parada < fim;
    const trecho = aparar(texto, i, parada);
    const declaracao = montarDeclaracao(leitor, trecho.inicio, trecho.fim, {
      ativa: true,
      inicioTrecho: trecho.inicio,
      fimTrecho: temPontoEVirgula ? parada + 1 : trecho.fim,
      temPontoEVirgula,
    });
    if (declaracao) declaracoes.push(declaracao);
    i = temPontoEVirgula ? parada + 1 : Math.max(parada, i + 1);
  }
  return declaracoes;
}

/** Lê regras entre `inicio` e `fim`, com as condições (@media, @supports) de fora. */
function lerRegras(leitor: Leitor, inicio: number, fim: number, condicoes: Condicao[], regras: Regra[]): void {
  const { texto } = leitor;
  let i = inicio;
  while (i < fim) {
    const c = texto[i];
    if (ehEspaco(c) || c === ";" || c === "}") {
      i++;
      continue;
    }
    if (c === "/" && texto[i + 1] === "*") {
      i = fimDoComentario(texto, i);
      continue;
    }
    if (c === "<" && texto.startsWith("<!--", i)) {
      i += 4;
      continue;
    }
    if (c === "-" && texto.startsWith("-->", i)) {
      i += 3;
      continue;
    }
    if (c === "@") {
      const parada = Math.min(avancarAte(texto, i, ";{"), fim);
      const cabecalho = texto.slice(i + 1, parada).trim();
      const nome = (/^[-a-zA-Z]+/.exec(cabecalho)?.[0] ?? "").toLowerCase();
      const prelude = cabecalho.slice(nome.length).trim();
      if (texto[parada] !== "{") {
        // @import, @charset, @layer a, b; ...
        if (nome === "import" || nome === "layer") leitor.incerta ??= `@${nome}`;
        i = parada + 1;
        continue;
      }
      const fimBloco = Math.min(fimDoBloco(texto, parada), fim);
      if (nome === "media" || nome === "supports") {
        lerRegras(leitor, parada + 1, fimBloco - 1, [...condicoes, { tipo: nome, texto: prelude }], regras);
      } else if (nome === "layer" || nome === "container" || nome === "scope" || nome === "starting-style") {
        leitor.incerta ??= `@${nome}`;
      }
      // @font-face, @keyframes, @page e outros: não são regras de elementos.
      i = fimBloco;
      continue;
    }
    const abre = Math.min(avancarAte(texto, i, "{};"), fim);
    if (texto[abre] !== "{" || abre >= fim) {
      // Lixo sem bloco (ex.: um seletor pela metade no fim do texto).
      i = abre + 1;
      continue;
    }
    const fimBloco = Math.min(fimDoBloco(texto, abre), fim);
    const seletor = aparar(texto, i, abre);
    const fechou = texto[fimBloco - 1] === "}";
    const fimCorpo = fechou ? fimBloco - 1 : fimBloco;
    regras.push({
      seletor: texto.slice(seletor.inicio, seletor.fim),
      inicio: seletor.inicio,
      fim: fimBloco,
      inicioSeletor: seletor.inicio,
      fimSeletor: seletor.fim,
      inicioCorpo: abre + 1,
      fimCorpo,
      linha: linhaDaPosicao(leitor.linhas, seletor.inicio),
      declaracoes: lerDeclaracoes(leitor, abre + 1, fimCorpo),
      condicoes,
    });
    i = fimBloco;
  }
}

/** Analisa uma folha de estilo inteira. */
export function analisarCss(texto: string): FolhaAnalisada {
  const leitor: Leitor = { texto, pos: 0, linhas: inicioDasLinhas(texto), incerta: null };
  const regras: Regra[] = [];
  lerRegras(leitor, 0, texto.length, [], regras);
  return { texto, regras, incerta: leitor.incerta !== null, motivoIncerta: leitor.incerta };
}

/** Analisa o conteúdo de um atributo style (só declarações). */
export function analisarEstiloInline(texto: string): Declaracao[] {
  const leitor: Leitor = { texto, pos: 0, linhas: inicioDasLinhas(texto), incerta: null };
  return lerDeclaracoes(leitor, 0, texto.length);
}

/** Onde cada linha começa (útil para quem converte posição em linha). */
export function linhasDoTexto(texto: string): number[] {
  return inicioDasLinhas(texto);
}
