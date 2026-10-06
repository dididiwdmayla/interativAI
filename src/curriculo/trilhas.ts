/*
 * Trilhas: uma camada acima das ilhas. Cada trilha é um caminho completo
 * (o que você consegue fazer no fim) e diz quais ilhas aparecem no mundo e
 * em que ordem. O núcleo comum (Origens, Lógica, IA e Ofício) serve para
 * todas; as outras ilhas são próprias de uma trilha.
 *
 * O progresso é da ilha, não da trilha: concluir a Lógica numa trilha
 * conta nas outras (o progresso guarda fases concluídas, e as fases são as
 * mesmas). A trilha escolhida fica salva no progresso (`trilha`); o padrão
 * é a Web.
 */
import { CURRICULO, ILHAS_FUTURAS } from "./curriculo";
import type { IlhaCurriculo } from "./tipos";

export type IdIlha = string;

export type Trilha = {
  /** "web", "jogos", "automacao". */
  id: string;
  /** "Web", "Jogos", "Automação industrial". */
  nome: string;
  /** Uma ou duas frases para leigo: o que você vai conseguir fazer no fim. */
  descricao: string;
  /** Ordem no mapa, misturando núcleo e ilhas próprias. */
  ilhas: IdIlha[];
  status: "ativa" | "em-construcao";
};

/** Ilhas que servem para todas as trilhas. */
export const NUCLEO_COMUM: readonly IdIlha[] = ["origens", "logica", "ia", "oficio"];

export const TRILHAS: readonly Trilha[] = [
  {
    id: "web",
    nome: "Web",
    descricao: "Criar sites e aplicativos que rodam no navegador, da página ao servidor, e publicar pro mundo usar.",
    ilhas: ["origens", "sites", "logica", "paginas-vivas", "rede-servidor", "python", "ia", "oficio", "frameworks"],
    status: "ativa",
  },
  {
    id: "jogos",
    nome: "Jogos",
    descricao: "Programar jogos 2D do zero: personagem que anda, colisão, fases e pontuação, pra outras pessoas jogarem.",
    ilhas: ["origens", "logica", "jogos-primeiro-jogo", "jogos-graficos", "jogos-fisica", "ia", "oficio"],
    status: "em-construcao",
  },
  {
    id: "automacao",
    nome: "Automação industrial",
    descricao: "Entender e montar os comandos que movem máquinas de fábrica: circuitos, motores, sensores e CLPs programados em Ladder.",
    ilhas: ["origens", "eletronica", "comandos-eletricos", "mecanica", "logica", "clp-e-ladder", "ia", "oficio"],
    status: "em-construcao",
  },
];

/** A trilha de quem ainda não escolheu. */
export const TRILHA_PADRAO = "web";

/** Todas as ilhas que alguma trilha pode mostrar: o currículo e as ilhas futuras. */
export const TODAS_AS_ILHAS: readonly IlhaCurriculo[] = [...CURRICULO, ...ILHAS_FUTURAS];

/** A trilha do id; id desconhecido (ou velho) cai na padrão. */
export function trilhaDoId(id: string | null | undefined, trilhas: readonly Trilha[] = TRILHAS): Trilha {
  return trilhas.find((trilha) => trilha.id === id) ?? trilhas.find((trilha) => trilha.id === TRILHA_PADRAO) ?? trilhas[0];
}

/** As ilhas da trilha, na ordem do mapa (ids que não existem ficam de fora; a checagem acusa). */
export function ilhasDaTrilha(trilha: Trilha, ilhas: readonly IlhaCurriculo[] = TODAS_AS_ILHAS): IlhaCurriculo[] {
  return trilha.ilhas
    .map((id) => ilhas.find((ilha) => ilha.id === id))
    .filter((ilha): ilha is IlhaCurriculo => ilha !== undefined);
}

/** As trilhas que passam por uma ilha. */
export function trilhasDaIlha(ilhaId: string, trilhas: readonly Trilha[] = TRILHAS): Trilha[] {
  return trilhas.filter((trilha) => trilha.ilhas.includes(ilhaId));
}
