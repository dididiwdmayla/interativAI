import type { PropsIcone } from "./tipos";

type Props = PropsIcone & { cheia: boolean };

const CAMINHO_ESTRELA =
  "M12 2.8l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.6l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z";

export function IconeEstrela({ className, tamanho = 22, cheia }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={tamanho}
      height={tamanho}
      className={className}
      aria-hidden="true"
    >
      <path
        d={CAMINHO_ESTRELA}
        fill={cheia ? "var(--cor-destaque)" : "transparent"}
        stroke={cheia ? "var(--cor-mascote-moldura-sombra)" : "var(--cor-texto-suave)"}
        strokeWidth={1.6}
        strokeLinejoin="round"
        strokeDasharray={cheia ? undefined : "2.5 2"}
      />
      {cheia && (
        <g fill="var(--cor-texto-sobre-destaque)">
          <circle cx="10.3" cy="11.2" r="0.95" />
          <circle cx="13.7" cy="11.2" r="0.95" />
          <path
            d="M10.4 13.3q1.6 1.4 3.2 0"
            fill="none"
            stroke="var(--cor-texto-sobre-destaque)"
            strokeWidth={0.9}
            strokeLinecap="round"
          />
        </g>
      )}
    </svg>
  );
}
