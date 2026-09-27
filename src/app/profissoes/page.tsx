import type { Metadata } from "next";
import { TelaProfissoes } from "@/componentes/explorar/TelaProfissoes";

export const metadata: Metadata = { title: "Profissões | InterativAI" };

export default function PaginaProfissoes() {
  return <TelaProfissoes />;
}
