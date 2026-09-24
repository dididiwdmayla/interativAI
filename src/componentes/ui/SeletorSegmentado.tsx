"use client";

type Opcao<T extends string> = { id: T; rotulo: string };

type Props<T extends string> = {
  opcoes: readonly Opcao<T>[];
  valor: T;
  aoTrocar: (valor: T) => void;
  rotulo: string;
  className?: string;
};

/** Botões lado a lado, um escolhido por vez (ex.: "Árvore | Código"). */
export function SeletorSegmentado<T extends string>({ opcoes, valor, aoTrocar, rotulo, className = "" }: Props<T>) {
  return (
    <div
      role="tablist"
      aria-label={rotulo}
      className={`inline-flex rounded-full border-2 border-borda bg-superficie p-0.5 ${className}`}
    >
      {opcoes.map((opcao) => (
        <button
          key={opcao.id}
          type="button"
          role="tab"
          aria-selected={valor === opcao.id}
          onClick={() => aoTrocar(opcao.id)}
          className={`min-h-10 flex-1 rounded-full px-4 text-sm font-black transition-colors ${
            valor === opcao.id ? "bg-primaria text-sobre-primaria" : "text-texto-suave hover:text-texto"
          }`}
        >
          {opcao.rotulo}
        </button>
      ))}
    </div>
  );
}
