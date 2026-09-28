import type { PropsIcone } from "./tipos";

/** Uma paleta de pintor com um disquete no canto: guardar as cores como tema. */
export function IconeSalvarTema({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M9.5 2.8c-4 0-7 2.9-7 6.6 0 3.3 2.6 5.8 5.8 5.8.9 0 1.3-.5 1.3-1.1 0-.9-.9-1.2-.9-2 0-.7.6-1.2 1.3-1.2h1.5c2.1 0 3.3-1.4 3.3-3.1 0-2.8-2.4-5-5.3-5Z" />
      <circle cx="6.3" cy="8.2" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="9.2" cy="5.8" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12.4" cy="6.9" r="0.9" fill="currentColor" stroke="none" />
      <path d="M12.6 12.4h4.9v5.2h-4.9z" />
      <path d="M13.9 12.4v1.8h2.3v-1.8M13.7 16h2.7" />
    </svg>
  );
}
