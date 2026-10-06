"use client";

/*
 * A sala do museu (a área exposicao da tela composta): a placa da peça, o
 * antepassado anfitrião falando do jeito da época dele e as estações
 * interativas (no desafio, várias, em abas). Larga, o anfitrião fica numa
 * coluna à esquerda; estreita, ele fica em cima, menor, e a estação embaixo.
 */
import { IconeCerto } from "@/componentes/icones/IconeCerto";
import { AlvoFerramenta } from "@/componentes/ferramentas/AlvoFerramenta";
import { FalaAntepassado } from "@/componentes/museu/FalaAntepassado";
import type { IdFerramenta } from "@/ferramentas/ids";
import { FERRAMENTA_DA_ESTACAO } from "@/motor/exposicao/conferir";
import type { AcaoExposicao, DadosExposicao, Estacao, EstadoEstacao, EstadoExposicao } from "@/motor/exposicao/modelo";
import { EstacaoBits } from "./EstacaoBits";
import { EstacaoCamadas } from "./EstacaoCamadas";
import { EstacaoCor } from "./EstacaoCor";
import { EstacaoLinhaDoTempo } from "./EstacaoLinhaDoTempo";
import { EstacaoTear } from "./EstacaoTear";

type Props = {
  dados: DadosExposicao;
  estado: EstadoExposicao;
  mexer: (acao: AcaoExposicao) => boolean;
  toque: boolean;
  destaque: { estacao: string; peca?: string } | null;
  /** O que o anfitrião diz agora (muda com o objetivo ou a parte). */
  fala: string;
  /** A fase terminou: o anfitrião fica orgulhoso. */
  concluida: boolean;
  /** As estações já cumpridas (no desafio, as partes marcadas de cada uma). */
  feitas?: readonly string[];
  /** O layout do jogo: em pé, o anfitrião fica em cima e menor; deitado, numa coluna estreita. */
  layout: "desktop" | "retrato" | "paisagem";
  aoAbrirCard?: (id: IdFerramenta) => void;
};

function ConteudoDaEstacao({ estacao, estado, ...resto }: { estacao: Estacao; estado: EstadoEstacao; mexer: Props["mexer"]; toque: boolean; destaque: { peca?: string } | null }) {
  if (estacao.tipo === "tear" && estado.tipo === "tear") return <EstacaoTear estacao={estacao} estado={estado} {...resto} />;
  if (estacao.tipo === "bits" && estado.tipo === "bits") return <EstacaoBits estacao={estacao} estado={estado} {...resto} />;
  if (estacao.tipo === "camadas" && estado.tipo === "camadas") return <EstacaoCamadas estacao={estacao} estado={estado} {...resto} />;
  if (estacao.tipo === "cor" && estado.tipo === "cor") return <EstacaoCor estacao={estacao} estado={estado} {...resto} />;
  if (estacao.tipo === "linha-do-tempo" && estado.tipo === "linha-do-tempo") return <EstacaoLinhaDoTempo estacao={estacao} estado={estado} {...resto} />;
  return null;
}

export function SalaExposicao({ dados, estado, mexer, toque, destaque, fala, concluida, feitas = [], layout, aoAbrirCard }: Props) {
  const estreita = layout === "retrato";
  const deitado = layout === "paisagem";
  const aberta = dados.estacoes.find((estacao) => estacao.id === estado.aberta) ?? dados.estacoes[0];
  const estadoAberta = aberta ? estado.estacoes[aberta.id] : null;
  return (
    <div
      className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border-2 border-[var(--cor-museu-rodape)] bg-[var(--cor-museu-parede)] shadow-[0_8px_0_var(--cor-sombra)]"
      data-sala-exposicao
      data-anfitriao={dados.anfitriao}
    >
      <div className={`flex min-h-0 flex-1 ${estreita ? "flex-col" : "flex-row"} overflow-y-auto`}>
        {/* O anfitrião e a placa */}
        <aside
          className={`flex shrink-0 flex-col gap-2 p-3 ${estreita ? "" : `${deitado ? "w-[clamp(12rem,30%,16rem)]" : "w-[clamp(15rem,32%,22rem)]"} overflow-y-auto border-r-2 border-[var(--cor-museu-rodape)]`}`}
          aria-label="O anfitrião da sala"
        >
          {/* A placa da peça: no celular, só o nome (o texto abre ao tocar). */}
          {estreita || deitado ? (
            <details className="rounded-xl border-2 border-[var(--cor-museu-placa-borda)] bg-[var(--cor-museu-placa)] px-3 py-1.5" data-placa>
              <summary className="cursor-pointer text-sm font-black text-texto">{dados.placa.titulo}</summary>
              <p className="mt-1 text-xs font-bold leading-snug text-texto-suave">{dados.placa.texto}</p>
            </details>
          ) : (
            <div className="rounded-xl border-2 border-[var(--cor-museu-placa-borda)] bg-[var(--cor-museu-placa)] px-3 py-2" data-placa>
              <p className="text-sm font-black text-texto">{dados.placa.titulo}</p>
              <p className="text-xs font-bold leading-snug text-texto-suave">{dados.placa.texto}</p>
            </div>
          )}
          <FalaAntepassado
            key={fala}
            id={dados.anfitriao}
            texto={fala}
            expressao={concluida ? "orgulhoso" : "feliz"}
            tamanho={estreita ? 64 : deitado ? 72 : 132}
            arranjo={estreita ? "lado" : "pilha"}
          />
        </aside>
        {/* As estações */}
        <section className="flex min-w-0 flex-1 flex-col gap-2 bg-[var(--cor-museu-piso)] p-3" aria-label="A exposição">
          {dados.estacoes.length > 1 && (
            <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="As estações da exposição">
              {dados.estacoes.map((estacao) => {
                const selecionada = estacao.id === aberta?.id;
                return (
                  <button
                    key={estacao.id}
                    type="button"
                    role="tab"
                    aria-selected={selecionada}
                    onClick={() => mexer({ tipo: "abrirEstacao", estacao: estacao.id })}
                    className={`inline-flex min-h-9 items-center gap-1 rounded-full border-2 px-3 text-xs font-black pointer-coarse:min-h-11 ${selecionada ? "border-primaria bg-primaria text-sobre-primaria" : "border-borda bg-superficie text-texto hover:bg-hover"} ${destaque?.estacao === estacao.id && !selecionada ? "animate-pulse ring-4 ring-destaque" : ""}`}
                    data-aba-estacao={estacao.id}
                  >
                    {feitas.includes(estacao.id) && <IconeCerto tamanho={12} />}
                    {estacao.titulo}
                  </button>
                );
              })}
            </div>
          )}
          {aberta && estadoAberta && (
            <AlvoFerramenta
              ids={[FERRAMENTA_DA_ESTACAO[aberta.tipo]]}
              marcador={FERRAMENTA_DA_ESTACAO[aberta.tipo]}
              aoAbrirCard={aoAbrirCard}
              classeMarcador="right-2 top-2"
              className={`relative flex min-h-0 flex-1 flex-col rounded-2xl border-2 bg-superficie p-3 ${destaque?.estacao === aberta.id && !destaque.peca ? "animate-pulse border-destaque ring-4 ring-destaque" : "border-borda"}`}
            >
              {dados.estacoes.length === 1 && <h3 className="mb-2 text-sm font-black uppercase tracking-wide text-texto-suave">{aberta.titulo}</h3>}
              <div data-estacao={aberta.id} data-tipo-estacao={aberta.tipo} className="min-h-0 flex-1">
                <ConteudoDaEstacao
                  key={aberta.id}
                  estacao={aberta}
                  estado={estadoAberta}
                  mexer={mexer}
                  toque={toque}
                  destaque={destaque?.estacao === aberta.id ? { peca: destaque.peca } : null}
                />
              </div>
            </AlvoFerramenta>
          )}
        </section>
      </div>
    </div>
  );
}
