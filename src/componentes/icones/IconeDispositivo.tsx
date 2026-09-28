import type { PropsIcone } from "./tipos";

/** Um celular na frente de um tablet: o botão da barra de dispositivo (Toggle device toolbar do Chrome). */
export function IconeDispositivo({ className, tamanho = 18 }: PropsIcone) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={tamanho}
      height={tamanho}
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="6" y="2.5" width="11.5" height="14" rx="1.8" />
      <rect x="2.5" y="7" width="6.5" height="10.5" rx="1.4" fill="var(--cor-superficie)" />
      <path d="M5 15.3h1.5" />
    </svg>
  );
}
