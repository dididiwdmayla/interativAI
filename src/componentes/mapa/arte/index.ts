import type { ComponentType } from "react";
import { ArteFrameworks } from "./ArteFrameworks";
import { ArteFutura } from "./ArteFutura";
import { ArteIA } from "./ArteIA";
import { ArteLogica } from "./ArteLogica";
import { ArteOficio } from "./ArteOficio";
import { ArteOrigens } from "./ArteOrigens";
import { ArtePaginasVivas } from "./ArtePaginasVivas";
import { ArteRede } from "./ArteRede";
import { ArteSites } from "./ArteSites";

export { ArteFutura };

/** A arte de cada ilha (SVG), pelo id do currículo. Ilha sem arte própria usa a ArteFutura. */
export const ARTE_DAS_ILHAS: Record<string, ComponentType> = {
  origens: ArteOrigens,
  sites: ArteSites,
  logica: ArteLogica,
  "paginas-vivas": ArtePaginasVivas,
  "rede-servidor": ArteRede,
  ia: ArteIA,
  oficio: ArteOficio,
  frameworks: ArteFrameworks,
};
