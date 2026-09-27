import type { ComponentType } from "react";
import { type DadosTema, type IdTema, TEMAS } from "@/curriculo/temas";
import type { PropsIcone } from "@/componentes/icones/tipos";
import { IconeTema } from "./IconeTema";

/** Um tema com o ícone dele, pronto para a interface. */
export type Tema = DadosTema & { Icone: ComponentType<PropsIcone> };

function iconeDo(id: IdTema): ComponentType<PropsIcone> {
  function Icone(props: PropsIcone) {
    return <IconeTema tema={id} {...props} />;
  }
  Icone.displayName = `IconeTema(${id})`;
  return Icone;
}

/** O catálogo de temas (src/curriculo/temas.ts) com os ícones. */
export const TEMAS_COM_ICONE: readonly Tema[] = TEMAS.map((tema) => ({ ...tema, Icone: iconeDo(tema.id) }));

export function temaComIcone(id: IdTema): Tema {
  const tema = TEMAS_COM_ICONE.find((item) => item.id === id);
  if (!tema) throw new Error(`tema desconhecido: ${id}`);
  return tema;
}
