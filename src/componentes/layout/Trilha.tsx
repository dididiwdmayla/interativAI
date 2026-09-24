import { IconeChevron } from "@/componentes/icones/IconeChevron";

type Props = {
  partes: readonly string[];
};

export function Trilha({ partes }: Props) {
  return (
    <nav aria-label="Onde você está" className="min-w-0">
      <ol className="flex items-center gap-1.5 text-sm font-bold text-texto-suave">
        {partes.map((parte, indice) => {
          const ultima = indice === partes.length - 1;
          return (
            <li key={parte} className="flex min-w-0 items-center gap-1.5">
              {indice > 0 && <IconeChevron className="shrink-0 text-primaria" />}
              <span
                className={`truncate ${ultima ? "text-texto" : ""}`}
                aria-current={ultima ? "page" : undefined}
              >
                {parte}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
