/*
 * O "Meu tema" (E5): as cores que o jogador salvou a partir da maquete do
 * jogo. Moram no progresso (`progresso.meuTema`), nunca em código: o
 * tokens.css continua sendo o único lugar com cores do jogo, e o Meu tema
 * é um DADO do jogador, como um texto que ele escreveu.
 *
 * Na tela, vira um <style id="estilo-meu-tema"> com `[data-theme="meu"]
 * { --cor-...: ...; }` (cssDoMeuTema), posto pelo script de antes da
 * pintura (src/tema/scriptTemaInicial.ts) e mantido pelo EstiloMeuTema.
 *
 * Só entram nomes `--cor-*` e valores que o motor lê como cor: nada de
 * texto solto dentro de um <style>.
 */
import { contrasteEntre, CONTRASTE_MINIMO, luminancia } from "@/lib/contraste";
import { lerCor } from "@/motor/css/valores";
import { ehNomeDeToken, TEMAS_DE_BASE, type TemaDeBase, type Tokens } from "@/tema/tokensDoJogo";

export type MeuTema = {
  /** Todas as cores do tema (as da maquete mais as do tema de base). */
  cores: Tokens;
  /** O tema de onde ele partiu (as cores que a maquete não mostra vêm dele). */
  base: TemaDeBase;
  /** Fundo escuro: o navegador usa barras de rolagem e campos escuros (color-scheme). */
  escuro: boolean;
};

/** Um par que precisa de contraste: o texto e o fundo em que ele aparece. */
export type ParContraste = { texto: string; fundo: string; nome: string };

/** Os pares principais do jogo: texto e fundo, texto e botão. */
export const PARES_PRINCIPAIS: readonly ParContraste[] = [
  { texto: "--cor-texto", fundo: "--cor-fundo", nome: "texto no fundo da tela" },
  { texto: "--cor-texto", fundo: "--cor-superficie", nome: "texto nos cartões" },
  { texto: "--cor-texto", fundo: "--cor-painel", nome: "texto no painel" },
  { texto: "--cor-texto-suave", fundo: "--cor-superficie", nome: "texto suave nos cartões" },
  { texto: "--cor-texto-sobre-primaria", fundo: "--cor-primaria", nome: "texto no botão principal" },
  { texto: "--cor-texto-sobre-secundaria", fundo: "--cor-secundaria", nome: "texto no botão secundário" },
  { texto: "--cor-texto-sobre-destaque", fundo: "--cor-destaque", nome: "texto no destaque (as estrelas)" },
];

export type ResultadoPar = ParContraste & { razao: number | null; bom: boolean };

/** O contraste de cada par principal; par com cor que o motor não lê conta como ruim. */
export function conferirContraste(cores: Tokens): ResultadoPar[] {
  return PARES_PRINCIPAIS.map((par) => {
    const texto = cores[par.texto];
    const fundo = cores[par.fundo];
    const razao = texto !== undefined && fundo !== undefined ? contrasteEntre(texto, fundo) : null;
    return { ...par, razao, bom: razao !== null && razao >= CONTRASTE_MINIMO };
  });
}

/** Valor que pode ir para dentro de um <style>: uma cor que o motor lê, sem nada estranho. */
export function valorDeCorSeguro(valor: string): boolean {
  return /^[#a-z0-9(),.%\s/+-]+$/i.test(valor) && lerCor(valor) !== null;
}

/** Só os tokens com nome --cor-* e valor de cor seguro. */
export function limparCores(bruto: unknown): Tokens {
  const cores: Tokens = {};
  if (typeof bruto !== "object" || bruto === null || Array.isArray(bruto)) return cores;
  for (const [nome, valor] of Object.entries(bruto)) {
    if (ehNomeDeToken(nome) && typeof valor === "string" && valorDeCorSeguro(valor.trim())) cores[nome] = valor.trim();
  }
  return cores;
}

/** Fundo escuro? (luminância do --cor-fundo abaixo da metade) */
export function fundoEscuro(cores: Tokens): boolean {
  const fundo = cores["--cor-fundo"] ? lerCor(cores["--cor-fundo"]) : null;
  return fundo ? luminancia(fundo) < 0.4 : false;
}

/** O Meu tema salvo no progresso, conferido (null se não há ou não serve). */
export function lerMeuTema(bruto: unknown): MeuTema | null {
  if (typeof bruto !== "object" || bruto === null || Array.isArray(bruto)) return null;
  const registro = bruto as Record<string, unknown>;
  const cores = limparCores(registro.cores);
  if (Object.keys(cores).length === 0) return null;
  const base = TEMAS_DE_BASE.includes(registro.base as TemaDeBase) ? (registro.base as TemaDeBase) : "doce";
  return { cores, base, escuro: typeof registro.escuro === "boolean" ? registro.escuro : fundoEscuro(cores) };
}

/** O tema pronto para salvar: as cores de base cobertas pelas da maquete. */
export function montarMeuTema(base: TemaDeBase, coresDaBase: Tokens, coresNovas: Tokens): MeuTema {
  const cores = limparCores({ ...coresDaBase, ...coresNovas });
  return { cores, base, escuro: fundoEscuro(cores) };
}

/** O CSS que aplica o Meu tema (só com o que passou pela limpeza). */
export function cssDoMeuTema(tema: MeuTema): string {
  const linhas = Object.entries(limparCores(tema.cores)).map(([nome, valor]) => `${nome}:${valor};`);
  return `[data-theme="meu"]{color-scheme:${tema.escuro ? "dark" : "light"};${linhas.join("")}}`;
}

/** Id do <style> do Meu tema no <head> da página do jogo. */
export const ID_ESTILO_MEU_TEMA = "estilo-meu-tema";

/**
 * De onde a maquete do jogo tira as cores quando a fase abre: o tema que o
 * jogador está usando (o Meu tema, se for ele). `base` é o tema de base e
 * `cores`, o conjunto completo, para o salvar cobrir só o que mudou.
 */
export function coresDoTemaAtual(progresso: { tema: string; meuTema: MeuTema | null }): { base: TemaDeBase; cores: Tokens | null } {
  if (progresso.tema === "meu" && progresso.meuTema) return { base: progresso.meuTema.base, cores: progresso.meuTema.cores };
  const base = TEMAS_DE_BASE.includes(progresso.tema as TemaDeBase) ? (progresso.tema as TemaDeBase) : "doce";
  return { base, cores: null };
}
