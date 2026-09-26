"use client";

export type AbaEditor = "html" | "css";

type Props = {
  quebrarLinhas: boolean;
  aoAlternarQuebra: () => void;
  /** Fases com CSS: as abas HTML e CSS. Sem elas, só o título do código do body. */
  abas?: { ativa: AbaEditor; aoTrocar: (aba: AbaEditor) => void; nomeCss: string };
  /** Modo documento: o código é a página inteira (e não só o do body). */
  documentoInteiro?: boolean;
};

const ROTULO_ABA: Record<AbaEditor, string> = { html: "HTML", css: "CSS" };

export function CabecalhoEditor({ quebrarLinhas, aoAlternarQuebra, abas, documentoInteiro = false }: Props) {
  const nomeHtml = <span className="text-codigo-tag">{documentoInteiro ? "index.html" : "<body>"}</span>;
  return (
    <div className="flex shrink-0 items-center gap-2 border-b-2 border-borda bg-painel px-3 py-1.5 pointer-fine:pr-9">
      {abas ? (
        <div role="tablist" aria-label="Arquivos do site" className="flex items-center gap-1">
          {(["html", "css"] as const).map((aba) => {
            const ativa = abas.ativa === aba;
            return (
              <button
                key={aba}
                type="button"
                role="tab"
                aria-selected={ativa}
                data-aba-editor={aba}
                onClick={() => abas.aoTrocar(aba)}
                className={`rounded-lg px-2.5 py-0.5 text-xs font-black uppercase tracking-wide transition-colors pointer-coarse:min-h-11 pointer-coarse:px-4 ${
                  ativa ? "bg-primaria text-sobre-primaria" : "text-texto-suave hover:bg-hover"
                }`}
              >
                {ROTULO_ABA[aba]}
              </button>
            );
          })}
          <span className="ml-1 truncate font-codigo text-xs text-texto-suave">
            {abas.ativa === "css" ? abas.nomeCss : nomeHtml}
          </span>
        </div>
      ) : (
        <span className="text-xs font-black uppercase tracking-wide text-texto-suave">
          {documentoInteiro ? "Código da página" : "Código do"}{" "}
          <span className="font-codigo normal-case">{nomeHtml}</span>
        </span>
      )}
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
