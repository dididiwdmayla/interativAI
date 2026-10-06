"use client";

/*
 * A linha do tempo: os cartões começam na caixa, embaralhados; tocar num
 * cartão escolhe ele, e tocar num "Pôr aqui" da linha põe ele no lugar. As
 * setas mudam de lugar e o x devolve para a caixa (os fixos não saem). O
 * cartão no lugar certo, em relação aos outros da linha, mostra a época e
 * o que ele mudou. Com plaquinhas, as frases do "o que mudou" ficam soltas
 * e cada uma é pendurada no cartão certo.
 */
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { IconeChevron } from "@/componentes/icones/IconeChevron";
import { cartaoNoLugar, type EstacaoLinhaDoTempo as DadosLinha, type EstadoLinhaDoTempo, type EventoHistorico, ordemNaCaixa } from "@/motor/exposicao/modelo";
import { FiguraEvento } from "./FiguraEvento";
import type { PropsEstacao } from "./tipos";

type Escolha = { tipo: "cartao"; id: string } | { tipo: "plaquinha"; id: string } | null;

function PorAqui({ aoPor, rotulo, dados }: { aoPor: () => void; rotulo: string; dados: string }) {
  return (
    <li>
      <button
        type="button"
        onClick={aoPor}
        className="flex min-h-9 w-full items-center justify-center rounded-xl border-2 border-dashed border-primaria bg-selecao text-xs font-black text-primaria hover:brightness-105 pointer-coarse:min-h-11"
        data-por-aqui={dados}
      >
        {rotulo}
      </button>
    </li>
  );
}

export function EstacaoLinhaDoTempo({ estacao, estado, mexer, toque, destaque }: PropsEstacao<DadosLinha, EstadoLinhaDoTempo>) {
  const [escolha, setEscolha] = useState<Escolha>(null);
  const porId = new Map(estacao.eventos.map((evento) => [evento.id, evento]));
  const naCaixa = ordemNaCaixa(estacao).filter((id) => !estado.linha.includes(id));
  const plaquinhasSoltas = estacao.plaquinhas ? ordemNaCaixa(estacao).reverse().filter((id) => !Object.values(estado.plaquinhas).includes(id)) : [];
  const escolhido = escolha?.tipo === "cartao" ? escolha.id : null;
  const plaquinhaEscolhida = escolha?.tipo === "plaquinha" ? escolha.id : null;
  const fixo = (id: string) => estacao.fixos?.includes(id) ?? false;
  const verbo = toque ? "Toque" : "Clique";

  const por = (posicao: number) => {
    if (!escolhido) return;
    if (mexer({ tipo: "porNaLinha", estacao: estacao.id, evento: escolhido, posicao })) setEscolha(null);
  };

  const itens: React.ReactNode[] = [];
  estado.linha.forEach((id, i) => {
    if (escolhido && escolhido !== id && estado.linha[i - 1] !== escolhido) itens.push(<PorAqui key={`aqui-${i}`} aoPor={() => por(i)} rotulo="Pôr aqui" dados={String(i)} />);
    const evento = porId.get(id);
    if (!evento) return;
    const certo = cartaoNoLugar(estacao, estado.linha, id);
    const placa = estado.plaquinhas[id];
    const pisca = destaque?.peca === id;
    itens.push(
      <motion.li layout key={id} className={`rounded-2xl border-2 bg-superficie p-2 ${certo ? "border-sucesso" : "border-borda"} ${pisca ? "animate-pulse ring-4 ring-destaque" : ""}`} data-cartao-linha={id} data-no-lugar={certo ? "sim" : "nao"}>
        <div className="flex items-start gap-2">
          <FiguraEvento figura={evento.figura} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black leading-tight text-texto">{evento.titulo}</p>
            {certo ? (
              <p className="text-xs font-black uppercase tracking-wide text-sucesso" data-epoca>
                {evento.epoca}
              </p>
            ) : (
              <p className="text-xs font-bold text-texto-suave">{evento.pista}</p>
            )}
          </div>
          {!fixo(id) && (
            <div className="flex shrink-0 flex-col gap-0.5">
              <button type="button" disabled={i === 0} onClick={() => mexer({ tipo: "porNaLinha", estacao: estacao.id, evento: id, posicao: i - 1 })} aria-label={`Subir ${evento.titulo}`} className="grid h-7 w-7 place-items-center rounded-lg text-texto-suave hover:bg-hover disabled:opacity-30 pointer-coarse:h-10 pointer-coarse:w-10">
                <IconeChevron direcao="cima" />
              </button>
              <button type="button" onClick={() => mexer({ tipo: "tirarDaLinha", estacao: estacao.id, evento: id })} aria-label={`Devolver ${evento.titulo} para a caixa`} className="grid h-7 w-7 place-items-center rounded-lg text-sm font-black text-texto-suave hover:bg-hover pointer-coarse:h-10 pointer-coarse:w-10" data-tirar-da-linha={id}>
                x
              </button>
              <button type="button" disabled={i === estado.linha.length - 1} onClick={() => mexer({ tipo: "porNaLinha", estacao: estacao.id, evento: id, posicao: i + 1 })} aria-label={`Descer ${evento.titulo}`} className="grid h-7 w-7 place-items-center rounded-lg text-texto-suave hover:bg-hover disabled:opacity-30 pointer-coarse:h-10 pointer-coarse:w-10">
                <IconeChevron direcao="baixo" />
              </button>
            </div>
          )}
        </div>
        {estacao.plaquinhas ? (
          placa ? (
            <p className="mt-1.5 rounded-lg border-2 border-[var(--cor-museu-placa-borda)] bg-[var(--cor-museu-placa)] px-2 py-1 text-xs font-bold text-texto" data-plaquinha-pendurada={placa}>
              {porId.get(placa)?.mudou}
            </p>
          ) : plaquinhaEscolhida ? (
            <button
              type="button"
              onClick={() => {
                if (mexer({ tipo: "pendurarPlaquinha", estacao: estacao.id, evento: id, plaquinha: plaquinhaEscolhida })) setEscolha(null);
              }}
              className="mt-1.5 w-full rounded-lg border-2 border-dashed border-primaria bg-selecao px-2 py-1 text-xs font-black text-primaria pointer-coarse:min-h-11"
              data-pendurar-em={id}
            >
              Pendurar aqui
            </button>
          ) : null
        ) : (
          <AnimatePresence initial={false}>
            {certo && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-1.5 rounded-lg bg-[var(--cor-museu-placa)] px-2 py-1 text-xs font-bold text-texto" data-mudou>
                <span className="font-black">O que mudou: </span>
                {evento.mudou}
              </motion.p>
            )}
          </AnimatePresence>
        )}
      </motion.li>,
    );
  });
  if (escolhido && estado.linha[estado.linha.length - 1] !== escolhido) {
    itens.push(<PorAqui key="aqui-fim" aoPor={() => por(estado.linha.length)} rotulo={estado.linha.length ? "Pôr no fim" : "Pôr aqui"} dados="fim" />);
  }

  const cartaoDaCaixa = (evento: EventoHistorico) => (
    <li key={evento.id}>
      <button
        type="button"
        aria-pressed={escolhido === evento.id}
        onClick={() => setEscolha(escolhido === evento.id ? null : { tipo: "cartao", id: evento.id })}
        className={`flex w-full items-center gap-2 rounded-2xl border-2 bg-superficie p-2 text-left hover:bg-hover ${escolhido === evento.id ? "border-primaria ring-2 ring-primaria" : "border-borda"} ${destaque?.peca === evento.id ? "animate-pulse ring-4 ring-destaque" : ""}`}
        data-cartao-caixa={evento.id}
      >
        <FiguraEvento figura={evento.figura} tamanho={36} />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-black leading-tight text-texto">{evento.titulo}</span>
          <span className="block text-xs font-bold text-texto-suave">{evento.pista}</span>
        </span>
      </button>
    </li>
  );

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start" data-estacao-linha={estacao.id}>
      <section className="flex min-w-0 flex-1 flex-col gap-1.5" aria-label="A linha do tempo, do mais antigo ao mais novo">
        <p className="text-xs font-black uppercase tracking-wide text-texto-suave">Mais antigo</p>
        <ol className={`relative flex flex-col gap-1.5 border-l-4 pl-3 ${destaque && !destaque.peca ? "border-destaque" : "border-[var(--cor-museu-placa-borda)]"}`} data-linha-do-tempo>
          <AnimatePresence initial={false}>{itens}</AnimatePresence>
          {estado.linha.length === 0 && !escolhido && <li className="rounded-xl border-2 border-dashed border-borda p-3 text-center text-sm font-bold text-texto-suave">{verbo} num cartão da caixa para começar.</li>}
        </ol>
        <p className="text-xs font-black uppercase tracking-wide text-texto-suave">Mais novo</p>
      </section>
      <section className="flex flex-col gap-1.5 lg:w-72 lg:shrink-0" aria-label="A caixa de cartões">
        <p className="text-xs font-black uppercase tracking-wide text-texto-suave">{naCaixa.length ? `Na caixa (${naCaixa.length})` : "A caixa está vazia"}</p>
        <ul className="flex flex-col gap-1.5" data-caixa-de-cartoes>
          {naCaixa.map((id) => {
            const evento = porId.get(id);
            return evento ? cartaoDaCaixa(evento) : null;
          })}
        </ul>
        {estacao.plaquinhas && plaquinhasSoltas.length > 0 && (
          <>
            <p className="mt-2 text-xs font-black uppercase tracking-wide text-texto-suave">Plaquinhas do &quot;o que mudou&quot;</p>
            <ul className="flex flex-col gap-1.5" data-plaquinhas-soltas>
              {plaquinhasSoltas.map((id) => (
                <li key={id}>
                  <button
                    type="button"
                    aria-pressed={plaquinhaEscolhida === id}
                    onClick={() => setEscolha(plaquinhaEscolhida === id ? null : { tipo: "plaquinha", id })}
                    className={`w-full rounded-lg border-2 bg-[var(--cor-museu-placa)] px-2 py-1.5 text-left text-xs font-bold text-texto hover:brightness-105 pointer-coarse:min-h-11 ${plaquinhaEscolhida === id ? "border-primaria ring-2 ring-primaria" : "border-[var(--cor-museu-placa-borda)]"}`}
                    data-plaquinha={id}
                  >
                    {porId.get(id)?.mudou}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
