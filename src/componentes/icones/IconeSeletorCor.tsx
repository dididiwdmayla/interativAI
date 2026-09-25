import type { PropsIcone } from "./tipos";

/** Quadradinho de cor com um conta-gotas. */
export function IconeSeletorCor({ className, tamanho = 18 }: PropsIcone) {
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
      <rect x="2.5" y="8" width="8" height="8" rx="1.5" fill="currentColor" fillOpacity={0.25} />
      <path d="M15.5 3l1.5 1.5-1.2 1.2.7.7-1 1-.7-.7-4 4-2 .5.5-2 4-4-.7-.7 1-1 .7.7z" />
    </svg>
  );
}
