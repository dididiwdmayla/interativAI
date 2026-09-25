import type { Metadata } from "next";
import { MundoMapa } from "@/componentes/mapa/MundoMapa";

export const metadata: Metadata = {
  title: "Mapa das ilhas | InterativAI",
};

export default function PaginaMapa() {
  return <MundoMapa />;
}
