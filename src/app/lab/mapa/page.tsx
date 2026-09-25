import type { Metadata } from "next";
import { LabMapa } from "@/componentes/lab/LabMapa";

export const metadata: Metadata = {
  title: "Laboratório do mapa | InterativAI",
  robots: { index: false },
};

export default function PaginaLabMapa() {
  return <LabMapa />;
}
