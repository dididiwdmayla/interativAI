import type { ComponentType } from "react";
import { ArteFrameworks } from "./ArteFrameworks";
import {
  ArteClpLadder,
  ArteComandosEletricos,
  ArteEletronica,
  ArteFutura,
  ArteJogosFisica,
  ArteJogosGraficos,
  ArteJogosPrimeiroJogo,
  ArteMecanica,
} from "./ArteFutura";
import { ArteIA } from "./ArteIA";
import { ArteLogica } from "./ArteLogica";
import { ArteOficio } from "./ArteOficio";
import { ArteOrigens } from "./ArteOrigens";
import { ArtePaginasVivas } from "./ArtePaginasVivas";
import { ArtePython } from "./ArtePython";
import { ArteRede } from "./ArteRede";
import { ArteSites } from "./ArteSites";

export { ArteFutura };

/**
 * A arte de cada ilha (SVG), pelo id: as do currículo e as das trilhas em
 * construção (Jogos e Automação industrial: o chão da obra com a placa do
 * que vai ser ensinado). Ilha sem arte própria usa a ArteFutura com a
 * placa vazia; o testar:conteudo cobra arte de toda ilha.
 */
export const ARTE_DAS_ILHAS: Record<string, ComponentType> = {
  origens: ArteOrigens,
  sites: ArteSites,
  logica: ArteLogica,
  "paginas-vivas": ArtePaginasVivas,
  "rede-servidor": ArteRede,
  python: ArtePython,
  ia: ArteIA,
  oficio: ArteOficio,
  frameworks: ArteFrameworks,
  "jogos-primeiro-jogo": ArteJogosPrimeiroJogo,
  "jogos-graficos": ArteJogosGraficos,
  "jogos-fisica": ArteJogosFisica,
  eletronica: ArteEletronica,
  "comandos-eletricos": ArteComandosEletricos,
  mecanica: ArteMecanica,
  "clp-e-ladder": ArteClpLadder,
};
