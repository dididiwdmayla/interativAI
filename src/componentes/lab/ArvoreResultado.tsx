import type { ResultadoValidador } from "@/motor/validadores";

type Props = { resultado: ResultadoValidador; profundidade?: number };

/** Um validador e os de dentro, com passou ou não em cada um. */
export function ArvoreResultado({ resultado, profundidade = 0 }: Props) {
  return (
    <div style={{ paddingLeft: profundidade * 12 }}>
      <p className="flex items-start gap-1.5 text-xs leading-5">
        <span
          className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${resultado.passou ? "bg-sucesso" : "bg-erro"}`}
          aria-label={resultado.passou ? "passou" : "não passou"}
        />
        <span className="min-w-0 font-codigo">
          {resultado.descricao}
          {resultado.detalhe && <span className="text-texto-suave"> ({resultado.detalhe})</span>}
        </span>
      </p>
      {(resultado.filhos ?? []).map((filho, indice) => (
        <ArvoreResultado key={indice} resultado={filho} profundidade={profundidade + 1} />
      ))}
    </div>
  );
}
