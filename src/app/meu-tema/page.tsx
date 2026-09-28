import type { Metadata } from "next";
import { TelaMeuTema } from "@/componentes/tema/TelaMeuTema";

export const metadata: Metadata = { title: "Meu tema | InterativAI" };

export default function PaginaMeuTema() {
  return <TelaMeuTema />;
}
