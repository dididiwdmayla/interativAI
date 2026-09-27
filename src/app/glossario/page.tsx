import type { Metadata } from "next";
import { TelaGlossario } from "@/componentes/explorar/TelaGlossario";

export const metadata: Metadata = { title: "Glossário | InterativAI" };

export default function PaginaGlossario() {
  return <TelaGlossario />;
}
