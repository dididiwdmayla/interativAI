/*
 * As abas de cima do DevTools, na ordem do Chrome. Estilos e Calculado não
 * são abas de cima: no Chrome eles são sub-painéis DENTRO de Elements
 * (Styles e Computed), e aqui também (ver PainelElementos em
 * src/conteudo/tipos.ts).
 */
export type Aba = "elementos" | "console" | "fontes" | "rede" | "aplicacao";

export const ABAS: readonly { id: Aba; rotulo: string }[] = [
  { id: "elementos", rotulo: "Elementos" },
  { id: "console", rotulo: "Console" },
  { id: "fontes", rotulo: "Fontes" },
  { id: "rede", rotulo: "Rede" },
  { id: "aplicacao", rotulo: "Aplicação" },
];
