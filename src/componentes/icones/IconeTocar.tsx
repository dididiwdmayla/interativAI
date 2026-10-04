import type { PropsIcone } from "./tipos";

/** Tocar (triângulo) ou pausar (duas barras): o controle da animação da cena. */
export function IconeTocar({ className, tamanho = 18, pausar = false }: PropsIcone & { pausar?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" width={tamanho} height={tamanho} className={className} aria-hidden="true" fill="currentColor">
      {pausar ? (
        <>
          <rect x="5" y="4" width="3.6" height="12" rx="1.2" />
          <rect x="11.4" y="4" width="3.6" height="12" rx="1.2" />
        </>
      ) : (
        <path d="M6.5 4.2c0-.9 1-1.4 1.7-.9l7.6 5.1c.7.5.7 1.4 0 1.9l-7.6 5.1c-.7.5-1.7 0-1.7-.9z" />
      )}
    </svg>
  );
}
