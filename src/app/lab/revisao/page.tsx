import type { Metadata } from "next";
import { LabRevisao } from "@/componentes/lab/LabRevisao";

export const metadata: Metadata = {
  title: "Laboratório da revisão | InterativAI",
  robots: { index: false },
};

export default function PaginaLabRevisao() {
  return <LabRevisao />;
}
