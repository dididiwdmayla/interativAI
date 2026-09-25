import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MuseuOrigens } from "@/componentes/mapa/MuseuOrigens";
import { TelaIlha } from "@/componentes/mapa/ilha/TelaIlha";
import { CURRICULO, ilhaDoId } from "@/curriculo";

/** Só as ilhas do currículo existem; o resto é 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return CURRICULO.map((ilha) => ({ id: ilha.id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const ilha = ilhaDoId(id);
  return { title: `${ilha ? `Ilha ${ilha.nome}` : "Ilha"} | InterativAI` };
}

export default async function PaginaIlha({ params }: Props) {
  const { id } = await params;
  const ilha = ilhaDoId(id);
  if (!ilha) notFound();
  return ilha.sempreAberta ? <MuseuOrigens ilhaId={ilha.id} /> : <TelaIlha ilhaId={ilha.id} />;
}
