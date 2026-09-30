"use client";

/**
 * Barra de símbolos do celular, em cima do teclado: os sinais do JavaScript
 * que o teclado virtual esconde em outras telas. Tocar não tira o foco do
 * editor (o teclado continua aberto).
 */
const SIMBOLOS = ["(", ")", "{", "}", "[", "]", ";", "=", '"', "'", "<", ">", "+", "-", ".", ","] as const;

type Props = { aoInserir: (simbolo: string) => void };

export function BarraSimbolos({ aoInserir }: Props) {
  return (
    <div className="flex shrink-0 gap-1 overflow-x-auto border-t-2 border-borda bg-painel px-1.5 py-1" role="toolbar" aria-label="Símbolos do JavaScript" data-barra-simbolos>
      {SIMBOLOS.map((simbolo) => (
        <button
          key={simbolo}
          type="button"
          onPointerDown={(evento) => evento.preventDefault()}
          onClick={() => aoInserir(simbolo)}
          aria-label={`Escrever ${simbolo}`}
          className="flex h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border-2 border-borda bg-superficie font-mono text-base font-bold text-texto active:bg-hover"
        >
          {simbolo}
        </button>
      ))}
    </div>
  );
}
