/*
 * O manifesto do que o jogo espera ter em public/audio: id -> arquivos.
 * Uma música por ilha (tabela de telas.ts), mais a do mapa e a do museu, e
 * os efeitos dos momentos grandes. É a lista que o docs/AUDIO.md mostra
 * para quem prepara os arquivos, e o testar:audio confere contra os
 * manifestos em json (musicas.json e efeitos.json), que é o que o jogo lê
 * em tempo de execução. Arquivo que falta não quebra nada: a música fica
 * em silêncio e o efeito toca a versão sintetizada.
 */
import type { IdEfeito } from "./efeitos";
import type { ArquivosAudio } from "./manifestos";
import { FAIXA_DA_ILHA, FAIXA_DO_MUNDO, FAIXA_DO_MUSEU } from "./telas";

export type ArquivoEsperado = {
  id: string;
  /** Onde toca, para quem prepara os arquivos. */
  onde: string;
  arquivos: Required<ArquivosAudio>;
};

function arquivos(pasta: "musica" | "efeitos", id: string): Required<ArquivosAudio> {
  return { webm: `/audio/${pasta}/${id}.webm`, m4a: `/audio/${pasta}/${id}.m4a` };
}

/** As músicas: o mapa, o museu e uma por ilha (sem repetir: o museu é a faixa das Origens). */
export const MUSICAS_ESPERADAS: readonly ArquivoEsperado[] = [
  { id: FAIXA_DO_MUNDO, onde: "Mapa do mundo", arquivos: arquivos("musica", FAIXA_DO_MUNDO) },
  { id: FAIXA_DO_MUSEU, onde: "Museu e ilha das Origens", arquivos: arquivos("musica", FAIXA_DO_MUSEU) },
  ...Object.entries(FAIXA_DA_ILHA)
    .filter(([, faixa]) => faixa !== FAIXA_DO_MUSEU)
    .map(([ilha, faixa]) => ({ id: faixa, onde: `Ilha ${ilha} (e as fases dela)`, arquivos: arquivos("musica", faixa) })),
];

/**
 * Os efeitos dos momentos grandes, pelo nome do prompt da rodada 10 ->
 * id no jogo: conclusao-unidade = unidade-concluida, abrir-mapa =
 * entrar-mapa, esbarrao e insignia.
 */
export const EFEITOS_ESPERADOS: readonly (ArquivoEsperado & { id: IdEfeito })[] = [
  { id: "unidade-concluida", onde: "Ilha comemorando a unidade concluída (conclusao-unidade)", arquivos: arquivos("efeitos", "unidade-concluida") },
  { id: "esbarrao", onde: "O computadorzinho esbarrando no painel", arquivos: arquivos("efeitos", "esbarrao") },
  { id: "insignia", onde: "Insígnia de tema atingindo um marco", arquivos: arquivos("efeitos", "insignia") },
  { id: "entrar-mapa", onde: "Voltar ao mapa do mundo (abrir-mapa)", arquivos: arquivos("efeitos", "entrar-mapa") },
];
