/*
 * O que o motor de cascata sabe sobre as propriedades do CSS: quais são
 * herdadas, quais atalhos (shorthands) mexem em quais propriedades longas
 * (longhands), os grupos lógicos (margin-inline-start e margin-left falam
 * do mesmo lado) e o valor inicial das mais comuns.
 *
 * Fontes: as especificações do CSS (tabelas "Inherited", "Initial" e as
 * seções de shorthands de cada módulo) e o "Computed" do Chrome.
 */

const LADOS = ["top", "right", "bottom", "left"] as const;
const CANTOS = ["top-left", "top-right", "bottom-right", "bottom-left"] as const;

function porLado(prefixo: string, sufixo = ""): string[] {
  return LADOS.map((lado) => `${prefixo}-${lado}${sufixo}`);
}

/** Propriedades herdadas (o filho recebe do pai quando não tem valor próprio). */
export const HERDADAS: ReadonlySet<string> = new Set([
  "color",
  "font-family",
  "font-size",
  "font-style",
  "font-variant",
  "font-variant-caps",
  "font-variant-ligatures",
  "font-variant-numeric",
  "font-weight",
  "font-stretch",
  "font-kerning",
  "font-size-adjust",
  "font-feature-settings",
  "font-variation-settings",
  "line-height",
  "letter-spacing",
  "word-spacing",
  "text-align",
  "text-align-last",
  "text-indent",
  "text-transform",
  "text-shadow",
  "text-rendering",
  "text-underline-position",
  "white-space",
  "word-break",
  "overflow-wrap",
  "word-wrap",
  "hyphens",
  "tab-size",
  "direction",
  "writing-mode",
  "visibility",
  "cursor",
  "list-style-type",
  "list-style-position",
  "list-style-image",
  "quotes",
  "border-collapse",
  "border-spacing",
  "caption-side",
  "empty-cells",
  "caret-color",
  "accent-color",
  "color-scheme",
  "pointer-events",
  "orphans",
  "widows",
  "fill",
  "stroke",
  "-webkit-text-fill-color",
]);

/**
 * Atalhos e as propriedades longas que cada um define. Um atalho que não
 * está aqui é tratado como propriedade longa dela mesma (e o motor não
 * risca nada por causa dele além dela própria).
 */
export const ATALHOS: Readonly<Record<string, readonly string[]>> = {
  margin: porLado("margin"),
  padding: porLado("padding"),
  inset: [...LADOS],
  "border-width": porLado("border", "-width"),
  "border-style": porLado("border", "-style"),
  "border-color": porLado("border", "-color"),
  border: [...porLado("border", "-width"), ...porLado("border", "-style"), ...porLado("border", "-color")],
  "border-top": ["border-top-width", "border-top-style", "border-top-color"],
  "border-right": ["border-right-width", "border-right-style", "border-right-color"],
  "border-bottom": ["border-bottom-width", "border-bottom-style", "border-bottom-color"],
  "border-left": ["border-left-width", "border-left-style", "border-left-color"],
  "border-radius": CANTOS.map((canto) => `border-${canto}-radius`),
  outline: ["outline-width", "outline-style", "outline-color"],
  background: [
    "background-color",
    "background-image",
    "background-position-x",
    "background-position-y",
    "background-size",
    "background-repeat",
    "background-attachment",
    "background-origin",
    "background-clip",
  ],
  "background-position": ["background-position-x", "background-position-y"],
  font: ["font-style", "font-variant-caps", "font-weight", "font-stretch", "font-size", "line-height", "font-family"],
  gap: ["row-gap", "column-gap"],
  "grid-gap": ["row-gap", "column-gap"],
  flex: ["flex-grow", "flex-shrink", "flex-basis"],
  "flex-flow": ["flex-direction", "flex-wrap"],
  "place-items": ["align-items", "justify-items"],
  "place-content": ["align-content", "justify-content"],
  "place-self": ["align-self", "justify-self"],
  overflow: ["overflow-x", "overflow-y"],
  "text-decoration": ["text-decoration-line", "text-decoration-style", "text-decoration-color", "text-decoration-thickness"],
  "list-style": ["list-style-type", "list-style-position", "list-style-image"],
  "grid-row": ["grid-row-start", "grid-row-end"],
  "grid-column": ["grid-column-start", "grid-column-end"],
  "grid-area": ["grid-row-start", "grid-column-start", "grid-row-end", "grid-column-end"],
  "grid-template": ["grid-template-rows", "grid-template-columns", "grid-template-areas"],
  grid: [
    "grid-template-rows",
    "grid-template-columns",
    "grid-template-areas",
    "grid-auto-rows",
    "grid-auto-columns",
    "grid-auto-flow",
  ],
  columns: ["column-width", "column-count"],
  "column-rule": ["column-rule-width", "column-rule-style", "column-rule-color"],
  transition: ["transition-property", "transition-duration", "transition-timing-function", "transition-delay", "transition-behavior"],
  animation: [
    "animation-name",
    "animation-duration",
    "animation-timing-function",
    "animation-delay",
    "animation-iteration-count",
    "animation-direction",
    "animation-fill-mode",
    "animation-play-state",
  ],
  "border-image": ["border-image-source", "border-image-slice", "border-image-width", "border-image-outset", "border-image-repeat"],
  "text-emphasis": ["text-emphasis-style", "text-emphasis-color"],
  "margin-block": ["margin-block-start", "margin-block-end"],
  "margin-inline": ["margin-inline-start", "margin-inline-end"],
  "padding-block": ["padding-block-start", "padding-block-end"],
  "padding-inline": ["padding-inline-start", "padding-inline-end"],
  "inset-block": ["inset-block-start", "inset-block-end"],
  "inset-inline": ["inset-inline-start", "inset-inline-end"],
  "scroll-margin": porLado("scroll-margin"),
  "scroll-padding": porLado("scroll-padding"),
  "overscroll-behavior": ["overscroll-behavior-x", "overscroll-behavior-y"],
  "font-variant": ["font-variant-caps", "font-variant-ligatures", "font-variant-numeric", "font-variant-east-asian", "font-variant-alternates", "font-variant-position"],
  "word-wrap": ["overflow-wrap"],
};

/**
 * Grupos em que uma propriedade lógica (depende da direção da escrita) e
 * uma física falam do mesmo lugar. Quando um elemento tem as duas
 * espécies no mesmo grupo, o motor não decide quem vence (não sabe a
 * direção com certeza) e não risca nenhuma delas.
 */
const GRUPOS_LOGICOS: readonly { fisicas: readonly string[]; logicas: readonly string[] }[] = [
  { fisicas: porLado("margin"), logicas: ["margin-block-start", "margin-block-end", "margin-inline-start", "margin-inline-end"] },
  { fisicas: porLado("padding"), logicas: ["padding-block-start", "padding-block-end", "padding-inline-start", "padding-inline-end"] },
  { fisicas: [...LADOS], logicas: ["inset-block-start", "inset-block-end", "inset-inline-start", "inset-inline-end"] },
  { fisicas: ["width", "min-width", "max-width"], logicas: ["inline-size", "min-inline-size", "max-inline-size"] },
  { fisicas: ["height", "min-height", "max-height"], logicas: ["block-size", "min-block-size", "max-block-size"] },
  {
    fisicas: [...porLado("border", "-width"), ...porLado("border", "-style"), ...porLado("border", "-color")],
    logicas: ["block-start", "block-end", "inline-start", "inline-end"].flatMap((lado) =>
      ["width", "style", "color"].map((parte) => `border-${lado}-${parte}`),
    ),
  },
  {
    fisicas: CANTOS.map((canto) => `border-${canto}-radius`),
    logicas: ["start-start", "start-end", "end-start", "end-end"].map((canto) => `border-${canto}-radius`),
  },
];

/** Para cada propriedade longa de um grupo lógico: o grupo inteiro. */
export const GRUPO_LOGICO_DE: ReadonlyMap<string, { fisicas: readonly string[]; logicas: readonly string[] }> = new Map(
  GRUPOS_LOGICOS.flatMap((grupo) => [...grupo.fisicas, ...grupo.logicas].map((propriedade) => [propriedade, grupo] as const)),
);

/**
 * Valor inicial das propriedades mais usadas, para quando nada declara
 * a propriedade num elemento. Os que dependem do navegador (a fonte padrão,
 * a cor do texto) ficam de fora: aí o motor diz que não tem certeza.
 */
export const INICIAIS: Readonly<Record<string, string>> = {
  ...Object.fromEntries(porLado("margin").map((propriedade) => [propriedade, "0"])),
  ...Object.fromEntries(porLado("padding").map((propriedade) => [propriedade, "0"])),
  ...Object.fromEntries(porLado("border", "-style").map((propriedade) => [propriedade, "none"])),
  ...Object.fromEntries(porLado("border", "-color").map((propriedade) => [propriedade, "currentcolor"])),
  ...Object.fromEntries(porLado("border", "-width").map((propriedade) => [propriedade, "medium"])),
  ...Object.fromEntries(CANTOS.map((canto) => [`border-${canto}-radius`, "0"])),
  ...Object.fromEntries(LADOS.map((lado) => [lado, "auto"])),
  "background-color": "transparent",
  "background-image": "none",
  "background-position-x": "0%",
  "background-position-y": "0%",
  "background-size": "auto",
  "background-repeat": "repeat",
  "background-attachment": "scroll",
  "background-origin": "padding-box",
  "background-clip": "border-box",
  width: "auto",
  height: "auto",
  "min-width": "auto",
  "min-height": "auto",
  "max-width": "none",
  "max-height": "none",
  display: "inline",
  position: "static",
  "z-index": "auto",
  float: "none",
  clear: "none",
  "box-sizing": "content-box",
  opacity: "1",
  "overflow-x": "visible",
  "overflow-y": "visible",
  visibility: "visible",
  "text-align": "start",
  "text-decoration-line": "none",
  "text-decoration-style": "solid",
  "text-decoration-color": "currentcolor",
  "text-decoration-thickness": "auto",
  "text-transform": "none",
  "text-indent": "0",
  "font-style": "normal",
  "font-weight": "normal",
  "font-variant-caps": "normal",
  "font-stretch": "normal",
  "font-size": "medium",
  "line-height": "normal",
  "letter-spacing": "normal",
  "word-spacing": "normal",
  "white-space": "normal",
  "vertical-align": "baseline",
  "list-style-type": "disc",
  "list-style-position": "outside",
  "list-style-image": "none",
  "outline-style": "none",
  "outline-width": "medium",
  "outline-color": "currentcolor",
  "flex-direction": "row",
  "flex-wrap": "nowrap",
  "flex-grow": "0",
  "flex-shrink": "1",
  "flex-basis": "auto",
  order: "0",
  "justify-content": "normal",
  "align-items": "normal",
  "align-content": "normal",
  "align-self": "auto",
  "justify-items": "legacy",
  "justify-self": "auto",
  "row-gap": "normal",
  "column-gap": "normal",
  "grid-template-columns": "none",
  "grid-template-rows": "none",
  "grid-template-areas": "none",
  "grid-auto-flow": "row",
  "grid-auto-rows": "auto",
  "grid-auto-columns": "auto",
  "grid-row-start": "auto",
  "grid-row-end": "auto",
  "grid-column-start": "auto",
  "grid-column-end": "auto",
  cursor: "auto",
  "pointer-events": "auto",
  "object-fit": "fill",
  "text-overflow": "clip",
  "box-shadow": "none",
  "text-shadow": "none",
  transform: "none",
  "aspect-ratio": "auto",
};

/** As propriedades longas que uma propriedade define (ela mesma, se não é atalho). */
export function longasDe(propriedade: string): readonly string[] {
  return ATALHOS[propriedade] ?? [propriedade];
}

export function ehAtalho(propriedade: string): boolean {
  return Object.hasOwn(ATALHOS, propriedade);
}

/** A propriedade é herdada (um atalho é herdado quando todas as longas são). */
export function ehHerdada(propriedade: string): boolean {
  if (propriedade.startsWith("--")) return true;
  const longas = longasDe(propriedade);
  return longas.every((longa) => HERDADAS.has(longa));
}

/** Propriedades lógicas de um grupo (para saber se a declaração é lógica). */
export function ehLogica(propriedade: string): boolean {
  const grupo = GRUPO_LOGICO_DE.get(propriedade);
  return grupo !== undefined && grupo.logicas.includes(propriedade);
}
