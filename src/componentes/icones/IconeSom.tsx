import type { PropsIcone } from "./tipos";

type Props = PropsIcone & { ligado: boolean };

export function IconeSom({ className, tamanho = 18, ligado }: Props) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={tamanho}
      height={tamanho}
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8v4h3l4 3.5v-11L6 8z" fill="currentColor" fillOpacity={0.2} />
      {ligado ? (
        <>
          <path d="M13 7.5a3.5 3.5 0 0 1 0 5" />
          <path d="M15.2 5.2a6.6 6.6 0 0 1 0 9.6" />
        </>
      ) : (
        <>
          <path d="M13.5 7.5l4 5" />
          <path d="M17.5 7.5l-4 5" />
        </>
      )}
    </svg>
  );
}
