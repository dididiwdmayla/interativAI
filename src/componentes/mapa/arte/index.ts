import type { ComponentType } from "react";
import { ArteFrameworks } from "./ArteFrameworks";
import { ArteLogica } from "./ArteLogica";
import { ArteOficio } from "./ArteOficio";
import { ArteOrigens } from "./ArteOrigens";
import { ArtePaginasVivas } from "./ArtePaginasVivas";
import { ArteRede } from "./ArteRede";
import { ArteSites } from "./ArteSites";

/** A arte de cada ilha (SVG), pelo id do currículo. Ilha nova sem arte usa a de Frameworks. */
export const ARTE_DAS_ILHAS: Record<string, ComponentType> = {
  origens: ArteOrigens,
  sites: ArteSites,
  logica: ArteLogica,
  "paginas-vivas": ArtePaginasVivas,
  "rede-servidor": ArteRede,
  oficio: ArteOficio,
  frameworks: ArteFrameworks,
};
