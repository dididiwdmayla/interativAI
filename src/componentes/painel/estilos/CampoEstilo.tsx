"use client";

import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { IconeChevron } from "@/componentes/icones/IconeChevron";
import { incrementarNumero, type Passo, passoDaTecla } from "./numeros";

/** Como a edição terminou (decide para onde o cursor vai). */
export type Saida = "enter" | "tab" | "voltar" | "fora";

type Props = {
  valorInicial: string;
  /** Nome da propriedade ou valor: muda o que ":" e ";" fazem e se há setas. */
  campo: "nome" | "valor";
  rotulo: string;
  /** Tela de toque: botões de seta ao lado de valores com número. */
  toque: boolean;
  /** A cada tecla (a prévia mostra o valor enquanto digita). */
  aoMudar?: (texto: string) => void;
  aoConfirmar: (texto: string, saida: Saida) => void;
  aoCancelar: () => void;
  /** O jogador usou as setas (teclado ou botões). */
  aoUsarSetas?: () => void;
};

/** Tem número para as setas mexerem? */
function temNumero(texto: string): boolean {
  return incrementarNumero(texto, 0, { base: 1, direcao: 1 }) !== null;
}

/** ";" fora de aspas e parênteses termina o valor (como no Chrome). */
function pontoEVirgulaFora(texto: string, posicao: number): boolean {
  const antes = texto.slice(0, posicao);
  const aspas = (antes.match(/"/g)?.length ?? 0) % 2 === 0 && (antes.match(/'/g)?.length ?? 0) % 2 === 0;
  const abertos = (antes.match(/\(/g)?.length ?? 0) - (antes.match(/\)/g)?.length ?? 0);
  return aspas && abertos <= 0;
}

/**
 * Campo de edição do painel Estilos, como o do Chrome
 * (devtools-frontend, StylePropertyTreeElement): Enter confirma, Esc
 * desiste, Tab vai para o próximo campo (Shift+Tab volta); no nome, Enter,
 * Espaço e ":" pulam para o valor; no valor, ";" confirma e pula para a
 * próxima e as setas mexem no número do cursor (ver numeros.ts). Uma
 * diferença de propósito: no Chrome, Enter no valor também pula para a
 * próxima propriedade; aqui ele confirma e fecha.
 */
export function CampoEstilo({ valorInicial, campo, rotulo, toque, aoMudar, aoConfirmar, aoCancelar, aoUsarSetas }: Props) {
  const [texto, setTexto] = useState(valorInicial);
  const entrada = useRef<HTMLInputElement>(null);
  const cursorDepois = useRef<number | null>(null);
  const terminou = useRef(false);

  useEffect(() => {
    const elemento = entrada.current;
    if (!elemento) return;
    elemento.focus({ preventScroll: true });
    elemento.select();
  }, []);

  useEffect(() => {
    if (cursorDepois.current === null) return;
    entrada.current?.setSelectionRange(cursorDepois.current, cursorDepois.current);
    cursorDepois.current = null;
  }, [texto]);

  const terminar = (saida: Saida | "cancelar", valor = texto) => {
    if (terminou.current) return;
    terminou.current = true;
    if (saida === "cancelar") aoCancelar();
    else aoConfirmar(valor, saida);
  };

  const mudar = (novo: string) => {
    setTexto(novo);
    aoMudar?.(novo);
  };

  const aplicarPasso = (passo: Passo) => {
    const cursor = entrada.current?.selectionStart ?? texto.length;
    const resultado = incrementarNumero(texto, cursor, passo);
    if (!resultado) return;
    cursorDepois.current = resultado.cursor;
    mudar(resultado.valor);
    aoUsarSetas?.();
  };

  const aoTeclar = (evento: KeyboardEvent<HTMLInputElement>) => {
    evento.stopPropagation();
    if (evento.key === "Enter") {
      evento.preventDefault();
      terminar("enter");
    } else if (evento.key === "Escape") {
      evento.preventDefault();
      terminar("cancelar");
    } else if (evento.key === "Tab") {
      evento.preventDefault();
      terminar(evento.shiftKey ? "voltar" : "tab");
    } else if (campo === "nome" && (evento.key === ":" || evento.key === " ")) {
      evento.preventDefault();
      terminar("tab");
    } else if (campo === "valor" && evento.key === ";" && pontoEVirgulaFora(texto, entrada.current?.selectionStart ?? texto.length)) {
      evento.preventDefault();
      terminar("tab");
    } else if (campo === "valor") {
      const passo = passoDaTecla(evento);
      if (passo) {
        evento.preventDefault();
        aplicarPasso(passo);
      }
    }
  };

  const setas = campo === "valor" && toque && temNumero(texto);

  return (
    <span className="inline-flex items-center gap-1 align-middle">
      <input
        ref={entrada}
        type="text"
        value={texto}
        aria-label={rotulo}
        data-campo-estilo={campo}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        onChange={(evento) => mudar(evento.target.value)}
        onKeyDown={aoTeclar}
        onBlur={() => terminar("fora")}
        size={Math.max(2, texto.length + 1)}
        className="min-w-[2ch] rounded border border-primaria bg-superficie px-0.5 font-codigo text-[12px] text-texto outline-none pointer-coarse:min-h-11 pointer-coarse:text-[14px]"
      />
      {setas && (
        <span className="inline-flex gap-0.5" data-setas-numericas>
          {([1, -1] as const).map((direcao) => (
            <button
              key={direcao}
              type="button"
              aria-label={direcao === 1 ? "Aumentar o número" : "Diminuir o número"}
              // Não tira o foco do campo (senão ele confirmaria e fecharia).
              onPointerDown={(evento) => evento.preventDefault()}
              onClick={() => aplicarPasso({ base: 1, direcao })}
              className="grid h-11 w-11 place-items-center rounded-lg border-2 border-borda bg-painel text-texto active:bg-hover"
            >
              <IconeChevron direcao={direcao === 1 ? "cima" : "baixo"} tamanho={14} />
            </button>
          ))}
        </span>
      )}
    </span>
  );
}
