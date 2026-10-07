"use client";

/*
 * A tela composta em miniatura, para o antes e o depois da meta de um
 * desafio composto: a cena, o plano, o código e os casos de teste (as áreas
 * que a fase tem), sem nada clicável.
 */
import { IconeCerto } from "@/componentes/icones/IconeCerto";
import { acharBlocoDoPlano } from "@/motor/plano/comentarios";
import type { RetratoComposicao } from "@/motor/simulacao";
import { CenaSvg } from "@/componentes/cena/CenaSvg";
import { canaisDaCor, resumoDaEstacao, valorDosBits } from "@/motor/exposicao/modelo";

/** O código da miniatura: o bloco do plano vira uma linha só (o plano já aparece em cima), para a função caber. */
function codigoResumido(codigo: string): string {
  const bloco = acharBlocoDoPlano(codigo);
  if (!bloco) return codigo;
  const linhas = codigo.slice(bloco.de, bloco.ate).split("\n");
  return `${codigo.slice(0, bloco.de)}${linhas[0]} (${linhas.length - 1} passos em comentário)${codigo.slice(bloco.ate)}`;
}

/** Linhas do código mostradas (o resto vira "..."). */
const LINHAS_DO_CODIGO = 9;

export function MiniComposicao({ retrato, legenda }: { retrato: RetratoComposicao | null; legenda: string }) {
  const linhas = retrato?.codigo ? codigoResumido(retrato.codigo).split("\n") : [];
  return (
    <figure className="flex min-w-0 flex-1 flex-col gap-1" data-mini-composicao={legenda}>
      <figcaption className="text-xs font-black uppercase tracking-wide text-texto-suave">{legenda}</figcaption>
      <div className="flex h-72 min-w-0 flex-col gap-1.5 overflow-hidden rounded-xl border-2 border-borda bg-painel p-1.5 text-[11px]">
        {retrato?.exposicao &&
          retrato.exposicao.dados.estacoes.map((estacao) => {
            const estado = retrato.exposicao?.estado.estacoes[estacao.id];
            if (!estado) return null;
            return (
              <section key={estacao.id} className="rounded-lg border-2 border-borda bg-superficie px-2 py-1" data-mini-estacao={estacao.id}>
                <p className="text-[10px] font-black uppercase tracking-wide text-texto-suave">{estacao.titulo}</p>
                {estado.tipo === "tear" && (
                  <div className="inline-block rounded border border-borda bg-[var(--cor-ante-cartao)] p-0.5" aria-hidden="true">
                    {estado.furos.map((linha, l) => (
                      <div key={l} className="flex">
                        {[...linha].map((c, k) => (
                          <span key={k} className={`h-2 w-2 ${c === "#" ? "bg-[var(--cor-ante-fio-a)]" : ""}`} />
                        ))}
                      </div>
                    ))}
                  </div>
                )}
                {estado.tipo === "bits" && (
                  <p className="font-mono font-bold text-texto">
                    {estado.bits} = {valorDosBits(estado.bits)}
                  </p>
                )}
                {estado.tipo === "cor" && (
                  <p className="flex items-center gap-1 font-mono font-bold text-texto">
                    {/* A cor do aluno é dado do conteúdo (como os sites-alvo), não do tema. */}
                    <span className="inline-block h-3 w-3 rounded border border-borda" style={{ background: estado.hex }} />
                    {estado.hex} (r {canaisDaCor(estado.hex).r})
                  </p>
                )}
                {estado.tipo === "camadas" && <p className="font-bold text-texto">{estado.abertas} camada(s) aberta(s)</p>}
                {estado.tipo === "linha-do-tempo" &&
                  (estado.linha.length && estacao.tipo === "linha-do-tempo" ? (
                    <ol className="list-inside list-decimal font-bold text-texto">
                      {estado.linha.map((id) => (
                        <li key={id}>{estacao.eventos.find((e) => e.id === id)?.titulo ?? id}</li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-texto-suave">Linha vazia: os cartões estão na caixa.</p>
                  ))}
                {/* As estações das salas 3 a 6: a frase do estado (o mesmo resumo do tutor). */}
                {!["tear", "bits", "cor", "camadas", "linha-do-tempo"].includes(estado.tipo) && <p className="font-bold text-texto">{resumoDaEstacao(estacao, estado).replace(`${estacao.titulo}: `, "")}</p>}
              </section>
            );
          })}
        {retrato?.cena && (
          <section className="h-28 shrink-0 overflow-hidden rounded-lg border-2 border-borda bg-superficie" data-mini-cena={retrato.cena.dados.id}>
            <CenaSvg dados={retrato.cena.dados} rastro={retrato.cena.rastro} tempoMs={retrato.cena.tempoMs} />
          </section>
        )}
        {retrato?.plano && (
          <section className="rounded-lg border-2 border-borda bg-superficie px-2 py-1" data-mini-plano>
            <p className="text-[10px] font-black uppercase tracking-wide text-texto-suave">Plano</p>
            {retrato.plano.length ? (
              <ol className="list-inside list-decimal font-bold text-texto">
                {retrato.plano.map((passo) => (
                  <li key={passo} className="break-words">
                    {passo}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-texto-suave">Vazio: os cartões estão na pilha.</p>
            )}
          </section>
        )}
        {retrato?.codigo !== null && retrato?.codigo !== undefined && (
          <section className="min-h-0 flex-1 overflow-hidden rounded-lg border-2 border-borda bg-codigo-fundo px-2 py-1" data-mini-codigo>
            <p className="font-sans text-[10px] font-black uppercase tracking-wide text-texto-suave">Código</p>
            {retrato.codigo.trim() ? (
              <pre className="whitespace-pre-wrap break-all font-mono text-[10px] leading-snug text-codigo-texto">
                {linhas.slice(0, LINHAS_DO_CODIGO).join("\n")}
                {linhas.length > LINHAS_DO_CODIGO ? "\n..." : ""}
              </pre>
            ) : (
              <p className="font-sans text-texto-suave">Vazio.</p>
            )}
          </section>
        )}
        {retrato?.casos && (
          <section className="rounded-lg border-2 border-borda bg-superficie px-2 py-1" data-mini-casos>
            <p className="text-[10px] font-black uppercase tracking-wide text-texto-suave">Casos de teste</p>
            {retrato.casos.length ? (
              <ul className="flex flex-col gap-0.5">
                {retrato.casos.map((caso) => (
                  <li key={`${caso.chamada}-${caso.esperado}`} className="flex items-center gap-1 font-mono">
                    <span className={`inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full ${caso.passou ? "bg-sucesso text-superficie" : "bg-borda"}`}>
                      {caso.passou && <IconeCerto tamanho={9} />}
                    </span>
                    <span className="min-w-0 break-all">
                      {caso.chamada} devolve {caso.esperado}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-texto-suave">Nenhum caso ainda.</p>
            )}
          </section>
        )}
      </div>
    </figure>
  );
}
