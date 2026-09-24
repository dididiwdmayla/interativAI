"use client";

type Props = {
  quebrarLinhas: boolean;
  aoAlternarQuebra: () => void;
};

export function CabecalhoEditor({ quebrarLinhas, aoAlternarQuebra }: Props) {
  return (
    <div className="flex shrink-0 items-center gap-2 border-b-2 border-borda bg-painel px-3 py-1.5">
      <span className="text-xs font-black uppercase tracking-wide text-texto-suave">
        Código do <span className="font-codigo normal-case text-codigo-tag">&lt;body&gt;</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={quebrarLinhas}
        onClick={aoAlternarQuebra}
        className="ml-auto flex items-center gap-2 rounded-full px-2 py-0.5 text-xs font-bold text-texto-suave hover:bg-hover"
      >
        <span
          className={`relative h-4 w-7 rounded-full transition-colors ${quebrarLinhas ? "bg-primaria" : "bg-borda"}`}
          aria-hidden="true"
        >
          <span
            className={`absolute top-0.5 h-3 w-3 rounded-full bg-superficie transition-all ${quebrarLinhas ? "left-3.5" : "left-0.5"}`}
          />
        </span>
        Quebrar linhas
      </button>
    </div>
  );
}
