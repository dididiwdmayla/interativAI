type Props = {
  /** De 0 a 1. */
  fracao: number;
  /** O que a barra mede, para leitor de tela (ex.: "3 de 14 unidades"). */
  rotulo: string;
  className?: string;
};

/** Barrinha de progresso arredondada. */
export function BarraProgresso({ fracao, rotulo, className = "" }: Props) {
  const valor = Math.round(Math.min(1, Math.max(0, fracao)) * 100);
  return (
    <div
      role="progressbar"
      aria-label={rotulo}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={valor}
      className={`h-2.5 w-full overflow-hidden rounded-full bg-painel ${className}`}
    >
      <div className="h-full rounded-full bg-primaria transition-[width] duration-500" style={{ width: `${valor}%` }} />
    </div>
  );
}
