import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Jogo } from "@/componentes/jogo/Jogo";
import { FASES, faseDoId } from "@/conteudo";

/** Só as fases registradas existem; o resto é 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return FASES.map((fase) => ({ id: fase.id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const fase = faseDoId(id);
  return { title: `${fase ? fase.titulo : "Fase"} | InterativAI` };
}

export default async function PaginaFase({ params }: Props) {
  const { id } = await params;
  if (!faseDoId(id)) notFound();
  return <Jogo faseId={id} />;
}
