import type { Metadata } from "next";
import { LabFases } from "@/componentes/lab/LabFases";

export const metadata: Metadata = {
  title: "Laboratório de fases | InterativAI",
  robots: { index: false },
};

export default function PaginaLabFases() {
  return <LabFases />;
}
