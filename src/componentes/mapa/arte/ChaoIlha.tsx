/** O chão de uma ilha no mundo: sombra na água, areia e grama. Centro em (0, 0). */
export function ChaoIlha() {
  return (
    <g>
      <ellipse cx="0" cy="52" rx="118" ry="24" fill="var(--cor-mar-fundo)" opacity="0.7" />
      <path
        d="M-108 30C-106 2-52-12 0-10C54-12 108 0 108 28C107 56 54 64 0 64C-56 64-110 58-108 30Z"
        fill="var(--cor-areia)"
        stroke="var(--cor-areia-sombra)"
        strokeWidth="3"
      />
      <path d="M-92 22C-88 0-44-6 0-5C46-6 92 2 92 22C90 40 46 46 0 46C-46 46-94 42-92 22Z" fill="var(--cor-grama)" />
      <path d="M-92 22C-90 34-50 40 0 40C50 40 90 34 92 22C90 40 46 46 0 46C-46 46-94 42-92 22Z" fill="var(--cor-grama-sombra)" />
    </g>
  );
}
