import { ArvoreResultado } from "./ArvoreResultado";
import type { ItemLab } from "./tipos";

type Props = { itens: readonly ItemLab[] };

const ROTULO_SITUACAO: Record<ItemLab["situacao"], string> = {
  feito: "feito",
  atual: "agora",
  futuro: "depois",
};

/** Estado ao vivo de cada validador da fase. */
export function ListaValidadores({ itens }: Props) {
  return (
    <ol className="space-y-2">
      {itens.map((item) => (
        <li
          key={item.id}
          className={`rounded-xl border-2 p-2 ${item.situacao === "atual" ? "border-primaria bg-superficie" : "border-borda"}`}
        >
          <p className="mb-1 flex flex-wrap items-center gap-1.5 text-xs font-black">
            <span className="text-texto">{item.rotulo}</span>
            <span className="rounded-full bg-painel px-1.5 text-texto-suave">{item.etiqueta}</span>
            <span className="ml-auto text-texto-suave">{ROTULO_SITUACAO[item.situacao]}</span>
          </p>
          {item.resultado ? (
            <ArvoreResultado resultado={item.resultado} />
          ) : (
            <p className="text-xs text-texto-suave">A página ainda não carregou.</p>
          )}
        </li>
      ))}
    </ol>
  );
}
