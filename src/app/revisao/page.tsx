import type { Metadata } from "next";
import { TelaRevisao } from "@/componentes/revisao/TelaRevisao";

export const metadata: Metadata = { title: "Revisão do dia | InterativAI" };

export default function PaginaRevisao() {
  return <TelaRevisao />;
}
