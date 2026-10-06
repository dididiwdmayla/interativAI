import type { Metadata } from "next";
import { LabAntepassados } from "@/componentes/lab/LabAntepassados";

export const metadata: Metadata = {
  title: "Antepassados | InterativAI",
  robots: { index: false },
};

export default function PaginaLabAntepassados() {
  return <LabAntepassados />;
}
