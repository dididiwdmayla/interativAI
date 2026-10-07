"use client";

/*
 * Os cartões de ligar: cada cartão vai para o alvo certo. Toca no cartão
 * (ele sobe) e depois no alvo; cartão no alvo certo mostra a revelação. O
 * alvo errado não grita: o cartão fica lá, sem acender, e dá para levar
 * para outro lugar.
 */
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { IconeCerto } from "@/componentes/icones/IconeCerto";
import { sinalizarUso } from "@/ferramentas/uso";
import { cartaoCerto, type EstacaoLigar as DadosLigar, type EstadoLigar, ordemNaMesa } from "@/motor/exposicao/cartoes";
import { NucleoDaEstacao } from "./NucleoDaEstacao";
import type { PropsEstacao } from "./tipos";

export function EstacaoLigar({ estacao, estado, mexer, toque, destaque }: PropsEstacao<DadosLigar, EstadoLigar>) {
  const reduzir = useReducedMotion();
  const [escolhido, setEscolhido] = useState<string | null>(null);
  const naMesa = ordemNaMesa(estacao).filter((id) => !(id in estado.ligacoes));
  const porId = new Map(estacao.cartoes.map((c) => [c.id, c]));
  const cartaoBotao = (id: string, noAlvo: boolean) => {
    const cartao = porId.get(id);
    if (!cartao) return null;
    const certo = noAlvo && cartaoCerto(estacao, estado, id);
    const ativo = escolhido === id;
    return (
      <motion.button
        layout={!reduzir}
        layoutId={reduzir ? undefined : `${estacao.id}-${id}`}
        key={id}
        type="button"
        aria-pressed={ativo}
        onClick={(evento) => {
          evento.stopPropagation();
          // Com outro cartão na mão, tocar num cartão já colocado é tocar no alvo dele.
          const alvoDele = estado.ligacoes[id];
          if (noAlvo && escolhido && escolhido !== id && alvoDele) {
            mexer({ tipo: "ligarCartao", estacao: estacao.id, cartao: escolhido, alvo: alvoDele });
            setEscolhido(null);
            return;
          }
          // Escolher um cartão já é usar a mesa (o "Experimente" da apresentação termina aqui).
          sinalizarUso("cartoes-de-ligar");
          setEscolhido(ativo ? null : id);
        }}
        className={`rounded-xl border-2 px-2.5 py-1.5 text-left text-xs font-bold leading-snug shadow-[0_3px_0_var(--cor-sombra)] pointer-coarse:min-h-11 ${
          ativo ? "-translate-y-0.5 border-primaria bg-selecao text-texto" : certo ? "border-sucesso bg-superficie text-texto" : "border-borda bg-[var(--cor-museu-placa)] text-texto hover:bg-hover"
        } ${destaque?.peca === id ? "animate-pulse ring-4 ring-destaque" : ""}`}
        data-cartao-ligar={id}
        data-certo={certo ? "sim" : "nao"}
      >
        <span className="flex items-start gap-1">
          {certo && <IconeCerto tamanho={14} />}
          <span>{cartao.texto}</span>
        </span>
        {certo && cartao.revela && <span className="mt-1 block text-[11px] font-normal text-texto-suave">{cartao.revela}</span>}
      </motion.button>
    );
  };
  return (
    <div className="flex flex-col gap-2" data-estacao-ligar={estacao.id}>
      <p className="text-sm font-black text-texto">{estacao.pergunta}</p>
      <NucleoDaEstacao tipo="ligar" className="flex min-h-14 flex-wrap gap-1.5 rounded-xl border-2 border-dashed border-borda bg-painel p-2">
        {naMesa.length ? naMesa.map((id) => cartaoBotao(id, false)) : <p className="text-xs font-bold text-texto-suave">Todos os cartões estão nos lugares.</p>}
      </NucleoDaEstacao>
      <p className="text-xs font-bold text-texto-suave" aria-live="polite">
        {escolhido ? `Agora ${toque ? "toque" : "clique"} no lugar onde vai "${porId.get(escolhido)?.texto}".` : `${toque ? "Toque" : "Clique"} num cartão para escolher.`}
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {estacao.alvos.map((alvo) => {
          const aqui = estacao.cartoes.filter((c) => estado.ligacoes[c.id] === alvo.id).map((c) => c.id);
          return (
            <div
              key={alvo.id}
              role="button"
              tabIndex={0}
              onClick={() => {
                if (!escolhido) return;
                mexer({ tipo: "ligarCartao", estacao: estacao.id, cartao: escolhido, alvo: alvo.id });
                setEscolhido(null);
              }}
              onKeyDown={(evento) => {
                if ((evento.key === "Enter" || evento.key === " ") && escolhido) {
                  evento.preventDefault();
                  mexer({ tipo: "ligarCartao", estacao: estacao.id, cartao: escolhido, alvo: alvo.id });
                  setEscolhido(null);
                }
              }}
              className={`flex min-h-16 flex-col gap-1 rounded-2xl border-2 p-2 ${escolhido ? "cursor-pointer border-primaria bg-superficie hover:bg-hover" : "border-borda bg-superficie"} ${destaque?.peca === alvo.id ? "animate-pulse ring-4 ring-destaque" : ""}`}
              aria-label={`${alvo.nome}${escolhido ? ": pôr o cartão aqui" : ""}`}
              data-alvo-ligar={alvo.id}
            >
              <p className="text-sm font-black text-texto">{alvo.nome}</p>
              {alvo.descricao && <p className="text-[11px] text-texto-suave">{alvo.descricao}</p>}
              <div className="flex flex-wrap gap-1">
                <AnimatePresence initial={false}>{aqui.map((id) => cartaoBotao(id, true))}</AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
