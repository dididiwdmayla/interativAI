"use client";

/*
 * A bancada do circuito lógico. Mouse e toque pelo mesmo caminho (Pointer
 * Events): arrastar o corpo de uma peça muda ela de lugar; tocar sem
 * arrastar liga ou desliga uma chave (ou escolhe o portão); tocar na
 * bolinha da direita de uma peça e depois numa bolinha da esquerda de
 * outra liga o fio. Os fios acesos mostram a corrente andando.
 */
import { type PointerEvent, useEffect, useMemo, useId, useRef, useState } from "react";
import { ALTURA_BANCADA, type Circuito, fioChave, LARGURA_BANCADA, NOME_DO_PORTAO, type TipoPortao } from "@/motor/circuito/modelo";
import { alvosDoCircuito, celulaDoAlvo, caminhoDoFio, geometriaDa } from "./geometria";
import { BotaoNavegacaoCircuito } from "./BotaoNavegacaoCircuito";
import { PecaCircuito } from "./PecaCircuito";

type Props = {
  circuito: Circuito;
  valores: Record<string, boolean>;
  fios: Record<string, boolean>;
  paleta: readonly TipoPortao[];
  toque: boolean;
  /** Degrau 3 da ajuda: o id de uma peça, "paleta" ou null. */
  destaque: string | null;
  aoAdicionar: (portao: TipoPortao) => void;
  aoLigar: (de: string, para: string, porta: number) => void;
  aoAlternar: (entrada: string) => void;
  aoMover: (id: string, x: number, y: number) => void;
  aoApagarPeca: (id: string) => void;
  aoApagarFio: (para: string, porta: number) => void;
};

type Arrasto = { id: string; inicio: { x: number; y: number }; origem: { x: number; y: number }; andou: boolean };
type Quadro = { x: number; y: number; largura: number; altura: number };
type PontoTela = { clientX: number; clientY: number };
type Navegacao =
  | { tipo: "arrastar"; inicio: PontoTela; quadro: Quadro; escala: number }
  | { tipo: "pinca"; distancia: number; ancora: { x: number; y: number }; quadro: Quadro; escala: number };
const lerQuadro = (texto: string): Quadro => {
  const [x, y, largura, altura] = texto.split(" ").map(Number);
  return { x, y, largura, altura };
};
const distancia = (a: PontoTela, b: PontoTela) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
const meio = (a: PontoTela, b: PontoTela): PontoTela => ({ clientX: (a.clientX + b.clientX) / 2, clientY: (a.clientY + b.clientY) / 2 });
type Escolha = { tipo: "peca"; id: string } | { tipo: "fio"; para: string; porta: number } | null;

export function BancadaCircuito({ circuito, valores, fios, paleta, toque, destaque, aoAdicionar, aoLigar, aoAlternar, aoMover, aoApagarPeca, aoApagarFio }: Props) {
  const prefixoAlvos = useId().replace(/:/g, "");
  const alvos = useMemo(() => alvosDoCircuito(circuito.pecas), [circuito.pecas]);
  const svg = useRef<SVGSVGElement>(null);
  const arrasto = useRef<Arrasto | null>(null);
  const [puxando, setPuxando] = useState<string | null>(null);
  const [escolha, setEscolha] = useState<Escolha>(null);
  const porId = new Map(circuito.pecas.map((peca) => [peca.id, peca]));
  // Enquadra só a área com peças (na tela estreita, as peças ficam maiores); parado enquanto arrasta.
  const enquadramento = useMemo(() => {
    const caixas = circuito.pecas.map((peca) => ({ peca, g: geometriaDa(peca) }));
    if (!caixas.length) return `0 0 ${LARGURA_BANCADA} ${ALTURA_BANCADA}`;
    const x0 = Math.max(0, Math.min(...caixas.map((c) => c.peca.x)) - 24);
    const y0 = Math.max(0, Math.min(...caixas.map((c) => c.peca.y)) - 24);
    const x1 = Math.min(LARGURA_BANCADA, Math.max(...caixas.map((c) => c.peca.x + c.g.largura)) + 30);
    const y1 = Math.min(ALTURA_BANCADA, Math.max(...caixas.map((c) => c.peca.y + c.g.altura)) + 24);
    return `${x0} ${y0} ${Math.max(300, x1 - x0)} ${Math.max(200, y1 - y0)}`;
  }, [circuito.pecas]);
  const [camera, setCamera] = useState<Quadro | null>(null);
  const [tamanho, setTamanho] = useState({ largura: LARGURA_BANCADA, altura: ALTURA_BANCADA });
  const pontos = useRef(new Map<number, PontoTela>());
  const navegacao = useRef<Navegacao | null>(null);
  const ignorarClick = useRef(false);
  const toqueNoCorpo = useRef<string | null>(null);
  const quadro = camera ?? lerQuadro(enquadramento);
  const escala = Math.min(tamanho.largura / quadro.largura, tamanho.altura / quadro.altura);
  useEffect(() => {
    const elemento = svg.current;
    if (!elemento) return;
    const observador = new ResizeObserver(() => {
      const caixa = elemento.getBoundingClientRect();
      setTamanho({ largura: Math.max(1, caixa.width), altura: Math.max(1, caixa.height) });
    });
    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  const ampliar = (fator: number) => {
    const fatorReal = Math.max(0.15, Math.min(4, escala * fator)) / escala;
    const largura = quadro.largura / fatorReal;
    const altura = quadro.altura / fatorReal;
    setCamera({ x: quadro.x + (quadro.largura - largura) / 2, y: quadro.y + (quadro.altura - altura) / 2, largura, altura });
  };

  const pontoNaBancada = (evento: { clientX: number; clientY: number }) => {
    const matriz = svg.current?.getScreenCTM();
    if (!svg.current || !matriz) return { x: 0, y: 0 };
    const ponto = new DOMPoint(evento.clientX, evento.clientY).matrixTransform(matriz.inverse());
    return { x: ponto.x, y: ponto.y };
  };

  const apertarCorpo = (id: string) => (evento: PointerEvent<SVGGElement>) => {
    const peca = porId.get(id);
    if (!peca || pontos.current.size > 1) return;
    evento.stopPropagation();
    svg.current?.setPointerCapture(evento.pointerId);
    arrasto.current = { id, inicio: pontoNaBancada(evento), origem: { x: peca.x, y: peca.y }, andou: false };
    setCamera(quadro);
  };

  const apertarArea = (evento: PointerEvent<SVGSVGElement>) => {
    if (evento.button !== 0) return;
    if (pontos.current.size === 0) { ignorarClick.current = false; toqueNoCorpo.current = null; }
    pontos.current.set(evento.pointerId, evento);
    if (pontos.current.size >= 2) {
      const [a, b] = [...pontos.current.values()];
      arrasto.current = null;
      navegacao.current = { tipo: "pinca", distancia: Math.max(1, distancia(a, b)), ancora: pontoNaBancada(meio(a, b)), quadro, escala };
      for (const id of pontos.current.keys()) svg.current?.setPointerCapture(id);
      ignorarClick.current = true;
    }
  };
  const comecarArrastoArea = (evento: PointerEvent<SVGSVGElement>) => {
    if (evento.target !== svg.current || pontos.current.size > 1) return;
    svg.current?.setPointerCapture(evento.pointerId);
    navegacao.current = { tipo: "arrastar", inicio: evento, quadro, escala };
  };

  const mover = (evento: PointerEvent<SVGSVGElement>) => {
    if (pontos.current.has(evento.pointerId)) pontos.current.set(evento.pointerId, evento);
    const gesto = navegacao.current;
    if (gesto?.tipo === "pinca" && pontos.current.size >= 2) {
      const [a, b] = [...pontos.current.values()];
      const fator = Math.max(0.15, Math.min(4, gesto.escala * distancia(a, b) / gesto.distancia)) / gesto.escala;
      const largura = gesto.quadro.largura / fator;
      const altura = gesto.quadro.altura / fator;
      const caixa = svg.current!.getBoundingClientRect();
      const centro = meio(a, b);
      const novaEscala = gesto.escala * fator;
      setCamera({ largura, altura, x: gesto.ancora.x - largura / 2 - (centro.clientX - caixa.x - caixa.width / 2) / novaEscala, y: gesto.ancora.y - altura / 2 - (centro.clientY - caixa.y - caixa.height / 2) / novaEscala });
      return;
    }
    if (gesto?.tipo === "arrastar") {
      const dx = evento.clientX - gesto.inicio.clientX;
      const dy = evento.clientY - gesto.inicio.clientY;
      if (Math.hypot(dx, dy) > 6) ignorarClick.current = true;
      setCamera({ ...gesto.quadro, x: gesto.quadro.x - dx / gesto.escala, y: gesto.quadro.y - dy / gesto.escala });
      return;
    }
    const atual = arrasto.current;
    if (!atual) return;
    const agora = pontoNaBancada(evento);
    const dx = agora.x - atual.inicio.x;
    const dy = agora.y - atual.inicio.y;
    if (!atual.andou && Math.hypot(dx, dy) < 6) return;
    atual.andou = true;
    ignorarClick.current = true;
    aoMover(atual.id, atual.origem.x + dx, atual.origem.y + dy);
  };

  const soltar = (evento: PointerEvent<SVGSVGElement>) => {
    const atual = arrasto.current;
    arrasto.current = null;
    pontos.current.delete(evento.pointerId);
    if (navegacao.current) {
      // Até todos os dedos saírem, não transforma o fim de uma pinça em toque.
      if (!pontos.current.size) navegacao.current = null;
      return;
    }
    if (!atual || atual.andou) return;
    // O click ainda pertence à bancada antiga. Mudar a fase no pointerup
    // permitia que o click seguinte acertasse um botão recém-aberto sob o dedo.
    toqueNoCorpo.current = atual.id;
  };

  const tocarCorpo = (id: string, evento: { clientX: number; clientY: number }) => {
    const peca = porId.get(id);
    if (!peca) return;
    const entradas = geometriaDa(peca).entradas;
    if (puxando && puxando !== id && entradas.length > 0) {
      const ponto = pontoNaBancada(evento);
      const porta = entradas.reduce((melhor, p, i) => (Math.abs(p.y - ponto.y) < Math.abs(entradas[melhor].y - ponto.y) ? i : melhor), 0);
      aoLigar(puxando, id, porta);
      setPuxando(null);
      return;
    }
    if (peca.tipo === "entrada") aoAlternar(peca.id);
    else setEscolha({ tipo: "peca", id });
  };

  const tocarEntradaDe = (id: string, porta: number) => {
    if (puxando && puxando !== id) {
      aoLigar(puxando, id, porta);
      setPuxando(null);
      return;
    }
    setEscolha(null);
  };

  const pecaEscolhida = escolha?.tipo === "peca" ? porId.get(escolha.id) : undefined;
  const botaoPaleta =
    "inline-flex min-h-11 min-w-11 touch-manipulation items-center justify-center gap-1 rounded-xl border-2 border-borda bg-superficie px-2.5 text-sm font-black text-texto hover:border-primaria hover:text-primaria pointer-coarse:h-11 pointer-coarse:min-w-11";

  return (
    <div className="flex h-full min-h-0 flex-col bg-circuito-fundo" data-bancada-circuito>
      <div
        className={`flex shrink-0 flex-wrap items-center gap-1.5 border-b-2 border-borda bg-painel px-2 py-1.5 ${destaque === "paleta" ? "animate-pulse rounded-lg shadow-[inset_0_0_0_3px_var(--cor-destaque)]" : ""}`}
        data-paleta-circuito
      >
        <span className="text-xs font-bold text-texto-suave max-sm:sr-only">Portões:</span>
        {paleta.map((portao) => (
          <button key={portao} type="button" className={botaoPaleta} onClick={() => aoAdicionar(portao)} data-portao-paleta={portao} aria-label={`Pôr um portão ${NOME_DO_PORTAO[portao]} na bancada`}>
            {portao === "xou" ? "OU excl." : NOME_DO_PORTAO[portao]}
            {portao === "xou" && <span className="rounded-full bg-hover px-1.5 text-[10px] font-bold text-texto-suave">extra</span>}
          </button>
        ))}
        <span className="flex-1" />
        {pecaEscolhida && !pecaEscolhida.fixa && (
          <button
            type="button"
            className={`${botaoPaleta} border-erro text-erro`}
            onClick={() => {
              aoApagarPeca(pecaEscolhida.id);
              setEscolha(null);
            }}
            data-apagar-peca
          >
            Tirar peça
          </button>
        )}
        {escolha?.tipo === "fio" && (
          <button
            type="button"
            className={`${botaoPaleta} border-erro text-erro`}
            onClick={() => {
              aoApagarFio(escolha.para, escolha.porta);
              setEscolha(null);
            }}
            data-apagar-fio
          >
            Tirar fio
          </button>
        )}
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-1.5 px-2 py-1" aria-label="Navegação do circuito">
        <BotaoNavegacaoCircuito className={botaoPaleta} rotulo="Aumentar zoom do circuito" aoAtivar={() => ampliar(1.25)}>+</BotaoNavegacaoCircuito>
        <BotaoNavegacaoCircuito className={botaoPaleta} rotulo="Diminuir zoom do circuito" aoAtivar={() => ampliar(0.8)}>−</BotaoNavegacaoCircuito>
        <BotaoNavegacaoCircuito className={botaoPaleta} rotulo="Ajustar à tela" aoAtivar={() => setCamera(null)} />
        <span className="text-xs font-bold text-texto-suave" aria-live="polite" data-zoom-circuito>{Math.round(escala * 100)}%</span>
      </div>
      <p className={`shrink-0 px-2 py-0.5 text-xs ${puxando ? "font-bold text-primaria" : "text-texto-suave"} ${toque ? "truncate" : ""}`} data-dica-bancada>
        {puxando
          ? toque
            ? "Agora toque na outra peça (perto da bolinha da esquerda)."
            : "Clique numa bolinha da esquerda de outra peça para ligar o fio."
          : toque
            ? "Fio: direita e depois outra peça. Pinça amplia; arraste o fundo para mover."
            : "Clique na bolinha da direita de uma peça para puxar um fio. Clique numa chave para ligar."}
      </p>
      <svg
        ref={svg}
        viewBox={`${quadro.x} ${quadro.y} ${quadro.largura} ${quadro.altura}`}
        preserveAspectRatio="xMidYMid meet"
        className="min-h-0 w-full flex-1 touch-none select-none"
        onPointerDownCapture={apertarArea}
        onPointerDown={comecarArrastoArea}
        onPointerMove={mover}
        onClickCapture={(evento) => {
          if (ignorarClick.current) { evento.preventDefault(); evento.stopPropagation(); return; }
          const corpo = toqueNoCorpo.current;
          toqueNoCorpo.current = null;
          if (corpo) {
            evento.preventDefault();
            evento.stopPropagation();
            tocarCorpo(corpo, evento);
          }
        }}
        onPointerUp={soltar}
        onPointerCancel={(evento) => {
          arrasto.current = null;
          pontos.current.delete(evento.pointerId);
          if (!pontos.current.size) navegacao.current = null;
        }}
        onClick={(evento) => {
          if (evento.target === svg.current) {
            setPuxando(null);
            setEscolha(null);
          }
        }}
        role="application"
        aria-label="Bancada do circuito"
        data-puxando={puxando ?? ""}
      >
        <defs>
          {alvos.map((alvo) => <clipPath key={alvo.id} id={`${prefixoAlvos}-${alvo.id}`} clipPathUnits="userSpaceOnUse"><polygon points={celulaDoAlvo(alvo, alvos).map((p) => `${p.x},${p.y}`).join(" ")} /></clipPath>)}
          <pattern id="grade-bancada" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="var(--cor-circuito-grade)" />
          </pattern>
        </defs>
        <rect x={-LARGURA_BANCADA} y={-ALTURA_BANCADA} width={LARGURA_BANCADA * 3} height={ALTURA_BANCADA * 3} fill="url(#grade-bancada)" pointerEvents="none" />
        {circuito.fios.map((fio) => {
          const de = porId.get(fio.de);
          const para = porId.get(fio.para);
          const saida = de ? geometriaDa(de).saida : null;
          const entrada = para ? geometriaDa(para).entradas[fio.porta] : null;
          if (!saida || !entrada) return null;
          const d = caminhoDoFio(saida, entrada);
          const aceso = fios[fioChave(fio)];
          const escolhido = escolha?.tipo === "fio" && escolha.para === fio.para && escolha.porta === fio.porta;
          return (
            <g key={fioChave(fio)} onClick={() => setEscolha({ tipo: "fio", para: fio.para, porta: fio.porta })} data-fio={fioChave(fio)} data-fio-aceso={aceso ? "sim" : "nao"}>
              <path d={d} stroke="transparent" strokeWidth={Math.max(14, 44 / escala)} fill="none" style={{ cursor: "pointer" }} />
              <path d={d} stroke={escolhido ? "var(--cor-primaria)" : aceso ? "var(--cor-fio-ligado)" : "var(--cor-fio-desligado)"} strokeWidth={aceso ? 5 : 3.5} fill="none" strokeLinecap="round" />
              {aceso && <path d={d} stroke="var(--cor-superficie)" strokeWidth={2} fill="none" strokeDasharray="4 14" className="corrente-no-fio" pointerEvents="none" />}
            </g>
          );
        })}
        {circuito.pecas.map((peca) => (
          <PecaCircuito
            key={peca.id}
            peca={peca}
            acesa={Boolean(valores[peca.id])}
            selecionada={escolha?.tipo === "peca" && escolha.id === peca.id}
            destacada={destaque === peca.id}
            puxando={puxando === peca.id}
            escala={escala}
            prefixoAlvos={prefixoAlvos}
            aoApertarCorpo={apertarCorpo(peca.id)}
            aoTocarSaida={() => {
              setEscolha(null);
              setPuxando((atual) => (atual === peca.id ? null : peca.id));
            }}
            aoTocarEntrada={(porta) => tocarEntradaDe(peca.id, porta)}
          />
        ))}
      </svg>
    </div>
  );
}
