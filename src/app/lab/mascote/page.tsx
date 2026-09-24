import type { Metadata } from "next";
import { LabMascote } from "@/componentes/lab/LabMascote";

export const metadata: Metadata = {
  title: "Laboratório do mascote | InterativAI",
  robots: { index: false },
};

export default function PaginaLabMascote() {
  return <LabMascote />;
}
