import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import type { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";

/** Tema do CodeMirror derivado dos tokens: troca junto com o tema do jogo. */
const aparencia = EditorView.theme({
  "&": {
    height: "100%",
    color: "var(--cor-codigo-texto)",
    backgroundColor: "var(--cor-codigo-fundo)",
    fontSize: "13.5px",
  },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": {
    fontFamily: "var(--fonte-codigo), ui-monospace, monospace",
    lineHeight: "1.65",
  },
  ".cm-content": { caretColor: "var(--cor-primaria)", paddingBottom: "24px" },
  ".cm-cursor, .cm-dropCursor": {
    borderLeftColor: "var(--cor-primaria)",
    borderLeftWidth: "2px",
  },
  "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
    { backgroundColor: "var(--cor-selecao)" },
  ".cm-gutters": {
    backgroundColor: "var(--cor-painel)",
    color: "var(--cor-texto-suave)",
    border: "none",
    borderRight: "2px solid var(--cor-borda)",
  },
  ".cm-lineNumbers .cm-gutterElement": { padding: "0 10px 0 12px" },
  ".cm-activeLine": { backgroundColor: "var(--cor-codigo-linha-ativa)" },
  ".cm-activeLineGutter": {
    backgroundColor: "var(--cor-hover)",
    color: "var(--cor-texto)",
  },
  ".cm-matchingBracket, &.cm-focused .cm-matchingBracket": {
    backgroundColor: "var(--cor-hover)",
    outline: "1px solid var(--cor-borda)",
  },
  ".cm-linha-destacada": {
    backgroundColor: "var(--cor-codigo-destaque-linha)",
    animation: "pulsar-linha 1.1s ease-in-out infinite",
    boxShadow: "inset 4px 0 0 var(--cor-destaque)",
  },
  ".cm-tooltip": {
    backgroundColor: "var(--cor-superficie)",
    color: "var(--cor-texto)",
    border: "2px solid var(--cor-borda)",
    borderRadius: "10px",
    overflow: "hidden",
  },
  ".cm-tooltip-autocomplete > ul > li[aria-selected]": {
    backgroundColor: "var(--cor-primaria)",
    color: "var(--cor-texto-sobre-primaria)",
  },
  ".cm-completionDetail": { color: "var(--cor-texto-suave)" },
  ".cm-panels": {
    backgroundColor: "var(--cor-painel)",
    color: "var(--cor-texto)",
  },
});

const cores = HighlightStyle.define([
  { tag: [t.tagName, t.angleBracket], color: "var(--cor-codigo-tag)" },
  { tag: t.attributeName, color: "var(--cor-codigo-atributo)" },
  { tag: t.attributeValue, color: "var(--cor-codigo-valor)" },
  { tag: t.comment, color: "var(--cor-codigo-comentario)", fontStyle: "italic" },
  { tag: [t.content, t.string], color: "var(--cor-codigo-texto)" },
  { tag: t.documentMeta, color: "var(--cor-codigo-comentario)" },
  { tag: t.invalid, color: "var(--cor-erro)", textDecoration: "underline wavy" },
  { tag: [t.keyword, t.propertyName], color: "var(--cor-codigo-tag)" },
  { tag: [t.number, t.bool], color: "var(--cor-codigo-valor)" },
]);

export const temaEditor: Extension = [aparencia, syntaxHighlighting(cores)];
