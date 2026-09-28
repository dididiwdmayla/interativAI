import type { Metadata } from "next";
import { TelaProjetos } from "@/componentes/projeto/TelaProjetos";

export const metadata: Metadata = { title: "Meus projetos | InterativAI" };

export default function PaginaProjetos() {
  return <TelaProjetos />;
}
