"use client";

type Vista = "painel" | "tela";

type Props = {
  vista: Vista;
  aoTrocar: (vista: Vista) => void;
};

const OPCOES: readonly { id: Vista; rotulo: string }[] = [
  { id: "painel", rotulo: "Painel" },
  { id: "tela", rotulo: "Tela" },
];

/** Em telas pequenas, alterna entre o painel (F12) e a tela do site. */
export function SeletorVista({ vista, aoTrocar }: Props) {
  return (
    <div role="tablist" aria-label="Mostrar" className="inline-flex rounded-full border-2 border-borda bg-superficie p-1">
      {OPCOES.map((opcao) => (
        <button
          key={opcao.id}
          type="button"
          role="tab"
          aria-selected={vista === opcao.id}
          aria-controls={`vista-${opcao.id}`}
          onClick={() => aoTrocar(opcao.id)}
          className={`rounded-full px-5 py-1 text-sm font-black transition-colors ${
            vista === opcao.id ? "bg-primaria text-sobre-primaria" : "text-texto-suave hover:text-texto"
          }`}
        >
          {opcao.rotulo}
        </button>
      ))}
    </div>
  );
}
