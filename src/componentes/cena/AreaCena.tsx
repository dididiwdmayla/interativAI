"use client";

/*
 * A área "cena" de uma fase composta: o desenho da cena e a barra de
 * controle (tocar e pausar, a barra de tempo da simulação e a velocidade:
 * 1x, 2x e 4x).
 *
 * O relógio da animação mora AQUI (não no jogo inteiro: só a cena redesenha
 * a cada quadro). Cada Executar traz um rastro novo e a cena toca sozinha,
 * do começo; o Console toca só o pedaço que ele andou. A linha do tempo da
 * execução anda junto: a cena avisa quando passa de um passo para o outro
 * (`aoPassar`) e, quando o aluno escolhe um passo lá, a cena vai para o
 * instante dele (`foco`), mostrando só as mudanças até aquele passo.
 */
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { IconeTocar } from "@/componentes/icones/IconeTocar";
import { type DadosCena, estadoNoTempo, fimDaAnimacao, type FiltroPasso, type RastroCena, rastroInicial, textoDoTempo } from "@/motor/cena/modelo";
import { CenaSvg } from "./CenaSvg";
import { FichaDispositivo } from "./FichaDispositivo";

export const VELOCIDADES = [1, 2, 4] as const;
export type VelocidadeCena = (typeof VELOCIDADES)[number];

/** Ir para um instante de fora (a linha do tempo da execução escolheu um passo). `chave` muda a cada pedido. */
export type FocoCena = { tempoMs: number; filtro: FiltroPasso | null; chave: number };

type Props = {
  dados: DadosCena;
  /** A simulação de agora (null: nada rodou, a cena anda sozinha). */
  rastro: RastroCena | null;
  velocidade: VelocidadeCena;
  aoMudarVelocidade: (velocidade: VelocidadeCena) => void;
  /** O instante de cada passo da última execução (a linha do tempo). */
  temposDosPassos?: readonly (number | undefined)[];
  /** A cena passou para outro passo da linha do tempo (tocando ou arrastando a barra). */
  aoPassar?: (indice: number) => void;
  foco?: FocoCena | null;
  /** Tocar num dispositivo: abre a ficha dele. */
  aoTocarDispositivo?: (id: string) => void;
  /** A ficha aberta (o dispositivo e se está no "por dentro"). */
  ficha?: { dispositivo: string; porDentro: boolean } | null;
  aoVerPorDentro?: (id: string) => void;
  aoVoltarDaFicha?: () => void;
  aoFecharFicha?: () => void;
  /** O nome da cena numa faixa em cima (no computador; no celular, ele já está no cabeçalho ou na aba). */
  mostrarTitulo: boolean;
  /** Embrulha o desenho (o alvo da apresentação da ficha) e o seletor de velocidade. */
  alvoDesenho?: (desenho: ReactNode) => ReactNode;
  alvoVelocidade?: (seletor: ReactNode) => ReactNode;
};

/** O último passo que já tinha acontecido no instante (os passos andam em ordem de tempo). */
function passoNoTempo(tempos: readonly (number | undefined)[], tempoMs: number): number {
  let indice = 0;
  for (let i = 0; i < tempos.length; i++) {
    const t = tempos[i];
    if (t === undefined || t > tempoMs) break;
    indice = i;
  }
  return indice;
}

function avisoDoRastro(rastro: RastroCena | null): string | null {
  if (!rastro || rastro.fimCodigoMs === null) return null;
  if (rastro.terminouPorTempo) return `A simulação terminou: ${textoDoTempo(rastro.duracaoMs)} de cena.`;
  if (rastro.fimCodigoMs < rastro.duracaoMs) return `O código parou em ${textoDoTempo(rastro.fimCodigoMs)}; a cena continua.`;
  return null;
}

export function AreaCena({
  dados,
  rastro: rastroDaExecucao,
  velocidade,
  aoMudarVelocidade,
  temposDosPassos = [],
  aoPassar,
  foco = null,
  aoTocarDispositivo,
  ficha = null,
  aoVerPorDentro,
  aoVoltarDaFicha,
  aoFecharFicha,
  mostrarTitulo,
  alvoDesenho = (desenho) => desenho,
  alvoVelocidade = (seletor) => seletor,
}: Props) {
  const inicial = useMemo(() => rastroInicial(dados), [dados]);
  const rastro = rastroDaExecucao ?? inicial;
  const [tempoMs, setTempoMs] = useState(0);
  const [tocando, setTocando] = useState(false);
  /** Até onde a cena toca agora: o fim da execução (sozinha) ou o fim da cena (o botão de tocar). */
  const [ate, setAte] = useState(dados.duracaoMs);
  const [filtro, setFiltro] = useState<FiltroPasso | null>(null);
  const tempoAtual = useRef(0);
  const ultimoPasso = useRef<number | null>(null);
  const temposAtuais = useRef(temposDosPassos);
  const aoPassarAtual = useRef(aoPassar);
  useEffect(() => {
    temposAtuais.current = temposDosPassos;
    aoPassarAtual.current = aoPassar;
  }, [aoPassar, temposDosPassos]);
  useEffect(() => {
    tempoAtual.current = tempoMs;
  }, [tempoMs]);
  // Execução nova: a linha do tempo dela começa do primeiro passo.
  useEffect(() => {
    ultimoPasso.current = null;
  }, [rastroDaExecucao]);

  // Uma execução nova: a cena toca do começo dela (o Snippet do zero; o Console, o pedaço que andou).
  const [rastroVisto, setRastroVisto] = useState(rastroDaExecucao);
  if (rastroDaExecucao !== rastroVisto) {
    setRastroVisto(rastroDaExecucao);
    if (rastroDaExecucao) {
      const inicio = rastroDaExecucao.inicioUltimaMs;
      // Nada rodou ainda (só a memória que voltou): a cena fica parada no instante de agora.
      const fim = rastroDaExecucao.fimCodigoMs === null ? inicio : fimDaAnimacao(rastroDaExecucao);
      setFiltro(null);
      setTempoMs(inicio);
      setAte(fim);
      setTocando(fim > inicio);
    }
  }

  // A linha do tempo escolheu um passo: a cena vai para o instante dele, com as mudanças até ali.
  const [focoVisto, setFocoVisto] = useState(foco);
  if (foco !== focoVisto) {
    setFocoVisto(foco);
    if (foco) {
      setTocando(false);
      setFiltro(foco.filtro);
      setTempoMs(foco.tempoMs);
    }
  }

  /** Muda o instante e avisa a linha do tempo quando passa de um passo para outro. */
  const irPara = (ms: number) => {
    tempoAtual.current = ms;
    setTempoMs(ms);
    if (!temposAtuais.current.length) return;
    const indice = passoNoTempo(temposAtuais.current, ms);
    if (indice !== ultimoPasso.current) {
      ultimoPasso.current = indice;
      aoPassarAtual.current?.(indice);
    }
  };
  const irParaAtual = useRef(irPara);
  useEffect(() => {
    irParaAtual.current = irPara;
  });

  // O relógio da animação: anda na velocidade escolhida até o fim.
  useEffect(() => {
    if (!tocando) return;
    let quadro = 0;
    let antes: number | null = null;
    const andar = (agora: number) => {
      const passou = antes === null ? 0 : agora - antes;
      antes = agora;
      const proximo = Math.min(ate, tempoAtual.current + passou * velocidade);
      irParaAtual.current(proximo);
      if (proximo >= ate) {
        setTocando(false);
        return;
      }
      quadro = requestAnimationFrame(andar);
    };
    quadro = requestAnimationFrame(andar);
    return () => cancelAnimationFrame(quadro);
  }, [ate, tocando, velocidade]);

  const tocar = () => {
    setFiltro(null);
    setAte(dados.duracaoMs);
    // No fim (ou perto dele), tocar de novo começa do zero.
    if (tempoAtual.current >= dados.duracaoMs - 1) {
      ultimoPasso.current = null;
      irPara(0);
    }
    setTocando(true);
  };

  const botao =
    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-primaria bg-primaria text-sobre-primaria hover:brightness-110 pointer-coarse:h-11 pointer-coarse:w-11";
  const seletor = (
    <div role="radiogroup" aria-label="Velocidade da simulação" className="inline-flex shrink-0 rounded-full border-2 border-borda bg-superficie p-0.5" data-velocidade-cena={velocidade}>
      {VELOCIDADES.map((opcao) => (
        <button
          key={opcao}
          type="button"
          role="radio"
          aria-checked={velocidade === opcao}
          onClick={() => aoMudarVelocidade(opcao)}
          className={`min-h-7 min-w-8 rounded-full px-1.5 text-xs font-black pointer-coarse:min-h-10 pointer-coarse:min-w-10 ${velocidade === opcao ? "bg-primaria text-sobre-primaria" : "text-texto-suave hover:text-texto"}`}
          data-velocidade={opcao}
        >
          {opcao}x
        </button>
      ))}
    </div>
  );
  const fichaDoDispositivo = ficha ? (dados.dispositivos.find((d) => d.id === ficha.dispositivo) ?? null) : null;
  const aviso = !tocando && rastroDaExecucao && tempoMs >= fimDaAnimacao(rastroDaExecucao) - 1 ? avisoDoRastro(rastroDaExecucao) : null;
  return (
    <div
      className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border-2 border-borda bg-painel shadow-[0_8px_0_var(--cor-sombra)]"
      data-area-cena={dados.id}
      data-tocando={tocando ? "sim" : "nao"}
      data-ate-cena={Math.round(ate)}
    >
      {mostrarTitulo && (
        <p className="shrink-0 truncate border-b-2 border-borda px-3 py-1 text-xs font-black text-texto" data-titulo-cena>
          {dados.titulo}
        </p>
      )}
      <div className="relative min-h-0 flex-1 p-1.5">
        {alvoDesenho(<CenaSvg dados={dados} rastro={rastro} tempoMs={tempoMs} filtro={filtro} aoTocarDispositivo={aoTocarDispositivo} destacado={ficha?.dispositivo ?? null} />)}
        {aviso && (
          <span className="pointer-events-none absolute bottom-2 left-1/2 max-w-[92%] -translate-x-1/2 truncate rounded-full border-2 border-borda bg-superficie/95 px-3 py-0.5 text-xs font-bold text-texto" data-aviso-cena>
            {aviso}
          </span>
        )}
      </div>
      <FichaDispositivo
        dispositivo={fichaDoDispositivo}
        estado={fichaDoDispositivo ? estadoNoTempo(rastro, tempoMs, { filtro })[fichaDoDispositivo.id] : undefined}
        porDentro={ficha?.porDentro ?? false}
        aoVerPorDentro={() => fichaDoDispositivo && aoVerPorDentro?.(fichaDoDispositivo.id)}
        aoVoltar={() => aoVoltarDaFicha?.()}
        aoFechar={() => aoFecharFicha?.()}
      />
      <div className="flex shrink-0 items-center gap-2 border-t-2 border-borda bg-painel px-2 py-1.5">
        <button type="button" className={botao} onClick={tocando ? () => setTocando(false) : tocar} aria-label={tocando ? "Pausar a cena" : "Tocar a cena"} data-tocar-cena>
          <IconeTocar pausar={tocando} />
        </button>
        <input
          type="range"
          min={0}
          max={dados.duracaoMs}
          step={50}
          value={Math.min(dados.duracaoMs, Math.round(tempoMs))}
          onChange={(evento) => {
            setTocando(false);
            setFiltro(null);
            irPara(Number(evento.target.value));
          }}
          aria-label="Tempo da cena"
          aria-valuetext={`${textoDoTempo(tempoMs)} de ${textoDoTempo(dados.duracaoMs)}`}
          className="h-8 min-w-0 flex-1 accent-primaria pointer-coarse:h-11"
          data-barra-cena
        />
        <span className="shrink-0 font-mono text-xs font-bold tabular-nums text-texto" data-relogio-cena>
          {textoDoTempo(tempoMs)}
        </span>
        {alvoVelocidade(seletor)}
      </div>
    </div>
  );
}
