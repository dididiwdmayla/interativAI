import type { PropsIcone } from "./tipos";

/** Um manualzinho aberto com uma lâmpada na página: a ficha de um dispositivo. */
export function IconeFichaDispositivo({ className, tamanho = 18 }: PropsIcone) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={tamanho}
      height={tamanho}
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 5.5C8.2 4 5.6 3.6 2.5 4v11.5c3.1-.4 5.7 0 7.5 1.5 1.8-1.5 4.4-1.9 7.5-1.5V4c-3.1-.4-5.7 0-7.5 1.5z" />
      <path d="M10 5.5V17" />
      <path d="M13.8 7.4a1.6 1.6 0 1 0-2 0c.3.3.4.6.4.9h1.2c0-.3.1-.6.4-.9z" />
      <path d="M12.3 10.2h1M4.8 8h2.6M4.8 10.5h2.6" />
    </svg>
  );
}
