export type Aba = "elementos" | "estilos" | "console" | "rede" | "aplicacao";

export const ABAS: readonly { id: Aba; rotulo: string }[] = [
  { id: "elementos", rotulo: "Elementos" },
  { id: "estilos", rotulo: "Estilos" },
  { id: "console", rotulo: "Console" },
  { id: "rede", rotulo: "Rede" },
  { id: "aplicacao", rotulo: "Aplicação" },
];
