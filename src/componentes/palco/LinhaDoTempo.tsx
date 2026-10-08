"use client";

/*
 * A linha do tempo (o "rebobinar"): uma barra com um ponto por passo do
 * rastro da última execução. Voltar e avançar mostra a memória daquele
 * momento no palco e acende a linha do código.
 */
import { IconeChevron } from "@/componentes/icones/IconeChevron";
import type { PassoRastro } from "@/motor/executor/tipos";

type Props = {
  passos: readonly PassoRastro[];
  indice: number;
  aoMudar: (indice: number) => void;
  /** O código que rodou (para mostrar a linha do passo). */
  codigo: string;
  cortado: boolean;
  totalPassos: number;
  /** (Cena) O programa parou porque o tempo da cena acabou. */
  fimDaSimulacao?: boolean;
};

function descreverPasso(passo: PassoRastro | undefined, codigo: string, fimDaSimulacao: boolean): string {
  if (!passo) return "Rode algo para ver os passos.";
  if (passo.tipo === "fim") return fimDaSimulacao ? "Fim da simulação (o tempo da cena acabou)" : "Fim do programa";
  if (passo.tipo === "erro") return `Parou com erro${passo.linha !== null ? ` na linha ${passo.linha}` : ""}`;
  const texto = passo.linha !== null ? (codigo.split("\n")[passo.linha - 1] ?? "").trim() : "";
  const retorno = passo.tipo === "retorno" && passo.retorno ? `${passo.retorno.funcao} devolve · ` : "";
  return `${retorno}linha ${passo.linha}: ${texto.length > 60 ? `${texto.slice(0, 60)}…` : texto}`;
}

export function LinhaDoTempo({ passos, indice, aoMudar, codigo, cortado, totalPassos, fimDaSimulacao = false }: Props) {
  const total = passos.length;
  const botao =
    "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-borda bg-superficie text-texto hover:border-primaria hover:text-primaria disabled:opacity-40 pointer-coarse:h-11 pointer-coarse:w-11";
  return (
    <div className="flex shrink-0 flex-col gap-1 border-t-2 border-borda bg-painel px-2 py-1.5" data-linha-do-tempo data-passo-atual={indice} data-total-passos={total}>
      <div className="flex items-center gap-2">
        <button type="button" className={botao} onClick={() => aoMudar(indice - 1)} disabled={indice <= 0} aria-label="Passo anterior" data-passo-anterior>
          <IconeChevron direcao="esquerda" />
        </button>
        <input
          type="range"
          min={0}
          max={Math.max(0, total - 1)}
          value={Math.min(indice, Math.max(0, total - 1))}
          onChange={(evento) => aoMudar(Number(evento.target.value))}
          onKeyDown={(evento) => {
            // Home/End também escolhem (e pausam a cena) quando o range já
            // está no extremo. Nesse caso o navegador não dispara change.
            if (evento.key === "Home" || evento.key === "End") {
              evento.preventDefault();
              aoMudar(evento.key === "Home" ? 0 : Math.max(0, total - 1));
            }
          }}
          disabled={total <= 1}
          aria-label="Linha do tempo da execução"
          className="h-8 min-w-0 flex-1 accent-primaria pointer-coarse:h-11"
          data-barra-tempo
        />
        <button type="button" className={botao} onClick={() => aoMudar(indice + 1)} disabled={indice >= total - 1} aria-label="Próximo passo" data-passo-proximo>
          <IconeChevron direcao="direita" />
        </button>
      </div>
      <p className="truncate font-mono text-xs text-texto" data-descricao-passo>
        <span className="font-sans font-bold text-texto-suave">{total ? `Passo ${indice + 1} de ${total}` : "Sem passos"} · </span>
        {descreverPasso(passos[indice], codigo, fimDaSimulacao)}
      </p>
      {cortado && (
        <p className="text-[11px] text-texto-suave">
          O programa deu {totalPassos.toLocaleString("pt-BR")} passos; a linha do tempo guarda os primeiros e o fim.
        </p>
      )}
    </div>
  );
}
