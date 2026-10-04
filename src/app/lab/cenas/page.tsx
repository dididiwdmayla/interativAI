import type { Metadata } from "next";
import { LabCenas } from "@/componentes/lab/LabCenas";

export const metadata: Metadata = {
  title: "Kit de cenas | InterativAI",
  robots: { index: false },
};

export default function PaginaLabCenas() {
  return <LabCenas />;
}
