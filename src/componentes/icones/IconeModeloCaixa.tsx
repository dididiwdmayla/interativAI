import type { PropsIcone } from "./tipos";

/** Caixas uma dentro da outra: margem, borda, preenchimento e conteúdo. */
export function IconeModeloCaixa({ className, tamanho = 18 }: PropsIcone) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={tamanho}
      height={tamanho}
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="16" height="16" rx="1.5" strokeDasharray="2 1.6" />
      <rect x="4.5" y="4.5" width="11" height="11" rx="1" strokeWidth={2} />
      <rect x="7" y="7" width="6" height="6" rx="0.8" strokeDasharray="1.6 1.2" />
      <rect x="8.8" y="8.8" width="2.4" height="2.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
