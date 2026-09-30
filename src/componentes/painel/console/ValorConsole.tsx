"use client";

import { useState } from "react";
import { IconeChevron } from "@/componentes/icones/IconeChevron";
import { literalJs, textoDaFuncao, textoPrevia } from "@/motor/executor/formatar";
import type { ValorExibido } from "@/motor/executor/tipos";

/**
 * Onde o valor aparece, como no Chrome:
 * - "resposta": a resposta do Console (texto entre aspas simples);
 * - "log": argumento de console.log depois de um texto (texto sem aspas);
 * - "argumento": argumento de console.log sem texto antes (texto entre aspas);
 * - "propriedade": dentro de uma lista ou objeto aberto (texto com aspas duplas).
 */
export type ContextoValor = "resposta" | "log" | "argumento" | "propriedade";

type Props = { valor: ValorExibido; contexto: ContextoValor };

/** A cor do tipo do valor (os mesmos tokens do palco da memória). */
export function classeDoTipo(valor: ValorExibido): string {
  switch (valor.t) {
    case "string":
    case "symbol":
      return "text-js-texto";
    case "number":
    case "bigint":
      return "text-js-numero";
    case "boolean":
      return "text-js-booleano";
    case "undefined":
    case "null":
      return "text-js-nulo";
    case "funcao":
      return "text-js-funcao italic";
    case "erro":
      return "text-erro";
    default:
      return "text-codigo-texto";
  }
}

function textoPrimitivo(valor: ValorExibido, contexto: ContextoValor): string {
  if (valor.t === "string") {
    if (contexto === "log") return valor.v;
    if (contexto === "propriedade") return JSON.stringify(valor.v);
    return literalJs(valor.v);
  }
  if (valor.t === "funcao") return contexto === "propriedade" ? `ƒ ${valor.nome === "(anônima)" ? "" : valor.nome}()` : textoDaFuncao(valor);
  return textoPrevia(valor, false);
}

function filhosDe(valor: ValorExibido): { chave: string; valor: ValorExibido; suave?: boolean }[] {
  switch (valor.t) {
    case "array":
      return [
        ...valor.itens.map((item, i) => ({ chave: String(i), valor: item })),
        { chave: "length", valor: { t: "number", v: String(valor.tamanho) } as ValorExibido, suave: true },
      ];
    case "objeto":
      return valor.entradas.map(([chave, v]) => ({ chave, valor: v }));
    case "map":
      return valor.entradas.map(([k, v], i) => ({ chave: `${i}`, valor: { t: "fundo", resumo: `${textoPrevia(k, true)} => ${textoPrevia(v, true)}` } as ValorExibido }));
    case "set":
      return valor.itens.map((item, i) => ({ chave: String(i), valor: item }));
    default:
      return [];
  }
}

/** Um valor no Console: primitivo colorido pelo tipo; lista, objeto, Map e Set abrem com o triângulo. */
export function ValorConsole({ valor, contexto }: Props) {
  const [aberto, setAberto] = useState(false);
  const abrivel = valor.t === "array" || valor.t === "objeto" || valor.t === "map" || valor.t === "set";
  if (!abrivel) {
    return (
      <span className={`whitespace-pre-wrap break-words ${classeDoTipo(valor)}`} data-tipo-valor={valor.t}>
        {textoPrimitivo(valor, contexto)}
      </span>
    );
  }
  const filhos = aberto ? filhosDe(valor) : [];
  const cortado = (valor.t === "array" || valor.t === "objeto") && valor.cortado;
  return (
    <span className="inline-flex max-w-full flex-col align-top" data-tipo-valor={valor.t}>
      <button
        type="button"
        onClick={() => setAberto((a) => !a)}
        aria-expanded={aberto}
        className="inline-flex max-w-full items-start gap-1 rounded text-left hover:bg-hover pointer-coarse:min-h-11 pointer-coarse:items-center"
        data-abrir-valor
      >
        <IconeChevron direcao={aberto ? "baixo" : "direita"} tamanho={10} className="mt-1 shrink-0 text-texto-suave pointer-coarse:mt-0" />
        <span className="break-all text-codigo-texto">{textoPrevia(valor, false)}</span>
      </button>
      {aberto && (
        <span className="flex flex-col border-l-2 border-borda pl-3" role="group">
          {filhos.map((filho) => (
            <span key={filho.chave} className="flex flex-wrap items-start gap-x-1">
              <span className={filho.suave ? "text-texto-suave" : "text-js-booleano"}>{filho.chave}:</span>
              <ValorConsole valor={filho.valor} contexto="propriedade" />
            </span>
          ))}
          {cortado && <span className="text-texto-suave">…</span>}
        </span>
      )}
    </span>
  );
}
