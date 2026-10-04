import type { Metadata } from "next";
import { LabClientes } from "@/componentes/lab/LabClientes";

export const metadata: Metadata = {
  title: "Kit de clientes | InterativAI",
  robots: { index: false },
};

export default function PaginaLabClientes() {
  return <LabClientes />;
}
