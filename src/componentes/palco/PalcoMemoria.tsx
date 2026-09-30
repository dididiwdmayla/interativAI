"use client";

/*
 * O palco da memória (Ilha Lógica): a tela das fases de programa. Cada
 * variável é uma caixinha com nome, valor e tipo (cor de token); listas são
 * vagões numerados e objetos, fichas; duas variáveis apontando para a
 * mesma lista ganham uma seta. Enquanto uma função roda, ela tem a própria
 * moldura. O que é novo surge e o que mudou pisca (comparando com o passo
 * anterior). As regras do desenho estão em src/motor/palco.ts.
 */
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { textoPrevia } from "@/motor/executor/formatar";
import type { ErroExecucao, FotoMemoria, PassoRastro } from "@/motor/executor/tipos";
import { mudancasDoPalco, planoDoPalco, type VariavelPalco } from "@/motor/palco";
import { memoriaParaExibido } from "@/motor/programa";
import { QuadroPalco } from "./QuadroPalco";

type Props = {
  foto: FotoMemoria | null;
  anterior: FotoMemoria | null;
  /** O passo mostrado (a faixa de retorno ou de erro na moldura). */
  passo: PassoRastro | null;
  erro: ErroExecucao | null;
};

type Seta = { id: string; d: string };

export function PalcoMemoria({ foto, anterior, passo, erro }: Props) {
  const plano = useMemo(() => planoDoPalco(foto), [foto]);
  const planoAnterior = useMemo(() => (anterior ? planoDoPalco(anterior) : null), [anterior]);
  const { novas, mudaram } = useMemo(() => mudancasDoPalco(plano, planoAnterior), [plano, planoAnterior]);
  const anteriores = useMemo(() => {
    const mapa = new Map<string, VariavelPalco>();
    for (const quadro of planoAnterior?.quadros ?? []) for (const escopo of quadro.escopos) for (const v of escopo.variaveis) mapa.set(v.chave, v);
    return mapa;
  }, [planoAnterior]);
  const conteudo = useRef<HTMLDivElement>(null);
  const [setas, setSetas] = useState<Seta[]>([]);
  const [tamanho, setTamanho] = useState({ largura: 0, altura: 0 });

  // As setas: da bolinha do ponteiro até a lista (ou ficha) desenhada em outro lugar.
  useLayoutEffect(() => {
    const raiz = conteudo.current;
    if (!raiz) return;
    const medir = () => {
      const base = raiz.getBoundingClientRect();
      const novas: Seta[] = [];
      raiz.querySelectorAll<HTMLElement>("[data-ponta-seta]").forEach((ponta, i) => {
        const alvo = raiz.querySelector<HTMLElement>(`[data-ancora-objeto="${ponta.dataset.pontaSeta}"]`);
        if (!alvo) return;
        const a = ponta.getBoundingClientRect();
        const b = alvo.getBoundingClientRect();
        const x1 = a.left + a.width / 2 - base.left;
        const y1 = a.top + a.height / 2 - base.top;
        const x2 = b.left - base.left - 3;
        const y2 = b.top + Math.min(14, b.height / 2) - base.top;
        const curva = Math.max(30, Math.abs(y2 - y1) / 2);
        novas.push({ id: `${ponta.dataset.pontaSeta}-${i}`, d: `M ${x1} ${y1} C ${x1 - curva} ${y1}, ${x2 - curva} ${y2}, ${x2} ${y2}` });
      });
      setSetas(novas);
      setTamanho({ largura: raiz.scrollWidth, altura: raiz.scrollHeight });
    };
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(raiz);
    return () => observador.disconnect();
  }, [plano]);

  const topo = plano.quadros.length - 1;
  const faixaDoTopo =
    passo?.tipo === "retorno" && passo.retorno && foto
      ? { texto: `devolve ${textoPrevia(memoriaParaExibido(passo.retorno.valor, foto.monte), true)}`, tom: "retorno" as const }
      : null;
  const vazio = plano.quadros.every((quadro) => quadro.escopos.every((escopo) => escopo.variaveis.length === 0));

  return (
    <div className="relative min-h-0 flex-1 overflow-auto bg-codigo-fundo" data-palco data-setas={setas.length}>
      <div ref={conteudo} className="relative flex min-h-full flex-col gap-3 p-3">
        {!foto || (vazio && plano.quadros.length <= 1) ? (
          <p className="m-auto max-w-72 text-center text-sm text-texto-suave" data-palco-vazio>
            A memória está vazia. Crie uma variável (let preco = 5) e ela aparece aqui como uma caixinha.
          </p>
        ) : (
          plano.quadros.map((quadro, i) => (
            <QuadroPalco
              key={quadro.chave}
              quadro={quadro}
              anteriores={anteriores}
              novas={novas}
              mudaram={mudaram}
              ativo={i === topo}
              faixa={i === topo && i > 0 ? faixaDoTopo : null}
            />
          ))
        )}
        {erro && passo?.tipo === "erro" && (
          <p className="rounded-xl border-2 border-erro bg-js-erro-fundo px-3 py-1.5 text-sm font-bold text-erro" data-palco-erro>
            O programa parou{erro.linha !== null ? ` na linha ${erro.linha}` : ""}: {erro.nome || "erro"}
          </p>
        )}
        {setas.length > 0 && (
          <svg className="pointer-events-none absolute left-0 top-0" width={tamanho.largura} height={tamanho.altura} aria-hidden="true">
            <defs>
              <marker id="ponta-da-seta-palco" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--cor-js-objeto)" />
              </marker>
            </defs>
            {setas.map((seta) => (
              <path key={seta.id} d={seta.d} fill="none" stroke="var(--cor-js-objeto)" strokeWidth={2.5} strokeDasharray="5 4" markerEnd="url(#ponta-da-seta-palco)" data-seta-palco />
            ))}
          </svg>
        )}
      </div>
    </div>
  );
}
