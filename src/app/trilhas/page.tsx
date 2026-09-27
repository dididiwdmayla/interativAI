import type { Metadata } from "next";
import { TelaTrilhas } from "@/componentes/explorar/TelaTrilhas";

export const metadata: Metadata = { title: "Trilhas | InterativAI" };

export default function PaginaTrilhas() {
  return <TelaTrilhas />;
}
